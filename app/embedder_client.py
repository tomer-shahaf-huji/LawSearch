from typing import Literal
import numpy as np


class EmbedderClient:
    def __init__(self, embedder_name: Literal["mock"]):
        self.embedder_name = embedder_name

    def embed(self, query: str):
        if self.embedder_name == "mock":
            return np.random.rand(1024)


def bootstrap_embedder(embedder_name: Literal["mock"]):
    return EmbedderClient(embedder_name=embedder_name)
