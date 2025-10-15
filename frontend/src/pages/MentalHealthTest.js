import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MentalHealthTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const scaleOptions = [
    { value: 0, label: 'Not at all', description: 'I never experience this' },
    { value: 1, label: 'Rarely', description: 'I experience this very rarely' },
    { value: 2, label: 'Sometimes', description: 'I experience this occasionally' },
    { value: 3, label: 'Often', description: 'I experience this frequently' },
    { value: 4, label: 'Very often', description: 'I experience this almost always' }
  ];

  useEffect(() => {
    fetchQuestions();
    fetchTestHistory();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/mental-health-test/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get('/mental-health-test/history');
      setTestHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
    }
  };

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion]?.id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    try {
      const response = await axios.post('/mental-health-test/submit', answers);
      setTestResults(response.data);
      setTestCompleted(true);
      fetchTestHistory();
      toast.success('Test completed successfully');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test');
    }
  };

  const startNewTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setTestResults(null);
  };

  const getScoreInterpretation = (score) => {
    if (score <= 2) return { level: 'excellent', color: 'text-accent-success', bg: 'bg-accent-success/10' };
    if (score <= 4) return { level: 'good', color: 'text-accent-success', bg: 'bg-accent-success/10' };
    if (score <= 6) return { level: 'moderate', color: 'text-accent-warning', bg: 'bg-accent-warning/10' };
    if (score <= 8) return { level: 'concerning', color: 'text-accent-danger', bg: 'bg-accent-danger/10' };
    return { level: 'critical', color: 'text-accent-danger', bg: 'bg-accent-danger/10' };
  };

  const getRecommendations = (score) => {
    if (score <= 4) return [
      'Continue practicing mindfulness and self-care',
      'Consider journaling about your experiences',
      'Stay connected with supportive people'
    ];
    if (score <= 6) return [
      'Try daily mindfulness exercises',
      'Consider talking to a trusted friend or family member',
      'Use your journal to track patterns in your mood',
      'Consider reaching out to a mental health professional'
    ];
    if (score <= 8) return [
      'Reach out to a mental health professional as soon as possible',
      'Use your SOS contacts for immediate support',
      'Practice daily self-care and mindfulness',
      'Consider talking to your doctor about your concerns'
    ];
    return [
      'Contact a mental health professional immediately',
      'Use emergency services if you\'re in crisis (911)',
      'Reach out to your SOS contacts right away',
      'Consider going to your nearest emergency room if you\'re having thoughts of self-harm'
    ];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (testCompleted && testResults) {
    const interpretation = getScoreInterpretation(testResults.score);
    const recommendations = getRecommendations(testResults.score);

    return (
      <div className="main-content fade-in">
        <div className="page-header">
          <h1 className="page-title">Test Results</h1>
          <p className="page-subtitle">Your mental health assessment is complete</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="card text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${interpretation.bg} mb-4`}>
              <Brain className={`${interpretation.color}`} size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Score: {testResults.score}/10</h2>
            <p className={`text-lg font-semibold ${interpretation.color} mb-4`}>
              {interpretation.level.charAt(0).toUpperCase() + interpretation.level.slice(1)} Mental Health
            </p>
            <p className="text-secondary">
              {testResults.score <= 2 && "Your mental health appears to be in excellent condition. Keep up the great work!"}
              {testResults.score > 2 && testResults.score <= 4 && "Your mental health is in good shape overall. You're managing well!"}
              {testResults.score > 4 && testResults.score <= 6 && "You're experiencing some challenges with your mental health. This is common and manageable with the right support."}
              {testResults.score > 6 && testResults.score <= 8 && "You're going through a difficult time with your mental health. It's important to take this seriously and seek support."}
              {testResults.score > 8 && "Your responses suggest you're experiencing significant mental health challenges. Please seek professional help immediately."}
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-accent-success" size={20} />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent-primary mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <button onClick={startNewTest} className="btn btn-primary">
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">Mental Health Assessment</h1>
        <p className="page-subtitle">
          A comprehensive evaluation of your mental well-being designed to provide insights and support your mental health journey.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="text-sm text-muted">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </div>
            </div>
            <div className="w-full bg-border-color rounded-full h-2">
              <div 
                className="bg-accent-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-6">
              {questions[currentQuestion]?.question}
            </h3>

            <div className="space-y-4">
              {scaleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-6 text-left border-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    answers[questions[currentQuestion]?.id] === option.value
                      ? 'border-accent-primary bg-accent-primary/10 shadow-lg'
                      : 'border-border-color hover:border-border-hover hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        answers[questions[currentQuestion]?.id] === option.value
                          ? 'bg-accent-primary text-white'
                          : 'bg-bg-tertiary text-muted'
                      }`}>
                        {option.value}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{option.label}</div>
                        <div className="text-muted">{option.description}</div>
                      </div>
                    </div>
                    {answers[questions[currentQuestion]?.id] === option.value && (
                      <div className="flex items-center gap-2 text-accent-primary">
                        <CheckCircle size={24} />
                        <span className="font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={answers[questions[currentQuestion]?.id] === undefined}
              className="btn btn-primary"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Test' : 'Next'}
              {currentQuestion < questions.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthTest;