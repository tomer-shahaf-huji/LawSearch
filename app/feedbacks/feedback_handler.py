from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from feedbacks.types import Feedback, Base


class FeedbackHandler:
    def __init__(self):
        self.engine = create_engine("postgresql://admin:admin@postgres:5432/tags_db")
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def store_feedback(self, query, doc_id, chunk, chunk_id, feedback_type):
        feedback = Feedback(
            query=query,
            doc_id=doc_id,
            chunk=chunk,
            chunk_id=chunk_id,
            feedback_type=feedback_type
        )
        self.session.add(feedback)
        self.session.commit()
