import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.tools import tool

load_dotenv()

@tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

llm = ChatGroq(model="qwen/qwen3.8-27b")
llm_with_tools = llm.bind_tools([add])

try:
    res = llm_with_tools.invoke("What is 5 + 5?")
    print("SUCCESS", res)
except Exception as e:
    print("ERROR", str(e))
