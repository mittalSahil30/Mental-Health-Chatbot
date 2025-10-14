import google.generativeai as genai
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
import json

load_dotenv()

class GeminiChatbot:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def get_personalized_response(self, message: str, user_context: Optional[Dict] = None, chat_history: List[Dict] = None) -> str:
        """
        Generate a personalized mental health support response using Gemini AI.
        
        Args:
            message: User's current message
            user_context: User information (age, previous test results, etc.)
            chat_history: Previous conversation messages
        
        Returns:
            AI-generated response
        """
        if not self.model:
            return self._get_fallback_response(message)
        
        try:
            # Build context-aware prompt
            system_prompt = self._build_system_prompt(user_context)
            conversation_context = self._build_conversation_context(chat_history)
            
            full_prompt = f"""
{system_prompt}

{conversation_context}

User: {message}

Mental Health Assistant:"""

            response = self.model.generate_content(full_prompt)
            return response.text
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return self._get_fallback_response(message)
    
    def _build_system_prompt(self, user_context: Optional[Dict] = None) -> str:
        """Build the system prompt with user context."""
        base_prompt = """You are a compassionate and professional mental health support assistant. Your role is to:

1. Provide empathetic, non-judgmental support
2. Offer practical coping strategies and techniques
3. Encourage professional help when appropriate
4. Never diagnose or provide medical advice
5. Maintain a warm, understanding tone
6. Ask follow-up questions to better understand the user's situation
7. Suggest mindfulness exercises, journaling, or other self-care activities when relevant

Important guidelines:
- Always prioritize user safety
- If someone expresses suicidal thoughts, provide crisis resources immediately
- Encourage professional mental health support for serious concerns
- Be culturally sensitive and inclusive
- Keep responses concise but meaningful (2-4 sentences typically)
- Use "I" statements to show empathy (e.g., "I understand this must be difficult")"""

        if user_context:
            context_info = []
            if user_context.get('age'):
                context_info.append(f"User age: {user_context['age']}")
            if user_context.get('recent_test_results'):
                context_info.append(f"Recent assessment results: {user_context['recent_test_results']}")
            if user_context.get('journal_mood_trend'):
                context_info.append(f"Recent mood trend: {user_context['journal_mood_trend']}")
            
            if context_info:
                base_prompt += f"\n\nUser context:\n" + "\n".join(context_info)
        
        return base_prompt
    
    def _build_conversation_context(self, chat_history: List[Dict]) -> str:
        """Build conversation context from chat history."""
        if not chat_history:
            return "This is the start of a new conversation."
        
        context = "Previous conversation:\n"
        # Include last 5 messages for context
        recent_messages = chat_history[-5:] if len(chat_history) > 5 else chat_history
        
        for msg in recent_messages:
            role = "User" if msg.get('is_user') else "Assistant"
            context += f"{role}: {msg.get('message', '')}\n"
        
        return context
    
    def _get_fallback_response(self, message: str) -> str:
        """Provide fallback responses when Gemini API is not available."""
        message_lower = message.lower()
        
        # Crisis keywords
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die']
        if any(keyword in message_lower for keyword in crisis_keywords):
            return """I'm very concerned about what you're sharing. Your life has value and there are people who want to help. Please reach out to a crisis helpline immediately:

• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Or go to your nearest emergency room

You don't have to go through this alone. Professional help is available 24/7."""

        # Anxiety keywords
        anxiety_keywords = ['anxious', 'worry', 'panic', 'stress', 'overwhelmed']
        if any(keyword in message_lower for keyword in anxiety_keywords):
            return """I understand you're feeling anxious right now. That's a very common experience, and you're not alone. Here are some techniques that might help:

• Try deep breathing: inhale for 4 counts, hold for 4, exhale for 6
• Ground yourself using the 5-4-3-2-1 technique (5 things you see, 4 you hear, etc.)
• Consider speaking with a mental health professional for ongoing support

Would you like to try a guided breathing exercise or tell me more about what's causing these feelings?"""

        # Depression keywords
        depression_keywords = ['depressed', 'sad', 'hopeless', 'empty', 'worthless']
        if any(keyword in message_lower for keyword in depression_keywords):
            return """I hear that you're going through a difficult time, and I want you to know that your feelings are valid. Depression can make everything feel overwhelming, but there are ways to find support and relief.

Some things that might help:
• Maintaining a routine, even a small one
• Connecting with supportive friends or family
• Engaging in activities you used to enjoy, even briefly
• Speaking with a mental health professional

Remember, depression is treatable, and you deserve support. Would you like to talk about what's been weighing on you lately?"""

        # Default supportive response
        return """Thank you for sharing with me. I'm here to listen and support you. While I can offer general guidance and coping strategies, please remember that I'm not a replacement for professional mental health care.

If you're dealing with serious mental health concerns, I encourage you to reach out to a qualified therapist or counselor. In the meantime, I'm here to chat and help however I can.

What would be most helpful for you right now?"""
    
    def analyze_sentiment(self, message: str) -> float:
        """
        Analyze the sentiment of a message.
        Returns a score between -1 (very negative) and 1 (very positive).
        """
        if not self.model:
            return 0.0  # Neutral fallback
        
        try:
            prompt = f"""Analyze the emotional sentiment of this message on a scale from -1 to 1:
-1 = Very negative (severe distress, crisis, hopelessness)
-0.5 = Negative (sadness, anxiety, mild distress)
0 = Neutral
0.5 = Positive (hopeful, calm, content)
1 = Very positive (happy, excited, grateful)

Message: "{message}"

Respond with only a number between -1 and 1."""

            response = self.model.generate_content(prompt)
            try:
                score = float(response.text.strip())
                return max(-1, min(1, score))  # Clamp between -1 and 1
            except ValueError:
                return 0.0
                
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return 0.0