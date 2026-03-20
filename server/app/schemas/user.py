from pydantic import BaseModel, EmailStr as email
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: email
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: email
    created_at: datetime

    class Config:
        orm_mode = True