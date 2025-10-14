from pydantic import BaseModel
from typing import Optional


class JournalCreate(BaseModel):
    title: str
    content: str


class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class JournalOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
