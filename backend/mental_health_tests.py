from typing import Dict, List, Tuple

class MentalHealthTests:
    """Mental health assessment tests with scoring logic."""
    
    @staticmethod
    def get_depression_test() -> Dict:
        """PHQ-9 inspired depression screening test."""
        return {
            "test_type": "depression",
            "title": "Depression Screening (PHQ-9 Style)",
            "description": "This questionnaire helps assess symptoms that may be related to depression. Please answer based on how you've been feeling over the past 2 weeks.",
            "instructions": "For each statement, select how often you have been bothered by the following problems:",
            "questions": [
                {
                    "id": 1,
                    "question": "Little interest or pleasure in doing things",
                    "options": [
                        "Not at all",
                        "Several days", 
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 2,
                    "question": "Feeling down, depressed, or hopeless",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days", 
                        "Nearly every day"
                    ]
                },
                {
                    "id": 3,
                    "question": "Trouble falling or staying asleep, or sleeping too much",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 4,
                    "question": "Feeling tired or having little energy",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 5,
                    "question": "Poor appetite or overeating",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 6,
                    "question": "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 7,
                    "question": "Trouble concentrating on things, such as reading the newspaper or watching television",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 8,
                    "question": "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around a lot more than usual",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 9,
                    "question": "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_anxiety_test() -> Dict:
        """GAD-7 inspired anxiety screening test."""
        return {
            "test_type": "anxiety",
            "title": "Anxiety Screening (GAD-7 Style)",
            "description": "This questionnaire helps assess symptoms that may be related to anxiety. Please answer based on how you've been feeling over the past 2 weeks.",
            "instructions": "For each statement, select how often you have been bothered by the following problems:",
            "questions": [
                {
                    "id": 1,
                    "question": "Feeling nervous, anxious, or on edge",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 2,
                    "question": "Not being able to stop or control worrying",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 3,
                    "question": "Worrying too much about different things",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 4,
                    "question": "Trouble relaxing",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 5,
                    "question": "Being so restless that it's hard to sit still",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 6,
                    "question": "Becoming easily annoyed or irritable",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                },
                {
                    "id": 7,
                    "question": "Feeling afraid as if something awful might happen",
                    "options": [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day"
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_stress_test() -> Dict:
        """Perceived Stress Scale inspired test."""
        return {
            "test_type": "stress",
            "title": "Stress Assessment",
            "description": "This questionnaire helps assess your current stress levels and how you cope with stress.",
            "instructions": "For each statement, select how often you have felt or thought this way in the past month:",
            "questions": [
                {
                    "id": 1,
                    "question": "How often have you been upset because of something that happened unexpectedly?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                },
                {
                    "id": 2,
                    "question": "How often have you felt that you were unable to control the important things in your life?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                },
                {
                    "id": 3,
                    "question": "How often have you felt nervous and stressed?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                },
                {
                    "id": 4,
                    "question": "How often have you felt confident about your ability to handle your personal problems?",
                    "options": [
                        "Very often",
                        "Fairly often",
                        "Sometimes",
                        "Almost never",
                        "Never"
                    ]
                },
                {
                    "id": 5,
                    "question": "How often have you felt that things were going your way?",
                    "options": [
                        "Very often",
                        "Fairly often",
                        "Sometimes",
                        "Almost never",
                        "Never"
                    ]
                },
                {
                    "id": 6,
                    "question": "How often have you found that you could not cope with all the things that you had to do?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                },
                {
                    "id": 7,
                    "question": "How often have you been able to control irritations in your life?",
                    "options": [
                        "Very often",
                        "Fairly often",
                        "Sometimes",
                        "Almost never",
                        "Never"
                    ]
                },
                {
                    "id": 8,
                    "question": "How often have you felt that you were on top of things?",
                    "options": [
                        "Very often",
                        "Fairly often",
                        "Sometimes",
                        "Almost never",
                        "Never"
                    ]
                },
                {
                    "id": 9,
                    "question": "How often have you been angered because of things that happened that were outside of your control?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                },
                {
                    "id": 10,
                    "question": "How often have you felt difficulties were piling up so high that you could not overcome them?",
                    "options": [
                        "Never",
                        "Almost never",
                        "Sometimes",
                        "Fairly often",
                        "Very often"
                    ]
                }
            ]
        }
    
    @staticmethod
    def calculate_score(test_type: str, responses: List[Dict]) -> Tuple[int, int, str, str]:
        """
        Calculate test score and provide interpretation.
        
        Returns:
            Tuple of (score, max_score, severity_level, recommendations)
        """
        if test_type == "depression":
            return MentalHealthTests._calculate_depression_score(responses)
        elif test_type == "anxiety":
            return MentalHealthTests._calculate_anxiety_score(responses)
        elif test_type == "stress":
            return MentalHealthTests._calculate_stress_score(responses)
        else:
            raise ValueError(f"Unknown test type: {test_type}")
    
    @staticmethod
    def _calculate_depression_score(responses: List[Dict]) -> Tuple[int, int, str, str]:
        """Calculate PHQ-9 style depression score."""
        total_score = sum(response["answer"] for response in responses)
        max_score = 27  # 9 questions × 3 points max each
        
        if total_score <= 4:
            severity = "minimal"
            recommendations = "Your responses suggest minimal depression symptoms. Continue with self-care practices like regular exercise, good sleep hygiene, and social connections."
        elif total_score <= 9:
            severity = "mild"
            recommendations = "Your responses suggest mild depression symptoms. Consider lifestyle changes, stress management, and speaking with a counselor or therapist for support."
        elif total_score <= 14:
            severity = "moderate"
            recommendations = "Your responses suggest moderate depression symptoms. It's recommended to speak with a mental health professional for evaluation and treatment options."
        elif total_score <= 19:
            severity = "moderately_severe"
            recommendations = "Your responses suggest moderately severe depression symptoms. Please consider seeking professional help from a therapist or psychiatrist for proper evaluation and treatment."
        else:
            severity = "severe"
            recommendations = "Your responses suggest severe depression symptoms. It's important to seek immediate professional help. Consider contacting a mental health professional or crisis helpline."
        
        return total_score, max_score, severity, recommendations
    
    @staticmethod
    def _calculate_anxiety_score(responses: List[Dict]) -> Tuple[int, int, str, str]:
        """Calculate GAD-7 style anxiety score."""
        total_score = sum(response["answer"] for response in responses)
        max_score = 21  # 7 questions × 3 points max each
        
        if total_score <= 4:
            severity = "minimal"
            recommendations = "Your responses suggest minimal anxiety symptoms. Continue with relaxation techniques, regular exercise, and stress management practices."
        elif total_score <= 9:
            severity = "mild"
            recommendations = "Your responses suggest mild anxiety symptoms. Consider practicing mindfulness, deep breathing exercises, and maintaining a regular routine. If symptoms persist, consider speaking with a counselor."
        elif total_score <= 14:
            severity = "moderate"
            recommendations = "Your responses suggest moderate anxiety symptoms. It's recommended to speak with a mental health professional for coping strategies and potential treatment options."
        else:
            severity = "severe"
            recommendations = "Your responses suggest severe anxiety symptoms. Please consider seeking professional help from a therapist or psychiatrist for proper evaluation and treatment."
        
        return total_score, max_score, severity, recommendations
    
    @staticmethod
    def _calculate_stress_score(responses: List[Dict]) -> Tuple[int, int, str, str]:
        """Calculate stress assessment score."""
        total_score = sum(response["answer"] for response in responses)
        max_score = 40  # 10 questions × 4 points max each
        
        if total_score <= 13:
            severity = "low"
            recommendations = "Your stress levels appear to be low. Continue with your current stress management practices and maintain a healthy work-life balance."
        elif total_score <= 26:
            severity = "moderate"
            recommendations = "Your stress levels are moderate. Consider implementing stress reduction techniques like regular exercise, meditation, time management, and ensuring adequate rest."
        else:
            severity = "high"
            recommendations = "Your stress levels appear to be high. It's important to address stress through lifestyle changes, relaxation techniques, and consider speaking with a counselor for additional coping strategies."
        
        return total_score, max_score, severity, recommendations