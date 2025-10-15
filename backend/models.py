from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, index=True)
    hashed_password = Column(String)
    is_guest = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    journal_entries = relationship("Journal", back_populates="user")
    mental_health_tests = relationship("MentalHealthTest", back_populates="user")
    sos_contacts = relationship("SOSContact", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")

class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    mood = Column(String)  # happy, sad, anxious, calm, etc.
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="journal_entries")

class MentalHealthTest(Base):
    __tablename__ = "mental_health_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    responses = Column(JSON)  # Store test responses as JSON
    score = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="mental_health_tests")

class MindfulnessExercise(Base):
    __tablename__ = "mindfulness_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    duration = Column(Integer)  # in minutes
    instructions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SOSContact(Base):
    __tablename__ = "sos_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    relationship = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sos_contacts")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text)
    is_user = Column(Boolean)  # True for user messages, False for bot responses
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="chat_messages")