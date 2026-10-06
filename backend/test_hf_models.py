import os
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

load_dotenv()

models = [
    "meta-llama/Meta-Llama-3-8B-Instruct",
    "meta-llama/Llama-3.1-8B-Instruct",
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3"
]

for m in models:
    try:
        llm = HuggingFaceEndpoint(repo_id=m)
        chat = ChatHuggingFace(llm=llm)
        chat.invoke("Hi")
        print(f"SUCCESS: {m}")
    except Exception as e:
        print(f"FAIL: {m}")
