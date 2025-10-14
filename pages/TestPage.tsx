
import React, { useState } from 'react';
import { MENTAL_HEALTH_QUESTIONS } from '../constants';
import { useTest } from '../contexts/TestContext';
import type { TestResult } from '../types';

const TestPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);
  const { addResult, getLatestResult } = useTest();
  const latestResult = getLatestResult();

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < MENTAL_HEALTH_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: number[]) => {
    const score = finalAnswers.reduce((total, answer) => total + answer, 0);
    let interpretation = '';
    
    // This is a simplified, non-clinical interpretation
    if (score <= 4) {
      interpretation = "Your responses suggest you're likely experiencing minimal to no signs of distress. Keep up the great self-care!";
    } else if (score <= 9) {
      interpretation = "It appears you might be going through a period of mild distress. It could be helpful to focus on mindfulness and self-care activities.";
    } else if (score <= 14) {
      interpretation = "Your responses indicate you may be experiencing a moderate level of distress. Consider talking to a friend, family member, or our AI chatbot about how you're feeling.";
    } else {
      interpretation = "It seems you might be facing significant distress. We strongly encourage you to connect with a mental health professional for support. Our SOS page has resources that can help.";
    }

    const newResult: TestResult = {
      score,
      interpretation,
      date: new Date().toISOString(),
    };
    setResult(newResult);
    addResult(newResult);
  };
  
  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full">
      <h1 className="text-2xl font-bold mb-4">Wellness Check-in</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        This is not a diagnostic tool. It's a way to reflect on your feelings. If you are in crisis, please visit our SOS page.
      </p>

      {!result && (
        <div className="max-w-xl mx-auto">
          <div className="mb-4">
            <p className="text-lg font-semibold">{MENTAL_HEALTH_QUESTIONS[currentQuestion].text}</p>
          </div>
          <div className="space-y-3">
            {MENTAL_HEALTH_QUESTIONS[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-primary/10 hover:border-primary transition"
              >
                {option}
              </button>
            ))}
          </div>
           <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-8">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / MENTAL_HEALTH_QUESTIONS.length) * 100}%` }}></div>
            </div>
        </div>
      )}

      {result && (
        <div className="text-center p-8 bg-light dark:bg-dark rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Check-in Result</h2>
          <p className="text-5xl font-extrabold text-primary mb-4">{result.score}</p>
          <p className="text-lg text-neutral dark:text-light mb-6">{result.interpretation}</p>
          <button onClick={resetTest} className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">
            Take Again
          </button>
        </div>
      )}

      {latestResult && !result && (
          <div className="mt-10 p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Your Previous Result</h3>
              <p className="text-gray-500 dark:text-gray-400">
                  Taken on: {new Date(latestResult.date).toLocaleDateString()}
              </p>
              <p className="mt-2">{latestResult.interpretation}</p>
          </div>
      )}
    </div>
  );
};

export default TestPage;
