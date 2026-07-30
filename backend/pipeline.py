from agents import build_reader_agent , build_search_agent , writer_chain , critic_chain


def run_research_pipeline_stream(topic: str):
    """
    Generator version of run_research_pipeline that yields structured events
    for real-time streaming via SSE.
    
    Yields dicts with:
      - type: 'step_start' | 'step_result' | 'report' | 'feedback'
      - step: step name
      - content: output content
    """
    state = {}

    # Step 1 — Search Agent
    yield {"type": "step_start", "step": "search", "title": "Search Agent", "message": "Searching the web for relevant information..."}

    try:
        search_agent = build_search_agent()
        search_result = search_agent.invoke({
            "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
        })
        content = search_result['messages'][-1].content
        state["search_results"] = content if isinstance(content, str) else str(content)
        yield {"type": "step_result", "step": "search", "content": state["search_results"][:500]}
    except Exception as e:
        yield {"type": "error", "step": "search", "message": f"Search agent failed: {str(e)}"}
        return

    # Step 2 — Reader Agent
    yield {"type": "step_start", "step": "reader", "title": "Reader Agent", "message": "Scraping top resources for deeper content..."}

    try:
        reader_agent = build_reader_agent()
        reader_result = reader_agent.invoke({
            "messages": [("user",
                f"Based on the following search results about '{topic}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{state['search_results'][:800]}"
            )]
        })
        content = reader_result['messages'][-1].content
        state['scraped_content'] = content if isinstance(content, str) else str(content)
        yield {"type": "step_result", "step": "reader", "content": state['scraped_content'][:500]}
    except Exception as e:
        yield {"type": "error", "step": "reader", "message": f"Reader agent failed: {str(e)}"}
        return

    # Step 3 — Writer Agent
    yield {"type": "step_start", "step": "writer", "title": "Writer Agent", "message": "Drafting the research report..."}

    try:
        research_combined = (
            f"SEARCH RESULTS : \n {state['search_results']} \n\n"
            f"DETAILED SCRAPED CONTENT : \n {state['scraped_content']}"
        )
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })
        if not isinstance(state["report"], str):
            state["report"] = str(state["report"])
        yield {"type": "step_result", "step": "writer", "content": state["report"][:300]}
        yield {"type": "report", "content": state["report"]}
    except Exception as e:
        yield {"type": "error", "step": "writer", "message": f"Writer agent failed: {str(e)}"}
        return

    # Step 4 — Critic Agent
    yield {"type": "step_start", "step": "critic", "title": "Critic Agent", "message": "Reviewing and scoring the report..."}

    try:
        state["feedback"] = critic_chain.invoke({
            "report": state['report']
        })
        if not isinstance(state["feedback"], str):
            state["feedback"] = str(state["feedback"])
        yield {"type": "step_result", "step": "critic", "content": state["feedback"][:300]}
        yield {"type": "feedback", "content": state["feedback"]}
    except Exception as e:
        yield {"type": "error", "step": "critic", "message": f"Critic agent failed: {str(e)}"}
        return


def run_research_pipeline(topic : str) -> dict:

    state = {}

    #search agent working 
    print("\n"+" ="*50)
    print("step 1 - search agent is working ...")
    print("="*50)

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages" : [("user", f"Find recent, reliable and detailed information about: {topic}")]
    })
    state["search_results"] = search_result['messages'][-1].content

    print("\n search result ",state['search_results'])

    #step 2 - reader agent 
    print("\n"+" ="*50)
    print("step 2 - Reader agent is scraping top resources ...")
    print("="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user",
            f"Based on the following search results about '{topic}', "
            f"pick the most relevant URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )]
    })

    state['scraped_content'] = reader_result['messages'][-1].content

    print("\nscraped content: \n", state['scraped_content'])

    #step 3 - writer chain 

    print("\n"+" ="*50)
    print("step 3 - Writer is drafting the report ...")
    print("="*50)

    research_combined = (
        f"SEARCH RESULTS : \n {state['search_results']} \n\n"
        f"DETAILED SCRAPED CONTENT : \n {state['scraped_content']}"
    )

    state["report"] = writer_chain.invoke({
        "topic" : topic,
        "research" : research_combined
    })

    print("\n Final Report\n",state['report'])

    #critic report 

    print("\n"+" ="*50)
    print("step 4 - critic is reviewing the report ")
    print("="*50)

    state["feedback"] = critic_chain.invoke({
        "report":state['report']
    })

    print("\n critic report \n", state['feedback'])

    return state



if __name__ == "__main__":
    topic = input("\n Enter a research topic : ")
    run_research_pipeline(topic)

