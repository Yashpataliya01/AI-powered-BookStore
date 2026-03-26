from app.schemas.book import BookRequest
from fastapi import HTTPException
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
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

def get_all_books(
    db: Session,
    search: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    min_rating: float = None,
    sort_by: str = None,
    order: str = "asc",
    page: int = 1,
    limit: int = 8
):
    query = db.query(Book)

    # 🔍 Search
    if search:
        query = query.filter(Book.title.ilike(f"%{search}%"))

    # 📂 Category filter
    if category and category != "All":
        query = query.filter(Book.category == category)

    # 💰 Price filter
    if min_price is not None:
        query = query.filter(Book.price >= min_price)

    if max_price is not None:
        query = query.filter(Book.price <= max_price)

    # ⭐ Rating filter
    if min_rating is not None:
        query = query.filter(Book.rating >= min_rating)

    # 🔄 Sorting
    if sort_by:
        column = getattr(Book, sort_by, None)

        if column:
            if order == "desc":
                query = query.order_by(desc(column))
            else:
                query = query.order_by(asc(column))

    # 📄 Pagination
    offset = (page - 1) * limit
    total = query.count()

    books = query.offset(offset).limit(limit).all()
    
    if not books:
        raise HTTPException(status_code=404, detail="No books found hahahahah")

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": books
    }

