from flask import Blueprint, jsonify

mindfulness_bp = Blueprint('mindfulness', __name__)

# Mindfulness exercises database
EXERCISES = [
    {
        'id': 1,
        'title': 'Deep Breathing Exercise',
        'category': 'breathing',
        'duration': 5,
        'difficulty': 'beginner',
        'description': 'A simple deep breathing technique to calm your mind and reduce stress.',
        'instructions': [
            'Find a comfortable seated position',
            'Close your eyes or soften your gaze',
            'Breathe in slowly through your nose for 4 counts',
            'Hold your breath for 4 counts',
            'Exhale slowly through your mouth for 6 counts',
            'Repeat for 5 minutes'
        ],
        'benefits': ['Reduces stress', 'Lowers blood pressure', 'Improves focus']
    },
    {
        'id': 2,
        'title': 'Body Scan Meditation',
        'category': 'meditation',
        'duration': 15,
        'difficulty': 'intermediate',
        'description': 'Progressive relaxation technique that helps you tune into your body.',
        'instructions': [
            'Lie down in a comfortable position',
            'Close your eyes and take a few deep breaths',
            'Starting from your toes, focus on each body part',
            'Notice any tension or discomfort without judgment',
            'Breathe into areas of tension and imagine them relaxing',
            'Slowly move up through your legs, torso, arms, and head',
            'Take a moment to feel your whole body relaxed'
        ],
        'benefits': ['Reduces physical tension', 'Improves body awareness', 'Promotes relaxation']
    },
    {
        'id': 3,
        'title': '5-4-3-2-1 Grounding Technique',
        'category': 'grounding',
        'duration': 3,
        'difficulty': 'beginner',
        'description': 'A quick grounding exercise to bring you back to the present moment.',
        'instructions': [
            'Acknowledge 5 things you can see around you',
            'Acknowledge 4 things you can touch',
            'Acknowledge 3 things you can hear',
            'Acknowledge 2 things you can smell',
            'Acknowledge 1 thing you can taste',
            'Take a deep breath and notice how you feel'
        ],
        'benefits': ['Reduces anxiety', 'Grounds you in the present', 'Quick and effective']
    },
    {
        'id': 4,
        'title': 'Loving-Kindness Meditation',
        'category': 'meditation',
        'duration': 10,
        'difficulty': 'intermediate',
        'description': 'Cultivate compassion for yourself and others.',
        'instructions': [
            'Sit comfortably and close your eyes',
            'Take a few deep breaths to settle in',
            'Repeat silently: "May I be happy, may I be healthy, may I be safe, may I live with ease"',
            'Think of someone you love and repeat for them',
            'Think of a neutral person and repeat',
            'Think of someone you have difficulty with and repeat',
            'Extend the wishes to all beings everywhere'
        ],
        'benefits': ['Increases compassion', 'Reduces negative emotions', 'Improves relationships']
    },
    {
        'id': 5,
        'title': 'Box Breathing',
        'category': 'breathing',
        'duration': 4,
        'difficulty': 'beginner',
        'description': 'A Navy SEAL technique for stress management and focus.',
        'instructions': [
            'Exhale all the air from your lungs',
            'Breathe in through your nose for 4 counts',
            'Hold your breath for 4 counts',
            'Exhale through your mouth for 4 counts',
            'Hold empty for 4 counts',
            'Repeat for 4 minutes'
        ],
        'benefits': ['Calms nervous system', 'Improves focus', 'Reduces stress hormones']
    },
    {
        'id': 6,
        'title': 'Mindful Walking',
        'category': 'movement',
        'duration': 10,
        'difficulty': 'beginner',
        'description': 'Bring awareness to the simple act of walking.',
        'instructions': [
            'Find a quiet place to walk slowly',
            'Pay attention to the sensation of your feet touching the ground',
            'Notice the movement of your legs and arms',
            'Feel the air on your skin',
            'Observe your surroundings without judgment',
            'If your mind wanders, gently bring it back to walking',
            'Continue for 10 minutes'
        ],
        'benefits': ['Combines exercise and mindfulness', 'Improves balance', 'Reduces rumination']
    },
    {
        'id': 7,
        'title': 'Progressive Muscle Relaxation',
        'category': 'relaxation',
        'duration': 20,
        'difficulty': 'intermediate',
        'description': 'Systematically tense and relax muscle groups.',
        'instructions': [
            'Lie down or sit comfortably',
            'Starting with your feet, tense the muscles for 5 seconds',
            'Release and notice the relaxation for 10 seconds',
            'Move to your calves and repeat',
            'Continue through thighs, abdomen, chest, arms, shoulders, and face',
            'Notice the difference between tension and relaxation',
            'End with a few deep breaths'
        ],
        'benefits': ['Reduces muscle tension', 'Improves sleep', 'Decreases anxiety']
    },
    {
        'id': 8,
        'title': 'Mindful Eating',
        'category': 'mindfulness',
        'duration': 15,
        'difficulty': 'beginner',
        'description': 'Experience eating with full awareness and presence.',
        'instructions': [
            'Choose a small piece of food (like a raisin or piece of chocolate)',
            'Look at it closely, noticing colors and textures',
            'Smell it and notice the aroma',
            'Place it in your mouth without chewing',
            'Notice the taste and texture',
            'Slowly chew, paying attention to the experience',
            'Notice the urge to swallow and then swallow mindfully',
            'Reflect on the entire experience'
        ],
        'benefits': ['Improves relationship with food', 'Enhances enjoyment', 'Promotes mindfulness']
    },
    {
        'id': 9,
        'title': 'Visualization Exercise',
        'category': 'visualization',
        'duration': 10,
        'difficulty': 'intermediate',
        'description': 'Use your imagination to create a peaceful mental sanctuary.',
        'instructions': [
            'Close your eyes and take deep breaths',
            'Imagine a peaceful place (beach, forest, mountain)',
            'Engage all your senses - what do you see, hear, smell, feel?',
            'Notice details - colors, sounds, temperatures',
            'Spend time in this place, feeling safe and calm',
            'When ready, slowly bring your awareness back',
            'Open your eyes feeling refreshed'
        ],
        'benefits': ['Reduces stress', 'Improves mood', 'Creates mental refuge']
    },
    {
        'id': 10,
        'title': 'Gratitude Practice',
        'category': 'mindfulness',
        'duration': 5,
        'difficulty': 'beginner',
        'description': 'Cultivate appreciation and positive emotions.',
        'instructions': [
            'Sit quietly and take a few deep breaths',
            'Think of three things you\'re grateful for today',
            'For each one, really feel the appreciation',
            'Notice how gratitude feels in your body',
            'You can write them down in your journal',
            'End with a moment of appreciation for yourself'
        ],
        'benefits': ['Improves mood', 'Increases positive emotions', 'Better sleep']
    }
]

