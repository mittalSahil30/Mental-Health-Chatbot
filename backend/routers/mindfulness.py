from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import User, MindfulnessExercise, UserExerciseProgress
from schemas import MindfulnessExerciseResponse, ExerciseProgressRequest
from auth_utils import get_current_user

router = APIRouter()

# Sample mindfulness exercises data
SAMPLE_EXERCISES = [
    {
        "title": "4-7-8 Breathing Technique",
        "description": "A simple but powerful breathing exercise to reduce anxiety and promote relaxation.",
        "category": "breathing",
        "duration_minutes": 5,
        "difficulty_level": "beginner",
        "instructions": """1. Sit comfortably with your back straight
2. Place the tip of your tongue against the ridge behind your upper teeth
3. Exhale completely through your mouth
4. Close your mouth and inhale through your nose for 4 counts
5. Hold your breath for 7 counts
6. Exhale through your mouth for 8 counts
7. Repeat this cycle 3-4 times

This exercise helps activate your parasympathetic nervous system, promoting relaxation and reducing stress."""
    },
    {
        "title": "Body Scan Meditation",
        "description": "A mindfulness practice that involves systematically focusing on different parts of your body.",
        "category": "meditation",
        "duration_minutes": 15,
        "difficulty_level": "beginner",
        "instructions": """1. Lie down comfortably on your back
2. Close your eyes and take a few deep breaths
3. Start at the top of your head and slowly move your attention down
4. Notice any sensations, tension, or relaxation in each body part
5. Don't try to change anything, just observe
6. Move through: head, face, neck, shoulders, arms, chest, abdomen, back, hips, legs, feet
7. Take a moment to feel your whole body
8. Slowly wiggle your fingers and toes before opening your eyes

This practice helps develop body awareness and can reduce physical tension."""
    },
    {
        "title": "5-4-3-2-1 Grounding Technique",
        "description": "A quick grounding exercise to help with anxiety and bring you back to the present moment.",
        "category": "grounding",
        "duration_minutes": 3,
        "difficulty_level": "beginner",
        "instructions": """When feeling anxious or overwhelmed, use your senses to ground yourself:

5 - Notice FIVE things you can see around you
4 - Notice FOUR things you can touch (texture, temperature)
3 - Notice THREE things you can hear
2 - Notice TWO things you can smell
1 - Notice ONE thing you can taste

Take your time with each step. This exercise helps redirect your focus from anxious thoughts to your immediate environment."""
    },
    {
        "title": "Loving-Kindness Meditation",
        "description": "A meditation practice that cultivates compassion and positive feelings toward yourself and others.",
        "category": "meditation",
        "duration_minutes": 10,
        "difficulty_level": "intermediate",
        "instructions": """1. Sit comfortably and close your eyes
2. Begin by directing loving-kindness toward yourself:
   - "May I be happy"
   - "May I be healthy"
   - "May I be at peace"
   - "May I be free from suffering"

3. Think of someone you love and repeat:
   - "May you be happy"
   - "May you be healthy"
   - "May you be at peace"
   - "May you be free from suffering"

4. Think of a neutral person and repeat the phrases
5. Think of someone difficult and repeat the phrases
6. Extend to all beings everywhere

This practice helps develop compassion and can improve your relationship with yourself and others."""
    },
    {
        "title": "Progressive Muscle Relaxation",
        "description": "A technique that involves tensing and relaxing different muscle groups to reduce physical tension.",
        "category": "relaxation",
        "duration_minutes": 20,
        "difficulty_level": "beginner",
        "instructions": """1. Lie down or sit comfortably
2. Start with your toes - tense them for 5 seconds, then relax
3. Move up through each muscle group:
   - Feet and calves
   - Thighs and glutes
   - Abdomen
   - Hands and arms
   - Shoulders
   - Face and scalp

4. For each group:
   - Tense the muscles for 5 seconds
   - Notice the tension
   - Release and relax for 10-15 seconds
   - Notice the contrast between tension and relaxation

5. End by taking deep breaths and enjoying the relaxed state

This technique helps you recognize and release physical tension you may not realize you're holding."""
    },
    {
        "title": "Mindful Walking",
        "description": "A walking meditation that combines gentle movement with mindfulness practice.",
        "category": "movement",
        "duration_minutes": 10,
        "difficulty_level": "beginner",
        "instructions": """1. Find a quiet path 10-20 steps long (indoors or outdoors)
2. Begin walking very slowly
3. Focus on the physical sensations of walking:
   - Lifting your foot
   - Moving it forward
   - Placing it down
   - Shifting your weight

4. When you reach the end of your path, pause and turn around mindfully
5. Continue walking back and forth
6. If your mind wanders, gently bring attention back to your steps
7. You can coordinate with breathing: breathe in for 2-3 steps, out for 2-3 steps

This practice combines the benefits of gentle exercise with mindfulness meditation."""
    },
    {
        "title": "Box Breathing",
        "description": "A structured breathing technique used by Navy SEALs and athletes to maintain calm focus.",
        "category": "breathing",
        "duration_minutes": 5,
        "difficulty_level": "intermediate",
        "instructions": """1. Sit with your back straight and feet flat on the floor
2. Exhale completely
3. Follow this pattern:
   - Inhale through your nose for 4 counts
   - Hold your breath for 4 counts
   - Exhale through your mouth for 4 counts
   - Hold empty for 4 counts

4. Visualize drawing a box as you breathe:
   - Up side: inhale
   - Top side: hold
   - Down side: exhale
   - Bottom side: hold

5. Repeat for 4-8 cycles
6. Return to normal breathing

This technique helps regulate your nervous system and improve focus under pressure."""
    },
    {
        "title": "Mindful Eating Exercise",
        "description": "Practice mindfulness while eating to improve your relationship with food and enhance awareness.",
        "category": "mindfulness",
        "duration_minutes": 15,
        "difficulty_level": "beginner",
        "instructions": """Choose a small piece of food (raisin, piece of chocolate, or fruit):

1. LOOK: Examine the food as if you've never seen it before
2. TOUCH: Feel its texture, weight, temperature
3. SMELL: Notice any aromas
4. LISTEN: Is there any sound when you handle it?
5. TASTE: Place it in your mouth but don't chew yet - notice initial flavors
6. CHEW: Chew slowly, noticing how the taste and texture change
7. SWALLOW: Follow the sensation of swallowing

Notice any thoughts, emotions, or judgments that arise. This practice can help with mindful eating habits and appreciation."""
    }
]

