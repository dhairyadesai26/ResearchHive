<div align="center">

# 🧠 ResearchHive
**An Autonomous, Multi-Agent AI Research Pipeline**

[![Deploy](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://research-hive.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dhairyadesai26/ResearchHive)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](#)

*A full-stack, AI-powered research assistant that autonomously searches the web, scrapes deep content, drafts comprehensive reports, and critically evaluates its own work—all streamed in real-time.*

</div>

---

## 🚀 Overview

**ResearchHive** is an advanced AI research platform designed to automate the heavy lifting of internet research. Built on a modern, decoupled architecture, it leverages a specialized team of **LangChain AI Agents** powered by **Gemini** to mimic the workflow of a human researcher. 

Instead of waiting for a single long response, users watch the AI think in real-time. The backend utilizes **Server-Sent Events (SSE)** to stream live pipeline updates, agent thoughts, and final markdown reports directly to a stunning, glassmorphic React interface.

---

## ✨ Key Features

- **🤖 Multi-Agent AI Pipeline**: A sequential pipeline of specialized agents (Searcher, Reader, Writer, Critic).
- **⚡ Real-Time Streaming**: Live streaming of agent progress, internal states, and generation via Server-Sent Events (SSE).
- **🔐 Secure Authentication**: Integrated with **Supabase Auth** for secure, JWT-based user sessions and history isolation.
- **💾 Asynchronous Database**: Powered by **SQLAlchemy 2.0 (asyncpg)** and **Alembic** migrations for high-performance, non-blocking PostgreSQL operations.
- **🎨 Glassmorphic UI/UX**: A highly polished, responsive, and animated React frontend featuring Aurora backgrounds, skeleton loaders, and interactive history sidebars.
- **☁️ Cloud Native**: Fully containerized and deployed on **Render** (Backend) and **Vercel** (Frontend).

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client Layer)
- **Framework**: React + Vite (Vanilla CSS for custom, high-performance styling)
- **Real-Time Data**: Native `EventSource` API for handling SSE streams
- **Authentication**: Supabase Auth (JWT)
- **Markdown Rendering**: `react-markdown` with `remark-gfm`
- **Deployment**: Vercel

### Backend (API & Agent Layer)
- **Framework**: FastAPI (Python)
- **AI/LLM Engine**: LangChain + Gemini (`gemini-2.5-flash`)
- **Tools**: Tavily (Semantic Web Search), BeautifulSoup4 (Web Scraping)
- **Database ORM**: SQLAlchemy 2.0 (Async)
- **Migrations**: Alembic
- **Deployment**: Render Web Services

### Database (Data Layer)
- **Database**: PostgreSQL (Hosted on Supabase)
- **Connection Pooling**: PgBouncer (Transaction mode)

---

## 🧠 The Multi-Agent Pipeline

The core of ResearchHive is an autonomous pipeline where agents pass state sequentially:

1. 🔍 **Search Agent**: Receives the topic, formulates optimal search queries, and uses the Tavily API to fetch the most relevant and reliable web sources.
2. 📖 **Reader Agent**: Evaluates the search results, identifies the highest-value URL, and scrapes the raw HTML, parsing it into clean, readable text.
3. ✍️ **Writer Agent**: Synthesizes the aggregated data into a structured, highly detailed markdown report complete with citations.
4. 🧐 **Critic Agent**: Reviews the Writer's draft against strict criteria, assigning a score out of 10 and providing constructive feedback on strengths and weaknesses.

---

## 🛠️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/dhairyadesai26/ResearchHive.git
cd ResearchHive
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file based on .env.example
# Run database migrations
alembic upgrade head

# Start the FastAPI server
uvicorn server:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create a .env.local file with VITE_API_URL and Supabase credentials
npm run dev
```

---

## 📸 Portfolio Highlights

If you are evaluating this project, take note of the following engineering decisions:
- **Async Everywhere**: The entire FastAPI backend is built asynchronously. The database session yields via `async_session_maker`, and the LangChain pipeline execution is pushed to an `asyncio` thread pool to prevent blocking the SSE stream.
- **Stateless Streaming**: The SSE implementation securely validates JWTs via query parameters (required for `EventSource`) and handles graceful disconnects if the client drops.
- **Clean Database Architecture**: Ripped out restrictive ORMs (Prisma) in favor of a robust SQLAlchemy 2.0 + Alembic stack to properly handle Supabase's transaction poolers without caching errors.
- **Micro-Animations**: The frontend doesn't rely on massive UI libraries (like Tailwind or MUI). The glassmorphism, Aurora background, and seamless CSS transitions were built entirely from scratch.

---
<div align="center">
<i>Built by Dhairya Desai</i><br>
<a href="https://research-hive.vercel.app/">Live Demo</a> • <a href="https://github.com/dhairyadesai26/ResearchHive">GitHub Repository</a>
</div>