@mindfulness_bp.route('/exercises', methods=['GET'])
def get_exercises():
    """Get all mindfulness exercises"""
    try:
        return jsonify({
            'exercises': EXERCISES,
            'total': len(EXERCISES)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mindfulness_bp.route('/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    """Get a specific exercise by ID"""
    try:
        exercise = next((ex for ex in EXERCISES if ex['id'] == exercise_id), None)
        
        if not exercise:
            return jsonify({'error': 'Exercise not found'}), 404
        
        return jsonify({'exercise': exercise}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mindfulness_bp.route('/exercises/category/<category>', methods=['GET'])
def get_exercises_by_category(category):
    """Get exercises filtered by category"""
    try:
        filtered_exercises = [ex for ex in EXERCISES if ex['category'] == category]
        
        return jsonify({
            'exercises': filtered_exercises,
            'total': len(filtered_exercises),
            'category': category
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mindfulness_bp.route('/exercises/difficulty/<difficulty>', methods=['GET'])
def get_exercises_by_difficulty(difficulty):
    """Get exercises filtered by difficulty"""
    try:
        filtered_exercises = [ex for ex in EXERCISES if ex['difficulty'] == difficulty]
        
        return jsonify({
            'exercises': filtered_exercises,
            'total': len(filtered_exercises),
            'difficulty': difficulty
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@mindfulness_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        categories = list(set(ex['category'] for ex in EXERCISES))
        
        return jsonify({
            'categories': categories,
            'total': len(categories)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
