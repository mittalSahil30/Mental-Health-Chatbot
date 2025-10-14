from flask import Blueprint, request, jsonify
from models import SOSContact, db

sos_bp = Blueprint('sos', __name__)

# Initialize default SOS contacts (templates that can be customized)
DEFAULT_CONTACTS = [
    {
        'name': 'National Suicide Prevention Lifeline (US)',
        'phone_number': '988',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': '24/7, free and confidential support for people in distress, prevention and crisis resources.',
        'category': 'suicide_prevention'
    },
    {
        'name': 'Crisis Text Line',
        'phone_number': 'Text HOME to 741741',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'Free 24/7 support for those in crisis. Text from anywhere in the USA.',
        'category': 'crisis'
    },
    {
        'name': 'SAMHSA National Helpline',
        'phone_number': '1-800-662-4357',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'Treatment referral and information service for mental health and substance use disorders.',
        'category': 'mental_health'
    },
    {
        'name': 'National Alliance on Mental Illness (NAMI)',
        'phone_number': '1-800-950-6264',
        'email': 'info@nami.org',
        'description': 'Information and referral services for mental health conditions.',
        'category': 'mental_health'
    },
    {
        'name': 'Veterans Crisis Line',
        'phone_number': '1-800-273-8255 (Press 1)',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'Support for veterans in crisis and their families.',
        'category': 'veterans'
    },
    {
        'name': 'Disaster Distress Helpline',
        'phone_number': '1-800-985-5990',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'Crisis counseling for people experiencing emotional distress related to disasters.',
        'category': 'crisis'
    },
    {
        'name': 'Trevor Project (LGBTQ Youth)',
        'phone_number': '1-866-488-7386',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'Crisis intervention and suicide prevention for LGBTQ young people.',
        'category': 'lgbtq'
    },
    {
        'name': 'Emergency Services',
        'phone_number': '911',
        'email': 'CONTACT_EMAIL_HERE@example.com',
        'description': 'For immediate emergency assistance (police, fire, medical).',
        'category': 'emergency'
    },
    {
        'name': 'Local Mental Health Crisis Center',
        'phone_number': 'YOUR_LOCAL_NUMBER_HERE',
        'email': 'YOUR_LOCAL_EMAIL_HERE@example.com',
        'description': 'Contact your local mental health crisis center. Fill in your local contact information.',
        'category': 'local'
    },
    {
        'name': 'Personal Emergency Contact',
        'phone_number': 'YOUR_CONTACT_NUMBER_HERE',
        'email': 'YOUR_CONTACT_EMAIL_HERE@example.com',
        'description': 'Your trusted friend, family member, or therapist. Fill in their contact information.',
        'category': 'personal'
    }
]

def init_default_contacts():
    """Initialize default SOS contacts if they don't exist"""
    existing_count = SOSContact.query.count()
    
    if existing_count == 0:
        for contact_data in DEFAULT_CONTACTS:
            contact = SOSContact(**contact_data)
            db.session.add(contact)
        
        try:
            db.session.commit()
            print("Default SOS contacts initialized")
        except Exception as e:
            db.session.rollback()
            print(f"Error initializing SOS contacts: {e}")

@sos_bp.route('/contacts', methods=['GET'])
def get_contacts():
    """Get all SOS contacts"""
    try:
        # Initialize default contacts if none exist
        init_default_contacts()
        
        category = request.args.get('category', None)
        
        if category:
            contacts = SOSContact.query.filter_by(category=category, is_active=True).all()
        else:
            contacts = SOSContact.query.filter_by(is_active=True).all()
        
        return jsonify({
            'contacts': [contact.to_dict() for contact in contacts],
            'total': len(contacts)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sos_bp.route('/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Get a specific SOS contact"""
    try:
        contact = SOSContact.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        return jsonify({'contact': contact.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sos_bp.route('/contacts', methods=['POST'])
def create_contact():
    """Create a new SOS contact (admin only - add authentication as needed)"""
    try:
        data = request.get_json()
        
        name = data.get('name')
        phone_number = data.get('phone_number')
        email = data.get('email')
        description = data.get('description')
        category = data.get('category')
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        contact = SOSContact(
            name=name,
            phone_number=phone_number,
            email=email,
            description=description,
            category=category
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify({
            'message': 'Contact created successfully',
            'contact': contact.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sos_bp.route('/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update an SOS contact (admin only - add authentication as needed)"""
    try:
        contact = SOSContact.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            contact.name = data['name']
        if 'phone_number' in data:
            contact.phone_number = data['phone_number']
        if 'email' in data:
            contact.email = data['email']
        if 'description' in data:
            contact.description = data['description']
        if 'category' in data:
            contact.category = data['category']
        if 'is_active' in data:
            contact.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Contact updated successfully',
            'contact': contact.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sos_bp.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete an SOS contact (admin only - add authentication as needed)"""
    try:
        contact = SOSContact.query.get(contact_id)
        
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({'message': 'Contact deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@sos_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all contact categories"""
    try:
        from sqlalchemy import func
        
        categories = db.session.query(SOSContact.category, func.count(SOSContact.id))\
            .filter_by(is_active=True)\
            .group_by(SOSContact.category)\
            .all()
        
        category_list = [{'category': cat, 'count': count} for cat, count in categories if cat]
        
        return jsonify({
            'categories': category_list,
            'total': len(category_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
