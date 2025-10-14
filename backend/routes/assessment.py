from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, AssessmentResult, db
import json

assessment_bp = Blueprint('assessment', __name__)

# Mental Health Assessment Questions
ASSESSMENT_TYPES = {
    'anxiety': {
        'name': 'Generalized Anxiety Disorder (GAD-7)',
        'questions': [
            'Feeling nervous, anxious, or on edge',
            'Not being able to stop or control worrying',
            'Worrying too much about different things',
            'Trouble relaxing',
            'Being so restless that it\'s hard to sit still',
            'Becoming easily annoyed or irritable',
            'Feeling afraid as if something awful might happen'
        ],
        'scale': ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        'scoring': {
            0: 'Minimal anxiety',
            5: 'Mild anxiety',
            10: 'Moderate anxiety',
            15: 'Severe anxiety'
        }
    },
    'depression': {
        'name': 'Patient Health Questionnaire (PHQ-9)',
        'questions': [
            'Little interest or pleasure in doing things',
            'Feeling down, depressed, or hopeless',
            'Trouble falling or staying asleep, or sleeping too much',
            'Feeling tired or having little energy',
            'Poor appetite or overeating',
            'Feeling bad about yourself or that you are a failure',
            'Trouble concentrating on things',
            'Moving or speaking slowly, or being fidgety or restless',
            'Thoughts that you would be better off dead or hurting yourself'
        ],
        'scale': ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        'scoring': {
            0: 'Minimal depression',
            5: 'Mild depression',
            10: 'Moderate depression',
            15: 'Moderately severe depression',
            20: 'Severe depression'
        }
    },
    'stress': {
        'name': 'Perceived Stress Scale (PSS-10)',
        'questions': [
            'How often have you been upset because of something that happened unexpectedly?',
            'How often have you felt that you were unable to control important things in your life?',
            'How often have you felt nervous and stressed?',
            'How often have you felt confident about your ability to handle personal problems?',
            'How often have you felt that things were going your way?',
            'How often have you found that you could not cope with all things you had to do?',
            'How often have you been able to control irritations in your life?',
            'How often have you felt that you were on top of things?',
            'How often have you been angered because of things outside of your control?',
            'How often have you felt difficulties were piling up so high that you could not overcome them?'
        ],
        'scale': ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
        'scoring': {
            0: 'Low stress',
            14: 'Moderate stress',
            27: 'High perceived stress'
        }
    }
}

def calculate_severity(assessment_type, score, max_score):
    """Calculate severity level based on score"""
    scoring = ASSESSMENT_TYPES[assessment_type]['scoring']
    severity = 'Unknown'
    
    for threshold, level in sorted(scoring.items(), reverse=True):
        if score >= threshold:
            severity = level
            break
    
    return severity

def generate_recommendations(assessment_type, severity_level, score):
    """Generate personalized recommendations based on assessment results"""
    recommendations = []
    
    if 'severe' in severity_level.lower():
        recommendations.append("Your responses indicate significant distress. We strongly recommend speaking with a mental health professional as soon as possible.")
        recommendations.append("Consider contacting a crisis helpline if you're experiencing thoughts of self-harm.")
        recommendations.append("Emergency services: Call 988 (Suicide & Crisis Lifeline) or 911")
    elif 'moderate' in severity_level.lower():
        recommendations.append("Your responses suggest moderate symptoms. Consider scheduling an appointment with a mental health professional.")
        recommendations.append("Practice daily mindfulness and relaxation exercises available in our app.")
        recommendations.append("Maintain a regular sleep schedule and engage in physical activity.")
    elif 'mild' in severity_level.lower():
        recommendations.append("Your responses indicate mild symptoms. Continue monitoring your mental health.")
        recommendations.append("Use our journal feature to track your mood and identify patterns.")
        recommendations.append("Try our guided mindfulness exercises regularly.")
        recommendations.append("Maintain healthy habits: exercise, sleep, and social connections.")
    else:
        recommendations.append("Your responses suggest minimal symptoms. Great job maintaining your mental health!")
        recommendations.append("Continue with healthy habits and use our app for preventive care.")
        recommendations.append("Regular check-ins with yourself can help maintain wellness.")
    
    return "\n".join(recommendations)

@assessment_bp.route('/types', methods=['GET'])
def get_assessment_types():
    """Get all available assessment types"""
    try:
        assessments = {}
        for key, value in ASSESSMENT_TYPES.items():
            assessments[key] = {
                'name': value['name'],
                'questions': value['questions'],
                'scale': value['scale'],
                'total_questions': len(value['questions'])
            }
        
        return jsonify({'assessments': assessments}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_guest:
            return jsonify({'error': 'Assessment feature not available for guest users'}), 403
        
        data = request.get_json()
        
        assessment_type = data.get('assessment_type')
        answers = data.get('answers', [])
        
        if not assessment_type or assessment_type not in ASSESSMENT_TYPES:
            return jsonify({'error': 'Invalid assessment type'}), 400
        
        if not answers:
            return jsonify({'error': 'Answers are required'}), 400
        
        # Validate answers
        num_questions = len(ASSESSMENT_TYPES[assessment_type]['questions'])
        if len(answers) != num_questions:
            return jsonify({'error': f'Expected {num_questions} answers'}), 400
        
        # Calculate score
        score = sum(answers)
        max_score = (len(ASSESSMENT_TYPES[assessment_type]['scale']) - 1) * num_questions
        
        # Calculate severity
        severity_level = calculate_severity(assessment_type, score, max_score)
        
        # Generate recommendations
        recommendations = generate_recommendations(assessment_type, severity_level, score)
        
        # Save assessment result
        result = AssessmentResult(
            user_id=user.id,
            assessment_type=assessment_type,
            score=score,
            max_score=max_score,
            severity_level=severity_level,
            answers=json.dumps(answers),
            recommendations=recommendations
        )
        
        db.session.add(result)
        db.session.commit()
        
        return jsonify({
            'message': 'Assessment submitted successfully',
            'result': result.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get all assessment results
        results = AssessmentResult.query.filter_by(user_id=user.id)\
            .order_by(AssessmentResult.created_at.desc()).all()
        
        return jsonify({
            'results': [result.to_dict() for result in results]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/results/<int:result_id>', methods=['GET'])
@jwt_required()
def get_result(result_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        result = AssessmentResult.query.filter_by(id=result_id, user_id=user.id).first()
        
        if not result:
            return jsonify({'error': 'Result not found'}), 404
        
        return jsonify({'result': result.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@assessment_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get assessment analytics
        results = AssessmentResult.query.filter_by(user_id=user.id)\
            .order_by(AssessmentResult.created_at.desc()).all()
        
        analytics = {
            'total_assessments': len(results),
            'by_type': {},
            'recent_scores': []
        }
        
        for result in results:
            # Group by type
            if result.assessment_type not in analytics['by_type']:
                analytics['by_type'][result.assessment_type] = {
                    'count': 0,
                    'latest_severity': None,
                    'trend': []
                }
            
            analytics['by_type'][result.assessment_type]['count'] += 1
            if not analytics['by_type'][result.assessment_type]['latest_severity']:
                analytics['by_type'][result.assessment_type]['latest_severity'] = result.severity_level
            
            analytics['by_type'][result.assessment_type]['trend'].append({
                'score': result.score,
                'max_score': result.max_score,
                'date': result.created_at.isoformat()
            })
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
