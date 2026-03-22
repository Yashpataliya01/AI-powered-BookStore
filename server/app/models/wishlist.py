from app.database.base import Base
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime

class Wishlist(Base):
    __tablename__ = 'wishlists'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)