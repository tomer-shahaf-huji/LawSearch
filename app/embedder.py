import os

import torch
from transformers import AutoTokenizer, AutoModel


class EmbedderClient:
    def __init__(self, model_path, device: str = None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModel.from_pretrained(
            model_path,
            torch_dtype=torch.float16,
            low_cpu_mem_usage=False
        )
        self.model.to(self.device)

    def embed(self, query: str) -> list[float]:
        query = "query: " + query
        inputs = self.tokenizer(query, return_tensors="pt", padding=True, truncation=True).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
            query_embedding_tensor = outputs.last_hidden_state[:, 0, :][0]
        query_embedding = query_embedding_tensor.cpu().float().tolist()
        return query_embedding


def bootstrap_embedder(model_path: str = "models/multilingual-e5-large") -> EmbedderClient:
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model directory not found at {model_path}.")
    return EmbedderClient(model_path=model_path)
