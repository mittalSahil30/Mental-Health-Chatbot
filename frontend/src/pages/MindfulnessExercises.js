import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Heart, Brain, Sun } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MindfulnessExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
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
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (selectedExercise) {
        toast.success('Exercise completed! Great job!');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedExercise]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/mindfulness/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration * 60);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedExercise ? selectedExercise.duration * 60 : 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'breathing exercise':
        return <Heart className="text-accent-danger" size={24} />;
      case 'body scan':
        return <Heart className="text-accent-danger" size={24} />;
      case 'mindful walking':
        return <Sun className="text-accent-warning" size={24} />;
      case 'gratitude practice':
        return <Brain className="text-accent-primary" size={24} />;
      default:
        return <Heart className="text-accent-success" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (selectedExercise) {
    return (
      <div className="main-content fade-in">
        <div className="page-header">
          <h1 className="page-title">Mindfulness Exercise</h1>
          <p className="page-subtitle">Take a moment for yourself</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="mb-6">
              {getExerciseIcon(selectedExercise.title)}
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{selectedExercise.title}</h2>
            <p className="text-secondary mb-6">{selectedExercise.description}</p>

            <div className="mb-8">
              <div className="text-4xl font-bold text-accent-primary mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="w-full bg-border-color rounded-full h-2">
                <div 
                  className="bg-accent-primary h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((selectedExercise.duration * 60 - timeLeft) / (selectedExercise.duration * 60)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={toggleTimer}
                className="btn btn-primary"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="btn btn-secondary"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>

            <button
              onClick={() => setSelectedExercise(null)}
              className="btn btn-secondary mt-6"
            >
              Back to Exercises
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">Mindfulness Exercises</h1>
        <p className="page-subtitle">
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
              <p className="text-secondary mb-4">{exercise.description}</p>
              
              <div className="flex items-center justify-center mb-4 text-sm text-muted">
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