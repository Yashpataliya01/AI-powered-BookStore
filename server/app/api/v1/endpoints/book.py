from fastapi import APIRouter, Depends
from app.schemas.book import BookResponse
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.crud.book import create_book, get_all_books, bulk_upload

router = APIRouter()

@router.get("/books",response_model=list[BookResponse])
def get_book_all(db:Session = Depends(get_db)):
    return get_all_books(db)
