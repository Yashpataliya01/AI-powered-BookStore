from pydantic import BaseModel, EmailStr as email
from .user import UserResponse

class LoginRequest(BaseModel):
    email: email
    password: str

class LoginResponse(BaseModel):
    user: UserResponse

