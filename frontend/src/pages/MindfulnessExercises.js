import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRotateCcw, FiClock, FiHeart, FiWind, FiActivity } from 'react-icons/fi';
import axios from 'axios';

const ExercisesContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ExerciseCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ExerciseIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ExerciseMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ExerciseDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
`;

const TimerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const TimerContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const TimerDisplay = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 2rem;
  font-family: 'Courier New', monospace;
`;

const ExerciseInstructions = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: left;
`;

const InstructionsTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const InstructionsText = styled.div`
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
`;

const TimerControls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ControlButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
    }
  }

  &.secondary {
    background: #f0f0f0;
    color: #333;

    &:hover {
      background: #e0e0e0;
    }
  }

  &.danger {
    background: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
    }
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#667eea' : 'white'};
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    color: #667eea;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const MindfulnessExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedCategory]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert('Exercise completed! Great job!');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      // Use default exercises if API fails
      setExercises([
        {
          id: 1,
          title: "5-Minute Breathing Exercise",
          description: "A simple breathing exercise to help reduce stress and anxiety",
          instructions: "1. Sit comfortably and close your eyes\n2. Breathe in slowly for 4 counts\n3. Hold your breath for 4 counts\n4. Breathe out slowly for 4 counts\n5. Repeat for 5 minutes",
          duration_minutes: 5,
          category: "breathing",
          difficulty_level: "beginner"
        },
        {
          id: 2,
          title: "Body Scan Meditation",
          description: "A guided meditation to help you relax and become aware of your body",
          instructions: "1. Lie down comfortably\n2. Start from your toes and slowly scan up your body\n3. Notice any tension or discomfort\n4. Breathe into those areas and release tension\n5. Continue until you reach the top of your head",
          duration_minutes: 15,
          category: "meditation",
          difficulty_level: "intermediate"
        },
        {
          id: 3,
          title: "Mindful Walking",
          description: "Practice mindfulness while walking to ground yourself in the present moment",
          instructions: "1. Walk slowly and deliberately\n2. Focus on the sensation of your feet touching the ground\n3. Notice your breathing and body movement\n4. Observe your surroundings without judgment\n5. If your mind wanders, gently bring it back to walking",
          duration_minutes: 10,
          category: "movement",
          difficulty_level: "beginner"
        }
      ]);
    }
  };

  const filterExercises = () => {
    if (selectedCategory === 'all') {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(exercise => exercise.category === selectedCategory));
    }
  };

  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    setTimeLeft(exercise.duration_minutes * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(currentExercise.duration_minutes * 60);
  };

  const closeTimer = () => {
    setCurrentExercise(null);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'breathing':
        return <FiWind />;
      case 'meditation':
        return <FiHeart />;
      case 'movement':
        return <FiActivity />;
      default:
        return <FiHeart />;
    }
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'breathing', label: 'Breathing' },
    { key: 'meditation', label: 'Meditation' },
    { key: 'movement', label: 'Movement' }
  ];

  return (
    <ExercisesContainer>
      <Header>
        <Title>Mindfulness Exercises</Title>
        <Subtitle>
          Practice mindfulness and meditation to improve your mental well-being. 
          Choose from various exercises designed to help you relax, focus, and find inner peace.
        </Subtitle>
      </Header>

      <CategoryFilter>
        {categories.map(category => (
          <FilterButton
            key={category.key}
            active={selectedCategory === category.key}
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </FilterButton>
        ))}
      </CategoryFilter>

      {filteredExercises.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Exercises Available</EmptyTitle>
          <EmptyText>
            Mindfulness exercises will be available soon. Check back later for guided practices.
          </EmptyText>
        </EmptyState>
      ) : (
        <ExercisesGrid>
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} onClick={() => startExercise(exercise)}>
              <ExerciseHeader>
                <ExerciseIcon>
                  {getCategoryIcon(exercise.category)}
                </ExerciseIcon>
                <div>
                  <ExerciseTitle>{exercise.title}</ExerciseTitle>
                  <ExerciseMeta>
                    <MetaItem>
                      <FiClock />
                      {exercise.duration_minutes} min
                    </MetaItem>
                    <MetaItem>
                      <FiActivity />
                      {exercise.difficulty_level}
                    </MetaItem>
                  </ExerciseMeta>
                </div>
              </ExerciseHeader>
              
              <ExerciseDescription>{exercise.description}</ExerciseDescription>
              
              <StartButton>
                <FiPlay />
                Start Exercise
              </StartButton>
            </ExerciseCard>
          ))}
        </ExercisesGrid>
      )}

      {currentExercise && (
        <TimerModal onClick={closeTimer}>
          <TimerContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1rem', color: '#333' }}>
              {currentExercise.title}
            </h2>
            
            <TimerDisplay>
              {formatTime(timeLeft)}
            </TimerDisplay>

            <ExerciseInstructions>
              <InstructionsTitle>Instructions</InstructionsTitle>
              <InstructionsText>{currentExercise.instructions}</InstructionsText>
            </ExerciseInstructions>

            <TimerControls>
              {!isRunning && !isPaused && (
                <ControlButton className="primary" onClick={startTimer}>
                  <FiPlay />
                  Start
                </ControlButton>
              )}
              
              {isRunning && (
                <ControlButton className="secondary" onClick={pauseTimer}>
                  <FiPause />
                  Pause
                </ControlButton>
              )}
              
              {isPaused && (
                <ControlButton className="primary" onClick={startTimer}>
                  <FiPlay />
                  Resume
                </ControlButton>
              )}
              
              <ControlButton className="secondary" onClick={resetTimer}>
                <FiRotateCcw />
                Reset
              </ControlButton>
              
              <ControlButton className="danger" onClick={closeTimer}>
                Close
              </ControlButton>
            </TimerControls>
          </TimerContent>
        </TimerModal>
      )}
    </ExercisesContainer>
  );
};

export default MindfulnessExercises;