from typing import List
import streamlit as st

from feedbacks.feedback_handler import FeedbackHandler
from embedder_client import bootstrap_embedder
from opensearch_client import bootstrap_open_search_client, RetrievalResult

st.title("Hebrew Legal Document Search")

opensearch_client = bootstrap_open_search_client()
query_embedder = bootstrap_embedder(embedder_name="mock")
feedback_handler = FeedbackHandler()

st.markdown("""
    <style>
    html, body, [class*="css"] {
        direction: rtl;
        text-align: right;
    }
    </style>
""", unsafe_allow_html=True)

query = st.text_input("מה אתה מחפש?")


def print_results(query: str, search_results: List[RetrievalResult]):
    for idx, result in enumerate(search_results, start=1):
        with st.expander(f"{idx}. {result.headline}"):
            st.markdown(f"**מזהה מסמך:** `{result.doc_id}`")
            st.markdown(f"**כותרת:** {result.headline}")
            st.markdown(f"**טקסט:**\n\n{result.chunk}")

            if st.button(f"👍 Like", key=f"like_{idx}"):
                feedback_handler.store_feedback(query, result.doc_id, result.chunk, result.chunk, "like")
                st.success("Liked!")
            if st.button(f"👎 Dislike", key=f"dislike_{idx}"):
                feedback_handler.store_feedback(query, result.doc_id, result.chunk, result.chunk, "dislike")
                st.warning("Disliked!")


if st.button("Lexical Search"):
    lexical_search_results = opensearch_client.lexical_search(query, top_k=10)
    print_results(query, lexical_search_results)

if st.button("Semantic Search"):
    query_embedding = query_embedder.embed(query)
    semantic_search_results = opensearch_client.semantic_search(query_embedding, top_k=10)
    print_results(query, semantic_search_results)
