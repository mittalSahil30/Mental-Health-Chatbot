import google.generativeai as genai
import os
from typing import Optional
from models import User
from sqlalchemy.orm import Session
import json

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "your-api-key-here"))

def get_user_context(user: Optional[User], db: Optional[Session]) -> str:
    """Generate personalized context for the user"""
    if not user or not db:
        return "You are talking to a guest user. Be helpful and supportive."
    
    context = f"User: {user.full_name or 'Anonymous'}, Age: {user.age or 'Not specified'}, Gender: {user.gender or 'Not specified'}"
    
    # Get recent journal entries for mood context
    recent_journals = db.query(Journal).filter(Journal.user_id == user.id).order_by(Journal.created_at.desc()).limit(3).all()
    if recent_journals:
        moods = [journal.mood for journal in recent_journals if journal.mood]
        if moods:
            context += f". Recent moods: {', '.join(moods)}"
    
    # Get recent test results for mental health context
    recent_tests = db.query(TestResponse).filter(TestResponse.user_id == user.id).order_by(TestResponse.created_at.desc()).limit(2).all()
    if recent_tests:
        context += ". User has taken recent mental health assessments."
    
    return context

async def get_chatbot_response(message: str, user: Optional[User] = None, db: Optional[Session] = None) -> str:
    """Generate chatbot response using Gemini API"""
    try:
        # Get user context for personalization
        user_context = get_user_context(user, db)
        
        # Create the model
        model = genai.GenerativeModel('gemini-pro')
        
        # System prompt for mental health chatbot
        system_prompt = f"""
        You are a compassionate and professional mental health chatbot. Your role is to:
        1. Provide emotional support and active listening
        2. Offer evidence-based mental health information
        3. Suggest coping strategies and mindfulness techniques
        4. Encourage professional help when appropriate
        5. Maintain a warm, non-judgmental tone
        
        User Context: {user_context}
        
        Important guidelines:
        - Always prioritize user safety
        - If someone expresses suicidal thoughts, encourage immediate professional help
        - Provide general information, not medical advice
        - Be empathetic and validating
        - Keep responses concise but helpful
        - Ask follow-up questions to better understand their needs
        """
        
        # Generate response
        response = model.generate_content(f"{system_prompt}\n\nUser message: {message}")
        
        return response.text
        
    except Exception as e:
        # Fallback response if API fails
        return "I'm sorry, I'm having trouble processing your message right now. Please try again, or if you're in crisis, please contact a mental health professional or emergency services immediately."