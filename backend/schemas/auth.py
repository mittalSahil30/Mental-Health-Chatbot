from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: str


class UserBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
