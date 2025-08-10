import re
FIRST_PASSAGE_WORD_COUNT = 100

def cut_first_n_words(text: str, n: int = FIRST_PASSAGE_WORD_COUNT) -> str:
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    result, count = [], 0
    for s in sentences:
        word_count = len(s.split())
        result.append(s)
        count += word_count
        if count >= n:
            break
    return '. '.join(result) + '.'