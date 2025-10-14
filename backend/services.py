from sqlalchemy.orm import Session
from models import User, Journal, MentalHealthTest, TestResponse, MindfulnessExercise, SOSContact
from schemas import (
    UserCreate, JournalCreate, TestCreate, SOSContactCreate,
    UserResponse, JournalResponse, TestResponse as TestResponseSchema,
    ExerciseResponse, SOSContactResponse
)
from auth import get_password_hash, verify_password
from typing import List, Optional
import json

# User services
def create_user_service(db: Session, user: UserCreate) -> UserResponse:
    # Check if user already exists
    if user.email and db.query(User).filter(User.email == user.email).first():
        raise ValueError("Email already registered")
    if user.username and db.query(User).filter(User.username == user.username).first():
        raise ValueError("Username already taken")
    
    # Create user
    hashed_password = get_password_hash(user.password) if user.password else None
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        age=user.age,
        gender=user.gender,
        phone=user.phone,
        emergency_contact=user.emergency_contact,
        is_guest=user.is_guest
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user_service(db: Session, user: UserLogin) -> dict:
    # Find user by email or username
    db_user = None
    if user.email:
        db_user = db.query(User).filter(User.email == user.email).first()
    elif user.username:
        db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise ValueError("Invalid credentials")
    
    # Create access token
    from auth import create_access_token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

# Journal services
def create_journal_entry(db: Session, journal: JournalCreate, user_id: int) -> JournalResponse:
    db_journal = Journal(
        title=journal.title,
        content=journal.content,
        mood=journal.mood,
        tags=journal.tags,
        user_id=user_id
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

def get_user_journals(db: Session, user_id: int) -> List[JournalResponse]:
    return db.query(Journal).filter(Journal.user_id == user_id).order_by(Journal.created_at.desc()).all()

# Mental Health Test services
def create_mental_health_test(db: Session, test: TestCreate, user_id: int) -> TestResponseSchema:
    db_test = MentalHealthTest(
        name=test.name,
        description=test.description,
        questions=test.questions,
        scoring_rules=test.scoring_rules,
        user_id=user_id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

def get_user_tests(db: Session, user_id: int) -> List[TestResponseSchema]:
    return db.query(MentalHealthTest).filter(MentalHealthTest.user_id == user_id).order_by(MentalHealthTest.created_at.desc()).all()

def create_test_response(db: Session, test_id: int, responses: List[dict], user_id: int) -> dict:
    # Get the test
    test = db.query(MentalHealthTest).filter(MentalHealthTest.id == test_id).first()
    if not test:
        raise ValueError("Test not found")
    
    # Calculate score based on scoring rules
    score = calculate_test_score(responses, test.scoring_rules)
    interpretation = interpret_test_score(score, test.name)
    
    # Create test response
    db_response = TestResponse(
        test_id=test_id,
        user_id=user_id,
        responses=responses,
        score=score,
        interpretation=interpretation
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    
    return {
        "id": db_response.id,
        "score": score,
        "interpretation": interpretation,
        "created_at": db_response.created_at
    }

def calculate_test_score(responses: List[dict], scoring_rules: Optional[dict]) -> float:
    """Calculate test score based on responses and scoring rules"""
    if not scoring_rules:
        return sum(response.get("score", 0) for response in responses)
    
    # Simple scoring - can be enhanced based on specific test requirements
    total_score = 0
    for response in responses:
        total_score += response.get("score", 0)
    
    return total_score

def interpret_test_score(score: float, test_name: str) -> str:
    """Interpret test score and provide feedback"""
    # This is a simplified interpretation - can be enhanced based on specific tests
    if score < 10:
        return "Low risk - Your responses suggest good mental health. Continue maintaining healthy habits."
    elif score < 20:
        return "Moderate risk - Consider implementing stress management techniques and self-care practices."
    else:
        return "Higher risk - It's recommended to speak with a mental health professional for support and guidance."

# Mindfulness Exercise services
def get_mindfulness_exercises(db: Session) -> List[ExerciseResponse]:
    exercises = db.query(MindfulnessExercise).all()
    if not exercises:
        # Create default exercises if none exist
        create_default_exercises(db)
        exercises = db.query(MindfulnessExercise).all()
    return exercises

def create_default_exercises(db: Session):
    """Create default mindfulness exercises"""
    default_exercises = [
        {
            "title": "5-Minute Breathing Exercise",
            "description": "A simple breathing exercise to help reduce stress and anxiety",
            "instructions": "1. Sit comfortably and close your eyes\n2. Breathe in slowly for 4 counts\n3. Hold your breath for 4 counts\n4. Breathe out slowly for 4 counts\n5. Repeat for 5 minutes",
            "duration_minutes": 5,
            "category": "breathing",
            "difficulty_level": "beginner"
        },
        {
            "title": "Body Scan Meditation",
            "description": "A guided meditation to help you relax and become aware of your body",
            "instructions": "1. Lie down comfortably\n2. Start from your toes and slowly scan up your body\n3. Notice any tension or discomfort\n4. Breathe into those areas and release tension\n5. Continue until you reach the top of your head",
            "duration_minutes": 15,
            "category": "meditation",
            "difficulty_level": "intermediate"
        },
        {
            "title": "Mindful Walking",
            "description": "Practice mindfulness while walking to ground yourself in the present moment",
            "instructions": "1. Walk slowly and deliberately\n2. Focus on the sensation of your feet touching the ground\n3. Notice your breathing and body movement\n4. Observe your surroundings without judgment\n5. If your mind wanders, gently bring it back to walking",
            "duration_minutes": 10,
            "category": "movement",
            "difficulty_level": "beginner"
        }
    ]
    
    for exercise_data in default_exercises:
        exercise = MindfulnessExercise(**exercise_data)
        db.add(exercise)
    
    db.commit()

# SOS Contact services
def create_sos_contact(db: Session, contact: SOSContactCreate, user_id: int) -> SOSContactResponse:
    db_contact = SOSContact(
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        organization=contact.organization,
        description=contact.description,
        is_emergency=contact.is_emergency,
        user_id=user_id
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_sos_contacts(db: Session, user_id: int) -> List[SOSContactResponse]:
    return db.query(SOSContact).filter(SOSContact.user_id == user_id).all()

# Profile services
def update_user_profile(db: Session, user_id: int, profile_data: dict) -> UserResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    
    for key, value in profile_data.items():
        if hasattr(user, key) and value is not None:
            setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

def get_user_profile(db: Session, user_id: int) -> UserResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    return user