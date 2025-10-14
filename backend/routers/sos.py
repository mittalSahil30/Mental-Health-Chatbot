from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import SOSContact
from schemas import SOSContactResponse, SOSContactCreate

router = APIRouter()

# Sample SOS contacts - you can customize these
SAMPLE_SOS_CONTACTS = [
    {
        "name": "National Suicide Prevention Lifeline",
        "phone": "988",
        "description": "24/7 free and confidential support for people in distress, prevention and crisis resources",
        "category": "crisis",
        "country": "USA"
    },
    {
        "name": "Crisis Text Line",
        "phone": "741741",
        "description": "Text HOME to 741741 - Free, 24/7 crisis support via text message",
        "category": "crisis",
        "country": "USA"
    },
    {
        "name": "National Domestic Violence Hotline",
        "phone": "1-800-799-7233",
        "description": "24/7 confidential support for domestic violence survivors and their loved ones",
        "category": "emergency",
        "country": "USA"
    },
    {
        "name": "SAMHSA National Helpline",
        "phone": "1-800-662-4357",
        "description": "Treatment referral and information service for mental health and substance use disorders",
        "category": "support",
        "country": "USA"
    },
    {
        "name": "National Alliance on Mental Illness (NAMI)",
        "phone": "1-800-950-6264",
        "email": "info@nami.org",
        "description": "Information, support, and resources for mental health conditions",
        "category": "support",
        "country": "USA"
    },
    {
        "name": "National Eating Disorders Association",
        "phone": "1-800-931-2237",
        "description": "Support for eating disorders - screening tool and treatment referrals",
        "category": "support",
        "country": "USA"
    },
    {
        "name": "LGBT National Hotline",
        "phone": "1-888-843-4564",
        "description": "Peer-support, community connections and resource information for LGBTQ+ individuals",
        "category": "support",
        "country": "USA"
    },
    {
        "name": "Veterans Crisis Line",
        "phone": "1-800-273-8255",
        "description": "24/7 confidential support for veterans in crisis and their families and friends",
        "category": "crisis",
        "country": "USA"
    },
    {
        "name": "National Sexual Assault Hotline",
        "phone": "1-800-656-4673",
        "description": "24/7 confidential support for survivors of sexual violence",
        "category": "emergency",
        "country": "USA"
    },
    {
        "name": "National Child Abuse Hotline",
        "phone": "1-800-4-A-CHILD (1-800-422-4453)",
        "description": "24/7 professional crisis counselors for child abuse prevention and treatment",
        "category": "emergency",
        "country": "USA"
    },
    {
        "name": "International Association for Suicide Prevention",
        "email": "info@iasp.info",
        "description": "Global resources and crisis centers directory",
        "category": "crisis",
        "country": "International"
    },
    {
        "name": "Samaritans (UK)",
        "phone": "116 123",
        "email": "jo@samaritans.org",
        "description": "24/7 emotional support for anyone in emotional distress or at risk of suicide",
        "category": "crisis",
        "country": "UK"
    },
    {
        "name": "Lifeline Australia",
        "phone": "13 11 14",
        "description": "24/7 crisis support and suicide prevention services",
        "category": "crisis",
        "country": "Australia"
    },
    {
        "name": "Canada Suicide Prevention Service",
        "phone": "1-833-456-4566",
        "description": "24/7 bilingual crisis support and resources",
        "category": "crisis",
        "country": "Canada"
    },
    {
        "name": "Emergency Services",
        "phone": "911",
        "description": "Call for immediate emergency medical, fire, or police assistance",
        "category": "emergency",
        "country": "USA"
    }
]

@router.on_event("startup")
async def populate_sos_contacts():
    """Populate the database with sample SOS contacts on startup."""
    # This would typically be done through a migration or admin interface
    pass

