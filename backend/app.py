from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from datetime import timedelta

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mental_health.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['GEMINI_API_KEY'] = os.environ.get('GEMINI_API_KEY', '')

# Initialize extensions
from models import db
db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Import models (after db initialization)
from models import User, ChatHistory, JournalEntry, AssessmentResult, UserProfile

# Import routes
from routes.auth import auth_bp
from routes.chat import chat_bp
from routes.journal import journal_bp
from routes.assessment import assessment_bp
from routes.mindfulness import mindfulness_bp
from routes.profile import profile_bp
from routes.sos import sos_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(journal_bp, url_prefix='/api/journal')
app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
app.register_blueprint(mindfulness_bp, url_prefix='/api/mindfulness')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(sos_bp, url_prefix='/api/sos')

# Create database tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

@app.route('/')
def home():
    return jsonify({
        'message': 'Mental Health Chatbot API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'chat': '/api/chat',
            'journal': '/api/journal',
            'assessment': '/api/assessment',
            'mindfulness': '/api/mindfulness',
            'profile': '/api/profile',
            'sos': '/api/sos'
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
