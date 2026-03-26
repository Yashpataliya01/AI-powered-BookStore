from app.models.wishlist import Wishlist
from app.models.wishlist_item import WishlistItem
from app.models.book import Book
from sqlalchemy.orm import Session
from fastapi import HTTPException

def get_or_create_wishlist(db:Session, user_id: int):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user_id).first()

    if not wishlist:
        wishlist = Wishlist(user_id = user_id)
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
    
    return wishlist

def add_to_wishlist(db:Session, user_id:int, book_id:int):
    wishlist = get_or_create_wishlist(db, user_id)

    #check the book exist or not
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="This product is not exist in our records")
    
    #check if the book is already exist or not in the wishlist
    wishlist_item = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.book_id == book_id
    ).first()

    if wishlist_item:
        raise HTTPException(status_code=400, detail="This product is already exist in your wishlist")
    else:
        wishlist_item = WishlistItem(
            wishlist_id = wishlist.id,
            book_id = book_id
        )
        db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)

    return wishlist_item

def get_wishlist_items(db: Session):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == 3).first()

    if not wishlist:
        wishlist = get_or_create_wishlist(db, 3)

    books_data = []
    items = db.query(WishlistItem).filter(WishlistItem.wishlist_id == wishlist.id).all()
    for item in items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        books_data.append(book)
    
    return books_data