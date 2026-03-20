from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from fastapi import HTTPException

def create_user(db: Session, body: UserCreate):
    print(body, "the data that im getting from the body")
    hashed_password = hash_password(body.password)

    db_user = User(
        username=body.username,
        email=body.email,
        password=hashed_password,
    )

    print("creating the user", db_user)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def get_all_users(db:Session):
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=400, detail="Book not found")
    return users

def delete_user(db:Session, id:int):
    user = db.query(User).filter(User.id == id).first()
    if user:
        db.delete(user)
        db.commit()
        
    return user

def get_user_by_email(db:Session, email:str):
    user = db.query(User).filter(User.email == email).first()
    return user
