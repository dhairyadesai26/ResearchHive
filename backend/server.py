"""
FastAPI server for the Multi-Agent AI Research Pipeline.
Exposes the research pipeline as an API with Server-Sent Events streaming.
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import json
import uuid
import asyncio
import base64
import os
from datetime import datetime
from pipeline import run_research_pipeline_stream

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db, async_session_maker
from database.models import ResearchRun

def get_user_id(authorization: str = Header(None, alias="Authorization"), token: str = None):
    print(f"DEBUG AUTH: received authorization header: '{authorization}', token param: '{token}'")
    # Try header first, then query parameter (for EventSource)
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ")[1]
        
    if not token:
        print("DEBUG AUTH: Token is empty or None")
        raise HTTPException(status_code=401, detail="Unauthorized (no token)")
        
    parts = token.split(".")
    if len(parts) != 3:
        print(f"DEBUG AUTH: Token has {len(parts)} parts, expected 3")
        raise HTTPException(status_code=401, detail=f"Invalid token (parts: {len(parts)})")
    
    payload_b64 = parts[1]
    payload_b64 += "=" * ((4 - len(payload_b64) % 4) % 4)
    
    try:
        payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
        payload = json.loads(payload_json)
        sub = payload.get("sub")
        if not sub:
            print("DEBUG AUTH: No 'sub' in payload")
            raise HTTPException(status_code=401, detail="Unauthorized (no sub)")
        return sub
    except Exception as e:
        print(f"DEBUG AUTH: Exception during decode: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token encoding: {str(e)}")

app = FastAPI(
    title="ResearchHive",
    description="Autonomous research powered by LangChain + Mistral AI",
    version="1.0.0",
)

origins = [
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:3000", 
    "http://127.0.0.1:5173", 
    "http://127.0.0.1:5174"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Handle multiple frontend URLs if comma-separated, and strip any accidental trailing slashes
    origins.extend([url.strip().rstrip("/") for url in frontend_url.split(",")])

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500, description="The research topic")


class ResearchResponse(BaseModel):
    run_id: str
    topic: str
    status: str
    created_at: str


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "multi-agent-research-pipeline", "timestamp": datetime.now().isoformat()}


@app.post("/api/research", response_model=ResearchResponse)
async def start_research(request: ResearchRequest, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    """Start a new research pipeline run."""
    run_id = str(uuid.uuid4())[:8]
    
    run_record = ResearchRun(
        runId=run_id,
        userId=user_id,
        topic=request.topic,
        status="pending",
        results={}
    )
    db.add(run_record)
    await db.commit()
    await db.refresh(run_record)

    return ResearchResponse(
        run_id=run_id,
        topic=request.topic,
        status="pending",
        created_at=run_record.createdAt.isoformat(),
    )


@app.get("/api/research/{run_id}/stream")
async def stream_research(run_id: str, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    """Stream research pipeline progress via Server-Sent Events."""
    result = await db.execute(select(ResearchRun).where(ResearchRun.runId == run_id))
    run_record = result.scalars().first()

    if not run_record or run_record.userId != user_id:
        raise HTTPException(status_code=404, detail="Research run not found")

    if run_record.status == "completed":
        raise HTTPException(status_code=400, detail="Research already completed")

    topic = run_record.topic

    async def event_generator():
        async with async_session_maker() as session:
            try:
                await session.execute(
                    update(ResearchRun)
                    .where(ResearchRun.runId == run_id)
                    .values(status="running")
                )
                await session.commit()

                # Send start event
                yield f"data: {json.dumps({'type': 'start', 'topic': topic, 'run_id': run_id})}\n\n"

                # Run the pipeline with streaming
                loop = asyncio.get_event_loop()
                results = {}

                for event in await loop.run_in_executor(None, lambda: list(run_research_pipeline_stream(topic))):
                    yield f"data: {json.dumps(event)}\n\n"

                    # Store results as they come
                    if event["type"] == "step_result":
                        results[event["step"]] = event.get("content", "")
                    elif event["type"] == "report":
                        results["report"] = event.get("content", "")
                    elif event["type"] == "feedback":
                        results["feedback"] = event.get("content", "")

                await session.execute(
                    update(ResearchRun)
                    .where(ResearchRun.runId == run_id)
                    .values(
                        status="completed", 
                        results=results
                    )
                )
                await session.commit()

                yield f"data: {json.dumps({'type': 'complete', 'run_id': run_id})}\n\n"

            except Exception as e:
                await session.execute(
                    update(ResearchRun)
                    .where(ResearchRun.runId == run_id)
                    .values(status="error")
                )
                await session.commit()
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/research")
async def list_research(user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    """List all research runs for the user."""
    result = await db.execute(
        select(ResearchRun)
        .where(ResearchRun.userId == user_id)
        .order_by(ResearchRun.createdAt.desc())
    )
    runs = result.scalars().all()
    
    formatted_runs = []
    for run in runs:
        formatted_runs.append({
            "run_id": run.runId,
            "topic": run.topic,
            "status": run.status,
            "created_at": run.createdAt.isoformat()
        })
        
    return {"runs": formatted_runs}


@app.get("/api/research/{run_id}")
async def get_research(run_id: str, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    """Get results of a completed research run."""
    result = await db.execute(select(ResearchRun).where(ResearchRun.runId == run_id))
    run_record = result.scalars().first()

    if not run_record or run_record.userId != user_id:
        raise HTTPException(status_code=404, detail="Research run not found")
        
    results_dict = run_record.results if run_record.results else {}

    return {
        "run_id": run_record.runId,
        "topic": run_record.topic,
        "status": run_record.status,
        "created_at": run_record.createdAt.isoformat(),
        "results": results_dict
    }


@app.delete("/api/research/{run_id}")
async def delete_research(run_id: str, user_id: str = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    """Delete a research run from history."""
    result = await db.execute(select(ResearchRun).where(ResearchRun.runId == run_id))
    run_record = result.scalars().first()

    if not run_record or run_record.userId != user_id:
        raise HTTPException(status_code=404, detail="Research run not found")
        
    await db.execute(delete(ResearchRun).where(ResearchRun.runId == run_id))
    await db.commit()
    
    return {"status": "success", "message": "Research deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
