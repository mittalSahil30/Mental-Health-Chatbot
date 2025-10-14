from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, UserProfile, db
import json

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_guest:
            return jsonify({'error': 'Profile feature not available for guest users'}), 403
        
        # Get or create profile
        profile = UserProfile.query.filter_by(user_id=user.id).first()
        
        if not profile:
            profile = UserProfile(user_id=user.id)
            db.session.add(profile)
            db.session.commit()
        
        return jsonify({
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_guest:
            return jsonify({'error': 'Profile feature not available for guest users'}), 403
        
        data = request.get_json()
        
        # Get or create profile
        profile = UserProfile.query.filter_by(user_id=user.id).first()
        
        if not profile:
            profile = UserProfile(user_id=user.id)
            db.session.add(profile)
        
        # Update profile fields
        if 'full_name' in data:
            profile.full_name = data['full_name']
        
        if 'age' in data:
            age = data['age']
            if age and (age < 1 or age > 150):
                return jsonify({'error': 'Invalid age'}), 400
            profile.age = age
        
        if 'gender' in data:
            profile.gender = data['gender']
        
        if 'bio' in data:
            profile.bio = data['bio']
        
        if 'profile_picture' in data:
            profile.profile_picture = data['profile_picture']
        
        if 'preferences' in data:
            # Validate that preferences is a dict
            if isinstance(data['preferences'], dict):
                profile.preferences = json.dumps(data['preferences'])
            else:
                return jsonify({'error': 'Preferences must be an object'}), 400
        
        # Update user fields if provided
        if 'username' in data:
            username = data['username']
            # Check if username is already taken
            existing_user = User.query.filter_by(username=username).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Username already taken'}), 400
            user.username = username
        
        if 'email' in data:
            email = data['email']
            # Check if email is already taken
            existing_user = User.query.filter_by(email=email).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Email already taken'}), 400
            user.email = email
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict(),
            'profile': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get user statistics"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        from models import ChatHistory, JournalEntry, AssessmentResult
        
        stats = {
            'total_chats': ChatHistory.query.filter_by(user_id=user.id).count(),
            'total_journal_entries': JournalEntry.query.filter_by(user_id=user.id).count() if not user.is_guest else 0,
            'total_assessments': AssessmentResult.query.filter_by(user_id=user.id).count() if not user.is_guest else 0,
            'member_since': user.created_at.isoformat(),
            'is_guest': user.is_guest
        }
        
        # Get recent activity
        recent_chats = ChatHistory.query.filter_by(user_id=user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(5).all()
        
        stats['recent_activity'] = {
            'last_chat': recent_chats[0].timestamp.isoformat() if recent_chats else None,
            'chat_frequency': len(recent_chats)
        }
        
        if not user.is_guest:
            recent_journals = JournalEntry.query.filter_by(user_id=user.id)\
                .order_by(JournalEntry.created_at.desc()).limit(5).all()
            
            stats['recent_activity']['last_journal'] = recent_journals[0].created_at.isoformat() if recent_journals else None
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_account():
    """Delete user account and all associated data"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete user (cascades to all related data)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
