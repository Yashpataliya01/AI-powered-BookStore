from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.models.user import User
from app.models.book import Book
from app.models.cart import Cart
from app.models.cart_item import CartItem