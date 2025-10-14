
import React, { useState } from 'react';
import { MINDFULNESS_EXERCISES } from '../constants';
import type { MindfulnessExercise } from '../types';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ExerciseModal: React.FC<{
  exercise: MindfulnessExercise | null;
  onClose: () => void;
}> = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-neutral rounded-lg p-8 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <XMarkIcon className="h-6 w-6"/>
        </button>
        <h2 className="text-3xl font-bold mb-2 text-primary">{exercise.title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{exercise.duration}</p>
        <p className="mb-6">{exercise.description}</p>
        <div className="space-y-4">
          {exercise.steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 bg-secondary text-white rounded-full flex items-center justify-center font-bold mr-3">{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const ExercisesPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<MindfulnessExercise | null>(null);

  return (
    <div className="p-4 bg-white dark:bg-neutral rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-6">Mindfulness Exercises</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MINDFULNESS_EXERCISES.map(exercise => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="p-6 border rounded-lg bg-light dark:bg-dark border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-300"
          >
            <h3 className="font-bold text-xl mb-2 text-primary">{exercise.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{exercise.duration}</p>
            <p className="text-neutral dark:text-light">{exercise.description}</p>
          </div>
        ))}
      </div>
      <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
    </div>
  );
};

export default ExercisesPage;
