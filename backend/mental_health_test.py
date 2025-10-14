def calculate_mental_health_score(responses: dict) -> float:
    """
    Calculate mental health score based on PHQ-9 and GAD-7 inspired questions
    Each question is scored 0-3, total possible score is 0-27
    Lower scores indicate better mental health
    """
    
    # Define the scoring weights for different question categories
    question_weights = {
        # Depression-related questions (PHQ-9 inspired)
        "mood_low": 1.0,
        "sleep_problems": 0.8,
        "energy_low": 0.9,
        "appetite_changes": 0.7,
        "concentration_difficulty": 0.8,
        "self_worth_low": 1.0,
        "interest_loss": 0.9,
        "hopelessness": 1.2,
        
        # Anxiety-related questions (GAD-7 inspired)
        "worry_excessive": 1.0,
        "restlessness": 0.8,
        "fatigue": 0.7,
        "irritability": 0.8,
        "muscle_tension": 0.6,
        "sleep_disturbance": 0.8,
        "concentration_anxiety": 0.9,
        
        # General well-being questions
        "stress_level": 1.0,
        "social_support": -0.8,  # Negative weight - more support = better score
        "coping_ability": -0.9,  # Negative weight - better coping = better score
        "life_satisfaction": -1.0,  # Negative weight - more satisfaction = better score
        "physical_health": -0.7,  # Negative weight - better health = better score
    }
    
    total_score = 0.0
    total_weight = 0.0
    
    for question_id, response_value in responses.items():
        if question_id in question_weights:
            weight = question_weights[question_id]
            total_score += response_value * weight
            total_weight += abs(weight)
    
    # Normalize the score to 0-10 scale
    if total_weight > 0:
        normalized_score = (total_score / total_weight) * 10
        # Ensure score is between 0 and 10
        normalized_score = max(0, min(10, normalized_score))
    else:
        normalized_score = 5.0  # Default middle score if no valid responses
    
    return round(normalized_score, 2)

def get_mental_health_questions() -> list:
    """
    Return the mental health assessment questions
    Each question has a scale of 0-3 (Not at all, Several days, More than half the days, Nearly every day)
    """
    return [
        {
            "id": "mood_low",
            "question": "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
            "category": "depression"
        },
        {
            "id": "sleep_problems",
            "question": "Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
            "category": "depression"
        },
        {
            "id": "energy_low",
            "question": "Over the last 2 weeks, how often have you felt tired or had little energy?",
            "category": "depression"
        },
        {
            "id": "appetite_changes",
            "question": "Over the last 2 weeks, how often have you had poor appetite or overeating?",
            "category": "depression"
        },
        {
            "id": "concentration_difficulty",
            "question": "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?",
            "category": "depression"
        },
        {
            "id": "self_worth_low",
            "question": "Over the last 2 weeks, how often have you felt bad about yourself or that you are a failure or have let yourself or your family down?",
            "category": "depression"
        },
        {
            "id": "interest_loss",
            "question": "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
            "category": "depression"
        },
        {
            "id": "hopelessness",
            "question": "Over the last 2 weeks, how often have you felt that things would never get better?",
            "category": "depression"
        },
        {
            "id": "worry_excessive",
            "question": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
            "category": "anxiety"
        },
        {
            "id": "restlessness",
            "question": "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
            "category": "anxiety"
        },
        {
            "id": "fatigue",
            "question": "Over the last 2 weeks, how often have you been bothered by feeling restless or keyed up or on edge?",
            "category": "anxiety"
        },
        {
            "id": "irritability",
            "question": "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
            "category": "anxiety"
        },
        {
            "id": "muscle_tension",
            "question": "Over the last 2 weeks, how often have you been bothered by muscle tension, aches, or soreness?",
            "category": "anxiety"
        },
        {
            "id": "sleep_disturbance",
            "question": "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep?",
            "category": "anxiety"
        },
        {
            "id": "concentration_anxiety",
            "question": "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?",
            "category": "anxiety"
        },
        {
            "id": "stress_level",
            "question": "How would you rate your overall stress level over the past week?",
            "category": "general"
        },
        {
            "id": "social_support",
            "question": "How satisfied are you with your current social support system?",
            "category": "general"
        },
        {
            "id": "coping_ability",
            "question": "How well do you feel you are coping with daily challenges?",
            "category": "general"
        },
        {
            "id": "life_satisfaction",
            "question": "How satisfied are you with your life overall right now?",
            "category": "general"
        },
        {
            "id": "physical_health",
            "question": "How would you rate your physical health over the past week?",
            "category": "general"
        }
    ]

def interpret_score(score: float) -> dict:
    """
    Interpret the mental health score and provide recommendations
    """
    if score <= 2:
        interpretation = "excellent"
        message = "Your mental health appears to be in excellent condition. Keep up the great work with your self-care practices!"
        recommendations = [
            "Continue your current self-care routine",
            "Consider helping others who might be struggling",
            "Maintain your healthy habits"
        ]
    elif score <= 4:
        interpretation = "good"
        message = "Your mental health is in good shape overall. You're managing well, but there might be some areas to focus on."
        recommendations = [
            "Continue practicing mindfulness and self-care",
            "Consider journaling about your experiences",
            "Stay connected with supportive people"
        ]
    elif score <= 6:
        interpretation = "moderate"
        message = "You're experiencing some challenges with your mental health. This is common and manageable with the right support."
        recommendations = [
            "Try daily mindfulness exercises",
            "Consider talking to a trusted friend or family member",
            "Use your journal to track patterns in your mood",
            "Consider reaching out to a mental health professional"
        ]
    elif score <= 8:
        interpretation = "concerning"
        message = "You're going through a difficult time with your mental health. It's important to take this seriously and seek support."
        recommendations = [
            "Reach out to a mental health professional as soon as possible",
            "Use your SOS contacts for immediate support",
            "Practice daily self-care and mindfulness",
            "Consider talking to your doctor about your concerns"
        ]
    else:
        interpretation = "urgent"
        message = "Your responses suggest you're experiencing significant mental health challenges. Please seek professional help immediately."
        recommendations = [
            "Contact a mental health professional immediately",
            "Use emergency services if you're in crisis (911)",
            "Reach out to your SOS contacts right away",
            "Consider going to your nearest emergency room if you're having thoughts of self-harm"
        ]
    
    return {
        "interpretation": interpretation,
        "message": message,
        "recommendations": recommendations,
        "score": score
    }