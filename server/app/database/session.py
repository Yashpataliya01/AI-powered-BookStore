from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Database_url = "mysql+pymysql://root:yashdeep@localhost:3306/bookstore_db"

engine = create_engine(
    Database_url
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)