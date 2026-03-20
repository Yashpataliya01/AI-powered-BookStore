from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ ADD THIS
from app.database.base import Base
from app.database.session import engine
from app.api.v1.endpoints.user import router as user_router
from app.api.v1.endpoints.book import router as book_router
from app.api.v1.endpoints.bulk import router as bulk_router
from app.api.v1.endpoints.cart import router as cart_router

app = FastAPI(
    title="Online Book Store API",
    description="API for managing an online book store, including books, authors, and orders.",
    version="1.0.0",
)

# ✅ ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

prefix = "/api/v1"

app.include_router(user_router, prefix=prefix)
app.include_router(book_router, prefix=prefix)
app.include_router(bulk_router, prefix=prefix)
app.include_router(cart_router, prefix=prefix)

@app.get("/")
def read_root():
    return {"Hello": "World"}