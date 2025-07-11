from dataclasses import dataclass
from typing import List, Dict
from opensearchpy import OpenSearch
from collections import defaultdict


@dataclass
class RetrievalResult:
    id: str
    doc_id: str
    chunk: str
    content: str
    headline: str
    judgement_type: str
    district: str = None
    court: str = None
    judges: str = None
    decision_date: str = None
    lexical_score: float = None
    semantic_score: float = None
    rrf_score: float = None


class OpenSearchClient:
    def __init__(self, client, index_name: str):
        self.client = client
        self.index_name = index_name

    def _execute_opensearch_search(self, body: dict) -> List[RetrievalResult]:
        response = self.client.search(index=self.index_name, body=body)
        results = []

        for hit in response["hits"]["hits"]:
            results.append(
                RetrievalResult(
                    id=hit["_id"],
                    doc_id=hit["_source"]["doc_id"],
                    chunk=hit["_source"]["chunk"],
                    content = hit["_source"]["content"],
                    headline=hit["_source"]["headline"],
                    district=hit["_source"]["district"],
                    court=hit["_source"]["court"],
                    judges=hit["_source"]["judges"],
                    judgement_type=hit["_source"]["judgement_type"],
                    decision_date=hit["_source"]["decision_date"],
                    lexical_score=hit["_score"]

                )
            )

        return results

    def lexical_search(self, query: str, top_k: int = 10) -> List[RetrievalResult]:
        body = {
            "size": top_k,
            "query": {
                "match": {
                    "chunk": query
                }
            }
        }
        lexical_results = self._execute_opensearch_search(body)
        return lexical_results

    def semantic_search(self, query_vector: List[float], top_k: int = 10) -> List[RetrievalResult]:
        print(type(query_vector))
        print(query_vector)
        body = {
            "size": top_k,
            "query": {
                "knn": {
                    "embeddings": {
                        "vector": query_vector,
                        "k": top_k
                    }
                }
            }
        }

        lexical_results = self._execute_opensearch_search(body)
        return lexical_results

    def rrf_search(self, query: str, query_vector: List[float], k: int = 10, rrf_k: int = 50) -> List[RetrievalResult]:
        lex_results = self.lexical_search(query, top_k=rrf_k)
        sem_results = self.semantic_search(query_vector, top_k=rrf_k)

        # Maps from doc_id -> result
        result_dict: Dict[str, RetrievalResult] = {}
        rank_scores = defaultdict(float)

        for rank, result in enumerate(lex_results):
            result_dict[result.doc_id] = result_dict.get(result.doc_id, result)
            result_dict[result.doc_id].lexical_score = result.lexical_score
            rank_scores[result.doc_id] += 1 / (rrf_k + rank)

        for rank, result in enumerate(sem_results):
            if result.doc_id in result_dict:
                result_dict[result.doc_id].semantic_score = result.semantic_score
            else:
                result_dict[result.doc_id] = result
            rank_scores[result.doc_id] += 1 / (rrf_k + rank)

        # Attach rrf score
        for doc_id, score in rank_scores.items():
            result_dict[doc_id].rrf_score = score

        # Sort by rrf score
        fused_results = sorted(result_dict.values(), key=lambda x: x.rrf_score, reverse=True)

        return fused_results[:k]


def bootstrap_open_search_client() -> OpenSearchClient:
    client = OpenSearch(
        hosts=[{"host": "opensearch", "port": 9200}],
        http_compress=True,
        use_ssl=False,
        verify_certs=False
    )

    index_name = "all_law_cases"
    opensearch_client = OpenSearchClient(client=client, index_name=index_name)
    return opensearch_client
