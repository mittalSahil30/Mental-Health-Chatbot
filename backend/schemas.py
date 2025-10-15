from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Dict, Any, Optional

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_guest: bool
    
    class Config:
        orm_mode = True

# Journal schemas
class JournalCreate(BaseModel):
    title: str
    content: str
    mood: str

class JournalResponse(BaseModel):
    id: int
    title: str
    content: str
    mood: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Mental Health Test schemas
class MentalHealthTestCreate(BaseModel):
    responses: Dict[str, int]  # question_id: score

class MentalHealthTestResponse(BaseModel):
    id: int
    responses: Dict[str, int]
    score: float
    created_at: datetime
    
    class Config:
        orm_mode = True

# Mindfulness Exercise schemas
class MindfulnessExerciseResponse(BaseModel):
    id: int
    title: str
    description: str
    duration: int
    instructions: str

# SOS Contact schemas
class SOSContactCreate(BaseModel):
    name: str
    phone: Optional[str] = ""
    email: Optional[str] = ""
    relationship: Optional[str] = ""
    notes: Optional[str] = ""

class SOSContactResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]
    relationship: Optional[str]
    notes: Optional[str]
    
    class Config:
        orm_mode = True

# Chat Message schemas
class ChatMessageCreate(BaseModel):
    message: str
    user_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id: int
    message: str
    is_user: bool
    created_at: datetime
    
    class Config:
        orm_mode = True