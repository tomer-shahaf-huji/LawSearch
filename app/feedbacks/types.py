# create table in db

from sqlalchemy import create_engine, Column, Integer, String, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import enum

# 1. Database URL (corrected)
DATABASE_URL = "postgresql://admin:admin@postgres:5432/tags_db"

# 2. Define SQLAlchemy Base
Base = declarative_base()

# 3. FeedbackType Enum
class FeedbackType(enum.Enum):
    like = "like"
    dislike = "dislike"

# 4. Feedback table
class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True)
    feedback_type = Column(Enum(FeedbackType), nullable=False)
    query = Column(Text, nullable=False)
    doc_id = Column(String, nullable=False)
    chunk_id = Column(String, nullable=False)
    chunk = Column(Text, nullable=True)  # optional

# 5. Create engine and tables
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)
