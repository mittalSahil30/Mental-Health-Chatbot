from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)  # Nullable for guest users
    full_name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    is_guest = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    journals = relationship("Journal", back_populates="user")
    tests = relationship("MentalHealthTest", back_populates="user")
    test_responses = relationship("TestResponse", back_populates="user")
    sos_contacts = relationship("SOSContact", back_populates="user")

class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    mood = Column(String, nullable=True)  # happy, sad, anxious, etc.
    tags = Column(JSON, nullable=True)  # List of tags
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="journals")

class MentalHealthTest(Base):
    __tablename__ = "mental_health_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    questions = Column(JSON, nullable=False)  # List of questions
    scoring_rules = Column(JSON, nullable=True)  # Scoring instructions
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="tests")
    responses = relationship("TestResponse", back_populates="test")

class TestResponse(Base):
    __tablename__ = "test_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("mental_health_tests.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    responses = Column(JSON, nullable=False)  # User's answers
    score = Column(Float, nullable=True)
    interpretation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    test = relationship("MentalHealthTest", back_populates="responses")
    user = relationship("User", back_populates="test_responses")

class MindfulnessExercise(Base):
    __tablename__ = "mindfulness_exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    category = Column(String, nullable=False)  # breathing, meditation, etc.
    difficulty_level = Column(String, nullable=False)  # beginner, intermediate, advanced
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SOSContact(Base):
    __tablename__ = "sos_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_emergency = Column(Boolean, default=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="sos_contacts")