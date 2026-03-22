from sqlalchemy import Column, Integer, ForeignKey
from app.database.base import Base

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    wishlist_id = Column(Integer, ForeignKey("wishlists.id"))
    book_id = Column(Integer, ForeignKey("books.id"))