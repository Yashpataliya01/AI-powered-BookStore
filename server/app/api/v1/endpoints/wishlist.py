from fastapi import APIRouter, Depends
from app.schemas.wishlist import WishlistResponse
from app.crud.wishlist import get_wishlist_items, add_to_wishlist
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.get("/wishlist", response_model=WishlistResponse)
def get_wishlist_item(db: Session = Depends(get_db)):
    return get_wishlist_items(db)

@router.post("/wishlist/{id}")
def add_wishlist(id:int, book_id:int, db:Session = Depends(get_db)):
    return add_to_wishlist(db, id, book_id)