@router.on_event("startup")
async def populate_exercises():
    """Populate the database with sample exercises on startup."""
    # This would typically be done through a migration or admin interface
    pass

@router.get("/exercises", response_model=List[MindfulnessExerciseResponse])
async def get_exercises(
    db: Session = Depends(get_db),
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    max_duration: Optional[int] = None
):
    """Get all mindfulness exercises with optional filtering."""
    
    # Check if we have exercises in the database
    db_exercises = db.query(MindfulnessExercise).all()
    
    # If no exercises in database, create them from sample data
    if not db_exercises:
        for exercise_data in SAMPLE_EXERCISES:
            exercise = MindfulnessExercise(**exercise_data)
            db.add(exercise)
        db.commit()
        db_exercises = db.query(MindfulnessExercise).all()
    
    # Apply filters
    exercises = db_exercises
    if category:
        exercises = [e for e in exercises if e.category.lower() == category.lower()]
    if difficulty:
        exercises = [e for e in exercises if e.difficulty_level.lower() == difficulty.lower()]
    if max_duration:
        exercises = [e for e in exercises if e.duration_minutes and e.duration_minutes <= max_duration]
    
    return [MindfulnessExerciseResponse.from_orm(exercise) for exercise in exercises]

@router.get("/exercises/{exercise_id}", response_model=MindfulnessExerciseResponse)
async def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    """Get a specific mindfulness exercise."""
    exercise = db.query(MindfulnessExercise).filter(
        MindfulnessExercise.id == exercise_id
    ).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    return MindfulnessExerciseResponse.from_orm(exercise)