@router.get("/contacts", response_model=List[SOSContactResponse])
async def get_sos_contacts(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
    country: Optional[str] = None
):
    """Get all SOS contacts with optional filtering."""
    
    # Check if we have contacts in the database
    db_contacts = db.query(SOSContact).filter(SOSContact.is_active == True).all()
    
    # If no contacts in database, create them from sample data
    if not db_contacts:
        for contact_data in SAMPLE_SOS_CONTACTS:
            contact = SOSContact(**contact_data)
            db.add(contact)
        db.commit()
        db_contacts = db.query(SOSContact).filter(SOSContact.is_active == True).all()
    
    # Apply filters
    contacts = db_contacts
    if category:
        contacts = [c for c in contacts if c.category.lower() == category.lower()]
    if country:
        contacts = [c for c in contacts if c.country and c.country.lower() == country.lower()]
    
    # Sort by category priority (crisis first, then emergency, then support)
    category_priority = {"crisis": 1, "emergency": 2, "support": 3}
    contacts.sort(key=lambda x: category_priority.get(x.category, 4))
    
    return [SOSContactResponse.from_orm(contact) for contact in contacts]

@router.get("/contacts/{contact_id}", response_model=SOSContactResponse)
async def get_sos_contact(contact_id: int, db: Session = Depends(get_db)):
    """Get a specific SOS contact."""
    contact = db.query(SOSContact).filter(
        SOSContact.id == contact_id,
        SOSContact.is_active == True
    ).first()
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOS contact not found"
        )
    
    return SOSContactResponse.from_orm(contact)

@router.post("/contacts", response_model=SOSContactResponse)
async def create_sos_contact(
    contact_data: SOSContactCreate,
    db: Session = Depends(get_db)
):
    """Create a new SOS contact (admin function)."""
    
    db_contact = SOSContact(
        name=contact_data.name,
        phone=contact_data.phone,
        email=contact_data.email,
        description=contact_data.description,
        category=contact_data.category,
        country=contact_data.country
    )
    
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    return SOSContactResponse.from_orm(db_contact)

@router.get("/categories")
async def get_sos_categories():
    """Get available SOS contact categories."""
    return {
        "categories": [
            {
                "name": "crisis",
                "display_name": "Crisis Support",
                "description": "Immediate help for mental health crises, suicide prevention",
                "priority": 1
            },
            {
                "name": "emergency",
                "display_name": "Emergency Services",
                "description": "Emergency medical, police, fire, and safety services",
                "priority": 2
            },
            {
                "name": "support",
                "display_name": "Support & Resources",
                "description": "Ongoing support, information, and treatment resources",
                "priority": 3
            }
        ]
    }

@router.get("/countries")
async def get_available_countries(db: Session = Depends(get_db)):
    """Get list of countries with available SOS contacts."""
    
    # Get unique countries from database
    countries = db.query(SOSContact.country).filter(
        SOSContact.is_active == True,
        SOSContact.country.isnot(None)
    ).distinct().all()
    
    # If no contacts in database, return sample countries
    if not countries:
        return {
            "countries": ["USA", "UK", "Canada", "Australia", "International"]
        }
    
    country_list = [country[0] for country in countries if country[0]]
    country_list.sort()
    
    return {
        "countries": country_list
    }

@router.get("/emergency-info")
async def get_emergency_info():
    """Get emergency information and guidance."""
    return {
        "immediate_danger": {
            "title": "If you are in immediate danger:",
            "instructions": [
                "Call your local emergency number (911 in US, 999 in UK, etc.)",
                "Go to your nearest emergency room",
                "Call a crisis hotline immediately",
                "Reach out to a trusted friend, family member, or mental health professional"
            ]
        },
        "warning_signs": {
            "title": "Warning signs that require immediate help:",
            "signs": [
                "Thoughts of suicide or self-harm",
                "Thoughts of harming others",
                "Severe depression or hopelessness",
                "Hearing voices or seeing things that aren't there",
                "Extreme mood swings",
                "Substance abuse that's out of control",
                "Inability to perform daily activities"
            ]
        },
        "how_to_help": {
            "title": "How to help someone in crisis:",
            "steps": [
                "Listen without judgment",
                "Take their feelings seriously",
                "Ask directly about suicide if you're concerned",
                "Help them connect with professional help",
                "Stay with them if possible",
                "Remove any means of self-harm if safe to do so",
                "Follow up regularly"
            ]
        },
        "safety_planning": {
            "title": "Create a safety plan:",
            "elements": [
                "Identify warning signs and triggers",
                "List coping strategies that help",
                "Identify supportive people to contact",
                "List professional contacts and crisis numbers",
                "Make your environment safe",
                "Write down reasons for living"
            ]
        }
    }