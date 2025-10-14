from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    age = Column(Integer)
    gender = Column(String(20))
    phone = Column(String(20))
    emergency_contact = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    journal_entries = relationship("JournalEntry", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")
    test_results = relationship("MentalHealthTestResult", back_populates="user")

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    mood_rating = Column(Integer)  # 1-10 scale
    tags = Column(String(500))  # Comma-separated tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="journal_entries")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for guest users
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_user = Column(Boolean, nullable=False)  # True if user message, False if bot response
    timestamp = Column(DateTime, default=datetime.utcnow)
    sentiment_score = Column(Float)  # AI-analyzed sentiment
    
    # Relationship
    session = relationship("ChatSession", back_populates="messages")

class MentalHealthTestResult(Base):
    __tablename__ = "mental_health_test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_type = Column(String(50), nullable=False)  # e.g., "depression", "anxiety", "stress"
    score = Column(Integer, nullable=False)
    max_score = Column(Integer, nullable=False)
    severity_level = Column(String(50))  # e.g., "mild", "moderate", "severe"
    responses = Column(JSON)  # Store all question responses
    recommendations = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="test_results")

class MindfulnessExercise(Base):
    __tablename__ = "mindfulness_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50))  # e.g., "breathing", "meditation", "relaxation"
    duration_minutes = Column(Integer)
    instructions = Column(Text, nullable=False)
    audio_url = Column(String(500))  # Optional audio guide URL
    difficulty_level = Column(String(20))  # "beginner", "intermediate", "advanced"
    created_at = Column(DateTime, default=datetime.utcnow)

class UserExerciseProgress(Base):
    __tablename__ = "user_exercise_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("mindfulness_exercises.id"), nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    rating = Column(Integer)  # 1-5 user rating
    notes = Column(Text)

class SOSContact(Base):
    __tablename__ = "sos_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    email = Column(String(100))
    description = Column(Text)
    category = Column(String(50))  # e.g., "crisis", "emergency", "support"
    country = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)