@router.post("/exercises/{exercise_id}/complete")
async def complete_exercise(
    exercise_id: int,
    progress_data: ExerciseProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark an exercise as completed and optionally provide feedback."""
    
    # Verify exercise exists
    exercise = db.query(MindfulnessExercise).filter(
        MindfulnessExercise.id == exercise_id
    ).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )
    
    # Create progress record
    progress = UserExerciseProgress(
        user_id=current_user.id,
        exercise_id=exercise_id,
        rating=progress_data.rating,
        notes=progress_data.notes
    )
    
    db.add(progress)
    db.commit()
    db.refresh(progress)
    
    return {
        "message": "Exercise completed successfully",
        "progress_id": progress.id,
        "exercise_title": exercise.title
    }

@router.get("/progress")
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's mindfulness exercise progress and statistics."""
    
    # Get all user progress
    progress_records = db.query(UserExerciseProgress).filter(
        UserExerciseProgress.user_id == current_user.id
    ).order_by(UserExerciseProgress.completed_at.desc()).all()
    
    if not progress_records:
        return {
            "total_completed": 0,
            "categories_practiced": [],
            "average_rating": None,
            "recent_sessions": [],
            "recommendations": "Start your mindfulness journey by trying a beginner breathing exercise!"
        }
    
    # Calculate statistics
    total_completed = len(progress_records)
    
    # Get exercise details for analysis
    exercise_ids = [p.exercise_id for p in progress_records]
    exercises = db.query(MindfulnessExercise).filter(
        MindfulnessExercise.id.in_(exercise_ids)
    ).all()
    exercise_dict = {e.id: e for e in exercises}
    
    # Categories practiced
    categories = set()
    ratings = []
    
    for progress in progress_records:
        if progress.exercise_id in exercise_dict:
            categories.add(exercise_dict[progress.exercise_id].category)
        if progress.rating:
            ratings.append(progress.rating)
    
    average_rating = sum(ratings) / len(ratings) if ratings else None
    
    # Recent sessions (last 5)
    recent_sessions = []
    for progress in progress_records[:5]:
        if progress.exercise_id in exercise_dict:
            exercise = exercise_dict[progress.exercise_id]
            recent_sessions.append({
                "exercise_title": exercise.title,
                "category": exercise.category,
                "completed_at": progress.completed_at,
                "rating": progress.rating,
                "notes": progress.notes
            })
    
    # Generate recommendations
    recommendations = []
    if total_completed < 5:
        recommendations.append("Try to practice mindfulness regularly - even 5 minutes daily can make a difference!")
    
    if len(categories) == 1:
        all_categories = ["breathing", "meditation", "relaxation", "grounding", "movement", "mindfulness"]
        unexplored = [cat for cat in all_categories if cat not in categories]
        if unexplored:
            recommendations.append(f"Consider exploring {unexplored[0]} exercises to diversify your practice.")
    
    if average_rating and average_rating >= 4:
        recommendations.append("You're doing great! Consider trying intermediate or advanced exercises.")
    elif average_rating and average_rating < 3:
        recommendations.append("If exercises feel challenging, try shorter sessions or beginner-level practices.")
    
    if not recommendations:
        recommendations.append("Keep up the excellent work with your mindfulness practice!")
    
    return {
        "total_completed": total_completed,
        "categories_practiced": list(categories),
        "average_rating": round(average_rating, 1) if average_rating else None,
        "recent_sessions": recent_sessions,
        "recommendations": " ".join(recommendations)
    }

@router.get("/categories")
async def get_categories():
    """Get available exercise categories."""
    return {
        "categories": [
            {
                "name": "breathing",
                "display_name": "Breathing Exercises",
                "description": "Focused breathing techniques to calm the mind and body"
            },
            {
                "name": "meditation",
                "display_name": "Meditation",
                "description": "Mindfulness and meditation practices for mental clarity"
            },
            {
                "name": "relaxation",
                "display_name": "Relaxation",
                "description": "Techniques to release physical and mental tension"
            },
            {
                "name": "grounding",
                "display_name": "Grounding",
                "description": "Exercises to help you feel present and centered"
            },
            {
                "name": "movement",
                "display_name": "Mindful Movement",
                "description": "Gentle movement combined with mindfulness"
            },
            {
                "name": "mindfulness",
                "display_name": "Daily Mindfulness",
                "description": "Practices to bring mindfulness into everyday activities"
            }
        ]
    }