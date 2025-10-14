from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None

class UserCreate(UserBase):
    password: Optional[str] = None
    is_guest: bool = False

class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class UserResponse(UserBase):
    id: int
    is_guest: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Journal schemas
class JournalCreate(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None
    tags: Optional[List[str]] = None

class JournalResponse(JournalCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Mental Health Test schemas
class TestCreate(BaseModel):
    name: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]]
    scoring_rules: Optional[Dict[str, Any]] = None

class TestResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]]
    scoring_rules: Optional[Dict[str, Any]] = None
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestSubmission(BaseModel):
    responses: List[Dict[str, Any]]

# Mindfulness Exercise schemas
class ExerciseResponse(BaseModel):
    id: int
    title: str
    description: str
    instructions: str
    duration_minutes: int
    category: str
    difficulty_level: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# SOS Contact schemas
class SOSContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    organization: Optional[str] = None
    description: Optional[str] = None
    is_emergency: bool = True

class SOSContactResponse(SOSContactCreate):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat schemas
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Profile update schema
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None