from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, ChatHistory, db
import google.generativeai as genai
import os

chat_bp = Blueprint('chat', __name__)

def get_personalized_context(user):
    """Get personalized context based on user's history and assessment results"""
    context = []
    
    # Add user information
    if user.profile:
        if user.profile.full_name:
            context.append(f"User's name: {user.profile.full_name}")
        if user.profile.age:
            context.append(f"Age: {user.profile.age}")
    
    # Add recent assessment results
    recent_assessments = user.assessment_results[-3:] if user.assessment_results else []
    if recent_assessments:
        context.append("\nRecent mental health assessments:")
        for assessment in recent_assessments:
            context.append(f"- {assessment.assessment_type}: {assessment.severity_level} level")
    
    # Add recent mood from journal
    recent_journals = user.journal_entries[-5:] if user.journal_entries else []
    if recent_journals:
        moods = [j.mood for j in recent_journals if j.mood]
        if moods:
            context.append(f"\nRecent moods: {', '.join(moods)}")
    
    return "\n".join(context)

@chat_bp.route('/message', methods=['POST'])
@jwt_required()
def send_message():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Configure Gemini API
        api_key = current_app.config.get('GEMINI_API_KEY')
        if not api_key:
            return jsonify({'error': 'Gemini API key not configured'}), 500
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Get personalized context
        personalized_context = get_personalized_context(user)
        
        # Create system prompt for mental health support
        system_prompt = """You are a compassionate and empathetic mental health support chatbot. Your role is to:
1. Listen actively and provide emotional support
2. Offer coping strategies and mindfulness techniques
3. Encourage professional help when needed
4. Never diagnose or prescribe medication
5. Be supportive, non-judgmental, and understanding
6. Recognize crisis situations and suggest appropriate resources

Important guidelines:
- If someone expresses suicidal thoughts or self-harm, immediately recommend contacting emergency services or a crisis hotline
- Validate feelings while providing hope and practical suggestions
- Keep responses conversational and empathetic
- Remember previous context from the conversation
"""
        
        # Get recent chat history for context
        recent_chats = ChatHistory.query.filter_by(user_id=user.id).order_by(ChatHistory.timestamp.desc()).limit(5).all()
        conversation_history = "\n".join([f"User: {c.message}\nAssistant: {c.response}" for c in reversed(recent_chats)])
        
        # Construct full prompt
        full_prompt = f"{system_prompt}\n\n{personalized_context}\n\nConversation history:\n{conversation_history}\n\nUser: {message}\nAssistant:"
        
        # Generate response
        response = model.generate_content(full_prompt)
        bot_response = response.text
        
        # Simple sentiment analysis (you can enhance this)
        sentiment = "neutral"
        negative_keywords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'angry', 'hurt', 'pain']
        positive_keywords = ['happy', 'grateful', 'excited', 'good', 'great', 'wonderful', 'peaceful']
        
        message_lower = message.lower()
        if any(word in message_lower for word in negative_keywords):
            sentiment = "negative"
        elif any(word in message_lower for word in positive_keywords):
            sentiment = "positive"
        
        # Save to chat history
        chat = ChatHistory(
            user_id=user.id,
            message=message,
            response=bot_response,
            sentiment=sentiment
        )
        db.session.add(chat)
        db.session.commit()
        
        return jsonify({
            'message': message,
            'response': bot_response,
            'sentiment': sentiment,
            'timestamp': chat.timestamp.isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Get chat history
        chats = ChatHistory.query.filter_by(user_id=user.id)\
            .order_by(ChatHistory.timestamp.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'chats': [chat.to_dict() for chat in chats.items],
            'total': chats.total,
            'pages': chats.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/clear-history', methods=['DELETE'])
@jwt_required()
def clear_history():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete all chat history
        ChatHistory.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        
        return jsonify({'message': 'Chat history cleared successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get sentiment analytics
        total_chats = ChatHistory.query.filter_by(user_id=user.id).count()
        positive_chats = ChatHistory.query.filter_by(user_id=user.id, sentiment='positive').count()
        negative_chats = ChatHistory.query.filter_by(user_id=user.id, sentiment='negative').count()
        neutral_chats = ChatHistory.query.filter_by(user_id=user.id, sentiment='neutral').count()
        
        return jsonify({
            'total_conversations': total_chats,
            'sentiment_breakdown': {
                'positive': positive_chats,
                'negative': negative_chats,
                'neutral': neutral_chats
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
