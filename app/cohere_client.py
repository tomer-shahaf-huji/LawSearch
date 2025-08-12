import cohere
from utils import cut_first_n_words

CLIENT_NAME = "trial1"
TOKEN = "qus0xIXk3f6KAy5Zo3VcQCbbVlHAD8seKDWKx0UT"
MODEL_NAME = "command-r"
CONTEXT_SIZE_IN_WORDS = 300


class CohereClient:
    def __init__(self, api_key: str, model: str = "command-r"):
        self.co = cohere.ClientV2(api_key)
        self.model = model
        self.history = []

    def summarize(self, case_text: str) -> str:
        limited_context_case_text = cut_first_n_words(case_text, CONTEXT_SIZE_IN_WORDS)
        prompt = f"""
        You serve as a legal assistant at a law firm in Israel.  
        You must summarize a legal decision or ruling.  
        The summary should be between 3 to 5 key points.
        document: {limited_context_case_text}
        summary:
        """

        # Add user prompt to history
        self.history.append({"role": "user", "content": prompt})

        response = self.co.chat(
            model=self.model,
            messages=self.history
        )

        summary = self._parse_cohere_api_response(response)

        # Add assistant reply to history
        self.history.append({"role": "assistant", "content": summary})

        return summary

    def ask(self, question: str) -> str:
        # Add the new question to history
        limited_context_case_text = cut_first_n_words(case_text, CONTEXT_SIZE_IN_WORDS)
        prompt = f"""
        You serve as a legal assistant at a law firm in Israel.  
        You must answer questions based on a provided legal decision or ruling.  
        Your answers should be accurate, concise, and clear.
        document: {limited_context_case_text}
        summary:
        """

        self.history.append({"role": "user", "content": question})

        response = self.co.chat(
            model=self.model,
            messages=self.history
        )

        answer = self._parse_cohere_api_response(response)

        # Add assistant reply to history
        self.history.append({"role": "assistant", "content": answer})

        return answer

    def _parse_cohere_api_response(self, response):
        text = response.message.content[0].text.strip()
        return text



def bootstrap_cohere_client():
    return CohereClient(api_key=TOKEN, model=MODEL_NAME)