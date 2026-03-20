from fastapi import APIRouter, Depends
from app.schemas.cart import CartResponse, AddToCartRequest
from app.crud.cart import get_cart_items, add_to_cart
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user


router = APIRouter()

@router.get("/cart", response_model=CartResponse)
def get_cart_item(db: Session = Depends(get_db)):
    return get_cart_items(db)

@router.post("/cart/{id}")
def add_cart(id:int, body:AddToCartRequest, db:Session = Depends(get_db)):
    return add_to_cart(db, id, body)