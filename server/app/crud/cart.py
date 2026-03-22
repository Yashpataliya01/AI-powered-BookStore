from app.models.cart import Cart
from app.models.cart_item import CartItem
from sqlalchemy.orm import Session
from app.models.book import Book
from app.schemas.cart import AddToCartRequest
from fastapi import HTTPException

def get_or_create_cart(db:Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        cart = Cart(user_id = user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    return cart

def add_to_cart(db:Session, user_id:int, body:AddToCartRequest):
    cart = get_or_create_cart(db, user_id)

    #check the book exist or not
    book = db.query(Book).filter(Book.id == body.product_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="This product is not exist in our records")
    
    #check if the book is already exist or not in the cart
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.book_id == body.product_id
    ).first()

    if cart_item:
        cart_item.quantity += body.quantity
    else:
        cart_item = CartItem(
            cart_id = cart.id,
            book_id = body.product_id,
            quantity = body.quantity
        )
        db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return cart_item
    

def get_cart_items(db: Session):
    # print(user_id, "this is my first cart")
    cart = db.query(Cart).filter(Cart.user_id == 3).first()

    if not cart:
        cart = get_or_create_cart(db, 3)

    books_data = []
    total_price = 0
    items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    for item in items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        item_total = book.price * item.quantity
        total_price += item_total
        books_data.append(
            {
                "title":book.title,
                "description":book.description,
                "author":book.author,
                "price":book.price,
                "quantity":item.quantity,
                "image_url":book.image_url,
                "id":item.id,
                "category":book.category,
                "publisher":book.publisher,
                "pages":book.pages,
                "year":book.year,
                "tags":book.tags
            }
        )

    return {
        "cart_id": cart.id,
        "items": books_data,
        "total_price": total_price
    }
    


