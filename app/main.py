from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from opensearchpy import OpenSearch
import asyncio
from opensearch_client import bootstrap_open_search_client
from embedder_client import bootstrap_embedder
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    size: int = 10
    from_: int = 0

opensearch_client = bootstrap_open_search_client()
query_embedder = bootstrap_embedder(embedder_name="mock")

@app.post("/api/lexical_search")
async def lexical_search_documents(resuest: SearchRequest):
    try:
        lexical_search_results, total = opensearch_client.lexical_search(resuest.query, top_k=10)
        return {
            "results": lexical_search_results,
            "total": total
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/semantic_search")
async def semantic_search_documents(resuest: SearchRequest):
    try:
        query_vector = query_embedder.embed(resuest.query)
        semantic_search_results = opensearch_client.semantic_search(query_vector, top_k=10)
        return {
            "results": semantic_search_results
        }
    
    except Exception as e:
        return {"error": str(e)}