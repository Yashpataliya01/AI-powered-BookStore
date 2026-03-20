from pydantic import BaseModel
from datetime import datetime

class BookRequest(BaseModel):
    title: str
    author: str
    description: str
    price: float
    stock: int
    image_url: str | None = None

    category: str | None = None
    publisher: str | None = None
    pages: int | None = None
    year: int | None = None
    tags: str | None = None



class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    description: str
    price: float
    stock: int
    image_url: str | None

    category: str | None
    publisher: str | None
    pages: int | None
    year: int | None

    rating: float
    rating_count: int
    tags: str | None

    created_at: datetime

    class Config:
        from_attributes = True
