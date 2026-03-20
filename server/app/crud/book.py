from app.schemas.book import BookRequest
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.book import Book


def create_book(body:BookRequest, db:Session):
    if not body:
        raise HTTPException(status_code=400, detail="Invalid book data")
    
    db_book = Book(
        title=body.title,
        author=body.author,
        description=body.description,
        price=body.price,
        stock=body.stock,
        image_url=body.image_url,
        category=body.category,
        publisher=body.publisher,
        pages=body.pages,
        year=body.year,
        tags=body.tags
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)


def bulk_upload(body: list[BookRequest], db: Session):

    if not body:
        raise HTTPException(status_code=400, detail="Invalid book data")

    books = []

    for i in body:
        db_book = Book(
            title=i.title,
            author=i.author,
            description=i.description,
            price=i.price,
            stock=i.stock,
            image_url=i.image_url,
            category=i.category,
            publisher=i.publisher,
            pages=i.pages,
            year=i.year,
            tags=i.tags
        )
        books.append(db_book)

    db.add_all(books)
    db.commit()      

    return books

def get_all_books(db:Session):
    books = db.query(Book).all()
    print(books, "the books that im getting from the database")
    if books is None:
        raise HTTPException(status_code=500, detail="Failed to retrieve books")

    return books

