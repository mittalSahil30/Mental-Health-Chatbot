import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from models import User, Journal, MentalHealthTest, ChatMessage

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "your-gemini-api-key-here":
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Use the correct model name for the current API version
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("Gemini API configured successfully")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        model = None
else:
    model = None
    print("Gemini API not configured - using fallback responses")

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
    
    if model and GEMINI_API_KEY and GEMINI_API_KEY != "your-gemini-api-key-here":
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return get_fallback_response(user_message, context)
    else:
        print("Using fallback response - Gemini API not configured")
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
    
    import random
    
    # Simple keyword-based responses with variety
    message_lower = user_message.lower()
    
    if any(word in message_lower for word in ['sad', 'depressed', 'down', 'blue', 'hopeless']):
        responses = [
            "I understand you're feeling down. It's okay to have these feelings. Consider writing in your journal about what's on your mind, or try a mindfulness exercise. Remember, you're not alone in this.",
            "Feeling sad is a natural part of being human. It's important to acknowledge these feelings. Would you like to try a breathing exercise or write about what's troubling you?",
            "I can sense you're going through a difficult time. These feelings, while painful, are temporary. Consider reaching out to someone you trust or trying a mindfulness practice."
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['anxious', 'worried', 'nervous', 'stressed', 'panic']):
        responses = [
            "Anxiety can be overwhelming. Try taking some deep breaths or doing a 5-minute mindfulness exercise. Sometimes writing down your worries can help put them in perspective.",
            "I understand you're feeling anxious. Let's try a grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            "Stress and anxiety are common experiences. Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This can help calm your nervous system."
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['angry', 'mad', 'frustrated', 'irritated', 'rage']):
        responses = [
            "It sounds like you're dealing with some strong emotions. That's completely valid. Consider taking a short walk or doing some deep breathing to help process these feelings.",
            "Anger is a natural emotion, but it's important to express it healthily. Try physical activity, journaling, or talking to someone you trust about what's making you angry.",
            "I hear your frustration. Sometimes we need to step back and take a moment to breathe. What's one small thing you can do right now to help yourself feel better?"
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['help', 'support', 'crisis', 'emergency', 'suicide', 'hurt']):
        responses = [
            "If you're in immediate danger or having thoughts of self-harm, please contact emergency services (911) or a crisis hotline. You can also check your SOS contacts for immediate support resources.",
            "I'm concerned about your safety. If you're having thoughts of hurting yourself, please reach out to a crisis hotline immediately. You matter and help is available.",
            "Your safety is the most important thing right now. Please contact emergency services (911) or a crisis hotline if you're in immediate danger. You're not alone."
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['thank', 'thanks', 'appreciate', 'grateful']):
        responses = [
            "You're very welcome! I'm here to support you whenever you need to talk. Remember to take care of yourself today.",
            "I'm glad I could help! It takes courage to reach out and talk about your feelings. Keep taking care of yourself.",
            "You're welcome! Remember that seeking help and support is a sign of strength, not weakness. I'm here whenever you need me."
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']):
        responses = [
            f"Hello! I'm here to listen and support you. How are you feeling today?",
            f"Hi there! I'm your mental health companion. What's on your mind today?",
            f"Hello! I'm here to help you through whatever you're experiencing. How can I support you today?"
        ]
        return random.choice(responses)
    
    elif any(word in message_lower for word in ['tired', 'exhausted', 'sleep', 'insomnia']):
        responses = [
            "It sounds like you're feeling tired. Rest is so important for our mental health. Try to establish a relaxing bedtime routine and avoid screens before bed.",
            "Fatigue can really impact how we feel. Make sure you're getting enough sleep and consider gentle activities like reading or meditation to help you wind down.",
            "Being tired can make everything feel harder. Try to prioritize rest and self-care. Sometimes even a short nap or quiet time can make a big difference."
        ]
        return random.choice(responses)
    
    else:
        responses = [
            "I hear you, and I want to help. Could you tell me more about what you're experiencing right now? Sometimes talking about our feelings can be the first step toward feeling better.",
            "Thank you for sharing that with me. I'm here to listen and support you. What's been on your mind lately?",
            "I understand you're going through something. It's okay to not have all the answers right now. What would be most helpful for you to talk about?",
            "I'm here to listen without judgment. Sometimes just expressing what we're feeling can be incredibly helpful. What's been weighing on you?",
            "Thank you for trusting me with your thoughts. I want to help you work through whatever you're experiencing. Can you tell me more about how you're feeling?"
        ]
        return random.choice(responses)