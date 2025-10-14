from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LoginRequest(BaseModel):
    username: str
    password: str

# Journal schemas
class JournalEntryBase(BaseModel):
    title: str
    content: str
    mood_rating: Optional[int] = None
    tags: Optional[str] = None

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood_rating: Optional[int] = None
    tags: Optional[str] = None

class JournalEntryResponse(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatMessageResponse(BaseModel):
    id: int
    message: str
    is_user: bool
    timestamp: datetime
    sentiment_score: Optional[float] = None
    
    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: int
    session_id: str
    created_at: datetime
    messages: List[ChatMessageResponse] = []
    
    class Config:
        from_attributes = True

# Mental Health Test schemas
class TestQuestion(BaseModel):
    id: int
    question: str
    options: List[str]

class TestResponse(BaseModel):
    question_id: int
    answer: int  # Index of selected option

class MentalHealthTestRequest(BaseModel):
    test_type: str
    responses: List[TestResponse]

class MentalHealthTestResultResponse(BaseModel):
    id: int
    test_type: str
    score: int
    max_score: int
    severity_level: str
    recommendations: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Mindfulness Exercise schemas
class MindfulnessExerciseResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    duration_minutes: Optional[int] = None
    instructions: str
    audio_url: Optional[str] = None
    difficulty_level: str
    
    class Config:
        from_attributes = True

class ExerciseProgressRequest(BaseModel):
    exercise_id: int
    rating: Optional[int] = None
    notes: Optional[str] = None

# SOS Contact schemas
class SOSContactResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
    category: str
    country: Optional[str] = None
    
    class Config:
        from_attributes = True

class SOSContactCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
    category: str
    country: Optional[str] = None