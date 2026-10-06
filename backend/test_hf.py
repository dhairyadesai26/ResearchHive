import os
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.tools import tool

load_dotenv()

@tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

llm = HuggingFaceEndpoint(repo_id="Qwen/Qwen2.5-72B-Instruct")
chat_model = ChatHuggingFace(llm=llm)
chat_model_with_tools = chat_model.bind_tools([add])

try:
    res = chat_model_with_tools.invoke("What is 5 + 5?")
    print("SUCCESS", res)
except Exception as e:
    print("ERROR", str(e))
