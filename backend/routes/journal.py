from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, JournalEntry, db
from datetime import datetime

journal_bp = Blueprint('journal', __name__)

@journal_bp.route('/entries', methods=['GET'])
@jwt_required()
def get_entries():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_guest:
            return jsonify({'error': 'Journal feature not available for guest users'}), 403
        
        # Get pagination and filter parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        mood = request.args.get('mood', None)
        
        # Build query
        query = JournalEntry.query.filter_by(user_id=user.id)
        
        if mood:
            query = query.filter_by(mood=mood)
        
        # Get entries
        entries = query.order_by(JournalEntry.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'entries': [entry.to_dict() for entry in entries.items],
            'total': entries.total,
            'pages': entries.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@journal_bp.route('/entries', methods=['POST'])
@jwt_required()
def create_entry():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_guest:
            return jsonify({'error': 'Journal feature not available for guest users'}), 403
        
        data = request.get_json()
        
        title = data.get('title')
        content = data.get('content')
        mood = data.get('mood')
        
        if not title or not content:
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Create new journal entry
        entry = JournalEntry(
            user_id=user.id,
            title=title,
            content=content,
            mood=mood
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify({
            'message': 'Journal entry created successfully',
            'entry': entry.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@journal_bp.route('/entries/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_entry(entry_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user.id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        return jsonify({'entry': entry.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@journal_bp.route('/entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(entry_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user.id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            entry.title = data['title']
        if 'content' in data:
            entry.content = data['content']
        if 'mood' in data:
            entry.mood = data['mood']
        
        entry.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Journal entry updated successfully',
            'entry': entry.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@journal_bp.route('/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(entry_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user.id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Journal entry deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@journal_bp.route('/moods', methods=['GET'])
@jwt_required()
def get_mood_analytics():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get mood distribution
        from sqlalchemy import func
        mood_stats = db.session.query(
            JournalEntry.mood,
            func.count(JournalEntry.id).label('count')
        ).filter_by(user_id=user.id)\
         .group_by(JournalEntry.mood)\
         .all()
        
        mood_distribution = {mood: count for mood, count in mood_stats if mood}
        
        return jsonify({
            'mood_distribution': mood_distribution,
            'total_entries': sum(mood_distribution.values())
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
