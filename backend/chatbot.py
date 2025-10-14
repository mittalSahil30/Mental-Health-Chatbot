import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from models import User, Journal, MentalHealthTest, ChatMessage

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None

def get_chatbot_response(
    user_message: str,
    user: User,
    previous_messages: List[ChatMessage],
    journal_entries: List[Journal],
    mental_health_tests: List[MentalHealthTest]
) -> str:
    """
    Generate a personalized chatbot response based on user context
    """
    
    # Build context from user data
    context = build_user_context(user, journal_entries, mental_health_tests)
    
    # Build conversation history
    conversation_history = build_conversation_history(previous_messages)
    
    # Create personalized prompt
    prompt = create_personalized_prompt(user_message, context, conversation_history)
    
    if model and GEMINI_API_KEY:
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return get_fallback_response(user_message, context)
    else:
        return get_fallback_response(user_message, context)

def build_user_context(user: User, journal_entries: List[Journal], mental_health_tests: List[MentalHealthTest]) -> str:
    """Build context string from user's data"""
    context_parts = []
    
    # User basic info
    context_parts.append(f"User: {user.username} (Guest: {user.is_guest})")
    
    # Recent journal entries for mood context
    if journal_entries:
        recent_moods = [entry.mood for entry in journal_entries[:3]]
        context_parts.append(f"Recent moods: {', '.join(recent_moods)}")
        
        # Recent journal themes
        recent_themes = []
        for entry in journal_entries[:2]:
            if len(entry.content) > 50:
                recent_themes.append(entry.content[:100] + "...")
        if recent_themes:
            context_parts.append(f"Recent journal themes: {'; '.join(recent_themes)}")
    
    # Mental health test results
    if mental_health_tests:
        latest_score = mental_health_tests[0].score
        if latest_score < 3:
            context_parts.append("User has been experiencing low mental health scores recently")
        elif latest_score > 7:
            context_parts.append("User has been experiencing good mental health scores recently")
        else:
            context_parts.append("User has been experiencing moderate mental health scores recently")
    
    return "\n".join(context_parts)

def build_conversation_history(previous_messages: List[ChatMessage]) -> str:
    """Build conversation history string"""
    if not previous_messages:
        return "No previous conversation history."
    
    history_parts = []
    for msg in previous_messages[-5:]:  # Last 5 messages
        role = "User" if msg.is_user else "Assistant"
        history_parts.append(f"{role}: {msg.message}")
    
    return "\n".join(history_parts)

def create_personalized_prompt(user_message: str, context: str, conversation_history: str) -> str:
    """Create a personalized prompt for the AI model"""
    
    prompt = f"""
You are a compassionate and professional mental health chatbot. Your role is to provide emotional support, guidance, and resources while maintaining appropriate boundaries.

User Context:
{context}

Recent Conversation:
{conversation_history}

Current User Message: {user_message}

Guidelines:
1. Be empathetic and non-judgmental
2. Provide practical coping strategies when appropriate
3. Encourage professional help for serious concerns
4. Use the user's context to personalize your response
5. Keep responses concise but meaningful (2-3 sentences)
6. If the user seems to be in crisis, gently suggest contacting emergency services
7. Focus on validation and support rather than diagnosis

Respond to the user's message with empathy and helpful guidance:
"""
    
    return prompt

def get_fallback_response(user_message: str, context: str) -> str:
    """Fallback response when AI model is not available"""
    
    # Simple keyword-based responses
    message_lower = user_message.lower()
    
    if any(word in message_lower for word in ['sad', 'depressed', 'down', 'blue']):
        return "I understand you're feeling down. It's okay to have these feelings. Consider writing in your journal about what's on your mind, or try a mindfulness exercise. Remember, you're not alone in this."
    
    elif any(word in message_lower for word in ['anxious', 'worried', 'nervous', 'stressed']):
        return "Anxiety can be overwhelming. Try taking some deep breaths or doing a 5-minute mindfulness exercise. Sometimes writing down your worries can help put them in perspective."
    
    elif any(word in message_lower for word in ['angry', 'mad', 'frustrated', 'irritated']):
        return "It sounds like you're dealing with some strong emotions. That's completely valid. Consider taking a short walk or doing some deep breathing to help process these feelings."
    
    elif any(word in message_lower for word in ['help', 'support', 'crisis', 'emergency']):
        return "If you're in immediate danger or having thoughts of self-harm, please contact emergency services (911) or a crisis hotline. You can also check your SOS contacts for immediate support resources."
    
    elif any(word in message_lower for word in ['thank', 'thanks', 'appreciate']):
        return "You're very welcome! I'm here to support you whenever you need to talk. Remember to take care of yourself today."
    
    else:
        return "I hear you, and I want to help. Could you tell me more about what you're experiencing right now? Sometimes talking about our feelings can be the first step toward feeling better."