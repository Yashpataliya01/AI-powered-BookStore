from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth import LoginResponse, LoginRequest

from app.schemas.user import UserCreate, UserResponse
from app.crud.user import create_user, get_all_users, delete_user, get_user_by_email
from app.core.dependencies import get_db
from app.core.security import verify_password, create_access_token

router = APIRouter()

@router.get("/users", response_model=list[UserResponse])
def users_list(db: Session = Depends(get_db)):
    return get_all_users(db)

@router.post("/user", response_model=UserResponse)
def register_user(body: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, body)

@router.delete("/user/{id}")
def user_delete(id:int, bd:Session = Depends(get_db)):
    return delete_user(bd, id)

@router.post("/login", response_model=LoginResponse)
def user_login(body:LoginRequest, db:Session = Depends(get_db)):
    user = get_user_by_email(db, body.email)

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(body.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = create_access_token({
        "user_id": user.id,
        "email": user.email
    })

    return{
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }