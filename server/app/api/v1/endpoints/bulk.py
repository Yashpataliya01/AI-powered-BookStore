from fastapi import APIRouter, Depends
from app.schemas.book import BookRequest, BookResponse
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.crud.book import bulk_upload


router = APIRouter()

@router.post("/bulk/book")
def create_bulk_book(body:list[BookRequest], db:Session=Depends(get_db)):
    return bulk_upload(body, db)