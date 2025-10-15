import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Heart, Brain, Wind, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

const MindfulnessExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      toast.success('Exercise completed! Great job!');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/mindfulness-exercises');
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Fallback data if API fails
      setExercises([
        {
          id: 1,
          title: 'Deep Breathing',
          description: 'Focus on your breath and take slow, deep breaths',
          duration: 5,
          instructions: 'Sit comfortably, close your eyes, and breathe in for 4 counts, hold for 4 counts, and breathe out for 6 counts. Repeat for 5 minutes.'
        },
        {
          id: 2,
          title: 'Body Scan',
          description: 'Progressive relaxation technique focusing on different body parts',
          duration: 10,
          instructions: 'Lie down comfortably and slowly focus on each part of your body from head to toe, releasing tension as you go.'
        },
        {
          id: 3,
          title: 'Mindful Walking',
          description: 'Walking meditation to ground yourself in the present moment',
          duration: 15,
          instructions: 'Walk slowly and deliberately, focusing on each step and the sensations in your feet and legs.'
        },
        {
          id: 4,
          title: 'Gratitude Practice',
          description: 'Reflect on things you\'re grateful for',
          duration: 5,
          instructions: 'Think of three things you\'re grateful for today and why they matter to you.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration * 60); // Convert minutes to seconds
    setCurrentStep(0);
    setIsActive(true);
  };

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeLeft(selectedExercise.duration * 60);
    setCurrentStep(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'deep breathing':
        return <Wind className="text-blue-500" size={24} />;
      case 'body scan':
        return <Heart className="text-red-500" size={24} />;
      case 'mindful walking':
        return <Sun className="text-yellow-500" size={24} />;
      case 'gratitude practice':
        return <Brain className="text-purple-500" size={24} />;
      default:
        return <Heart className="text-green-500" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (selectedExercise) {
    return (
      <div className="mindfulness-exercises-page">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mindfulness Exercise</h1>
          <p className="text-white/90">Take a moment for yourself</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="mb-6">
              {getExerciseIcon(selectedExercise.title)}
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{selectedExercise.title}</h2>
            <p className="text-gray-600 mb-6">{selectedExercise.description}</p>

            <div className="mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((selectedExercise.duration * 60 - timeLeft) / (selectedExercise.duration * 60)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <p className="text-gray-700 leading-relaxed">
                  {selectedExercise.instructions}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={toggleExercise}
                className="btn btn-primary"
              >
                {isActive ? (
                  <>
                    <Pause className="mr-2" size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2" size={20} />
                    {timeLeft === selectedExercise.duration * 60 ? 'Start' : 'Resume'}
                  </>
                )}
              </button>
              
              <button
                onClick={resetExercise}
                className="btn btn-secondary"
              >
                <RotateCcw className="mr-2" size={20} />
                Reset
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to exercises
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mindfulness-exercises-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="gradient-text">Mindfulness Exercises</span>
          </h1>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Practice meditation and mindfulness techniques designed to enhance your well-being and bring peace to your daily life.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="card">
              <div className="text-center mb-4">
                {getExerciseIcon(exercise.title)}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
              <p className="text-gray-600 mb-4">{exercise.description}</p>
              
              <div className="flex items-center justify-center mb-4 text-sm text-gray-500">
                <Clock className="mr-1" size={16} />
                <span>{exercise.duration} minutes</span>
              </div>
              
              <button
                onClick={() => startExercise(exercise)}
                className="btn btn-primary w-full"
              >
                <Play className="mr-2" size={16} />
                Start Exercise
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MindfulnessExercises;