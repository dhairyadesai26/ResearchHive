from dotenv import load_dotenv
from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from rich import print
load_dotenv()



tavily=TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query:str)->str:
    """Search the web for information based on the given query."""
    results=tavily.search(query=query,max_results=5)
    out=[]
    for r in results['results']:
        out.append(
            f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\r "
        )
    return "\n----\n".join(out)

@tool
def scrape_url(url:str)->str:
    """Scrape and extract text content from a given URL."""
    try:
        response=requests.get(url,headers={"User-Agent":"Mozilla/5.0"})
        soup=BeautifulSoup(response.text,'html.parser')
        return soup.get_text(seperator=" ",strip=True)[:3000]
    except Exception as e:
        return f"Error scraping {url}: {e}"