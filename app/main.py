from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from opensearchpy import OpenSearch
import asyncio
from opensearch_client import bootstrap_open_search_client
from embedder_client import bootstrap_embedder
from cohere_client import bootstrap_cohere_client
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
    size: int = 10000
    from_: int = 0

class FileRequest(BaseModel):
    doc_id: str

class SummarizeRequest(BaseModel):
    doc_id: str

opensearch_client = bootstrap_open_search_client()
query_embedder = bootstrap_embedder(embedder_name="mock")
cohere_client = bootstrap_cohere_client()

@app.post("/api/lexical_search")
async def lexical_search_documents(resuest: SearchRequest):
    try:
        lexical_search_results, total = opensearch_client.lexical_search(resuest.query, top_k=resuest.size)
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

@app.post("/api/get_file_content")
async def get_file_content(request: FileRequest):
    try:
        # Get the full document content from OpenSearch
        document = opensearch_client.get_document_by_id(request.doc_id)
        
        if document:
            return {
                "doc_id": request.doc_id,
                "content": document.content,
                "html_content": document.html_content if hasattr(document, 'html_content') else None,
                "file_url": document.file_url if hasattr(document, 'file_url') else None,
                "headline": document.headline,
                "court": document.court,
                "judges": document.judges,
                "decision_date": document.decision_date,
                "judgement_type": document.judgement_type
            }
        else:
            return {"error": "Document not found"}
    
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/summarize_document")
async def summarize_document(request: SummarizeRequest):
    try:
        # Get the full document content from OpenSearch
        document = opensearch_client.get_document_by_id(request.doc_id)
        
        if document:
            # Use CohereClient to summarize the document
            summary = cohere_client.summarize(document.content)
            
            return {
                "doc_id": request.doc_id,
                "summary": summary,
                "success": True
            }
        else:
            return {"error": "Document not found", "success": False}
    
    except Exception as e:
        return {"error": str(e), "success": False}