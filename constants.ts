
import type { TestQuestion, MindfulnessExercise } from './types';

export const MENTAL_HEALTH_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    text: "Over the last 2 weeks, how often have you been bothered by having little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 4,
    text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 5,
    text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 6,
    text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
];

export const MINDFULNESS_EXERCISES: MindfulnessExercise[] = [
    {
        id: 'breathing',
        title: '5-Minute Mindful Breathing',
        description: 'A simple exercise to calm your mind and reduce stress by focusing on your breath.',
        duration: '5 minutes',
        steps: [
            'Find a quiet, comfortable place to sit or lie down.',
            'Close your eyes gently or lower your gaze.',
            'Bring your attention to your breath. Notice the sensation of air entering your nostrils and filling your lungs.',
            'Observe the rise and fall of your chest and abdomen with each breath.',
            'Don\'t try to change your breathing. Just observe it.',
            'If your mind wanders, gently guide it back to your breath without judgment.',
            'Continue for 5 minutes. When you are ready, slowly open your eyes.'
        ]
    },
    {
        id: 'body-scan',
        title: 'Body Scan Meditation',
        description: 'This exercise helps you connect with your body and release physical tension.',
        duration: '10 minutes',
        steps: [
            'Lie down comfortably on your back.',
            'Bring your awareness to your toes on your left foot. Notice any sensations without judgment.',
            'Slowly move your focus up your left leg, to your calf, knee, and thigh, observing sensations.',
            'Repeat the process for your right leg.',
            'Continue scanning upwards through your torso, your arms, hands, neck, and finally your face and head.',
            'Acknowledge any tension you find and imagine it melting away with each exhale.',
            'After scanning your entire body, rest in awareness for a few moments before slowly returning.'
        ]
    },
    {
        id: 'gratitude',
        title: 'Gratitude Reflection',
        description: 'Cultivate a positive mindset by focusing on things you are thankful for.',
        duration: '5-10 minutes',
        steps: [
            'Sit in a comfortable position and take a few deep breaths.',
            'Think of three things you are grateful for today. They can be big or small.',
            'For each item, visualize it clearly in your mind. Why are you grateful for it?',
            'Notice the positive feelings that arise as you reflect on each item.',

            'Consider writing these down in your journal to reinforce the feeling.',
            'End the exercise by taking a moment to appreciate yourself.'
        ]
    }
];
