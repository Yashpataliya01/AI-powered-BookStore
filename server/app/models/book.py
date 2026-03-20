from app.database.base import Base
from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    author = Column(String(100), nullable=False)
    description = Column(String(500))

    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)

    image_url = Column(String(500), nullable=True)

    # 🆕 New fields
    category = Column(String(100), index=True)
    publisher = Column(String(150))
    pages = Column(Integer)
    year = Column(Integer)

    # 🆕 ratings (basic version)
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)

    # 🆕 tags (simple version)
    tags = Column(String(300))  # comma-separated

    created_at = Column(DateTime, default=datetime.utcnow)
