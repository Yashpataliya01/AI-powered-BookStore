from fastapi import APIRouter, Depends
from app.schemas.book import BookListResponse
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.crud.book import get_all_books

router = APIRouter()

@router.get("/books", response_model=BookListResponse)
def get_book_all(
    search: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    min_rating: float = None,
    sort_by: str = None,
    order: str = "asc",
    page: int = 1,
    limit: int = 8,
    db: Session = Depends(get_db)
):
    return get_all_books(
        db,
        search,
        category,
        min_price,
        max_price,
        min_rating,
        sort_by,
        order,
        page,
        limit
    )
