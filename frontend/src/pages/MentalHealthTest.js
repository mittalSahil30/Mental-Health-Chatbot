import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MentalHealthTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const scaleOptions = [
    { value: 0, label: 'Not at all', description: 'Never or rarely' },
    { value: 1, label: 'Several days', description: 'Less than half the days' },
    { value: 2, label: 'More than half the days', description: 'More than half the days' },
    { value: 3, label: 'Nearly every day', description: 'Almost every day' }
  ];

  useEffect(() => {
    fetchTestHistory();
    // In a real app, you'd fetch questions from the backend
    setQuestions(getMentalHealthQuestions());
    setLoading(false);
  }, []);

  const getMentalHealthQuestions = () => {
    return [
      {
        id: 'mood_low',
        question: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
        category: 'depression'
      },
      {
        id: 'sleep_problems',
        question: 'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
        category: 'depression'
      },
      {
        id: 'energy_low',
        question: 'Over the last 2 weeks, how often have you felt tired or had little energy?',
        category: 'depression'
      },
      {
        id: 'appetite_changes',
        question: 'Over the last 2 weeks, how often have you had poor appetite or overeating?',
        category: 'depression'
      },
      {
        id: 'concentration_difficulty',
        question: 'Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?',
        category: 'depression'
      },
      {
        id: 'self_worth_low',
        question: 'Over the last 2 weeks, how often have you felt bad about yourself or that you are a failure or have let yourself or your family down?',
        category: 'depression'
      },
      {
        id: 'interest_loss',
        question: 'Over the last 2 weeks, how often have you had little interest or pleasure in doing things?',
        category: 'depression'
      },
      {
        id: 'hopelessness',
        question: 'Over the last 2 weeks, how often have you felt that things would never get better?',
        category: 'depression'
      },
      {
        id: 'worry_excessive',
        question: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
        category: 'anxiety'
      },
      {
        id: 'restlessness',
        question: 'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
        category: 'anxiety'
      },
      {
        id: 'fatigue',
        question: 'Over the last 2 weeks, how often have you been bothered by feeling restless or keyed up or on edge?',
        category: 'anxiety'
      },
      {
        id: 'irritability',
        question: 'Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?',
        category: 'anxiety'
      },
      {
        id: 'muscle_tension',
        question: 'Over the last 2 weeks, how often have you been bothered by muscle tension, aches, or soreness?',
        category: 'anxiety'
      },
      {
        id: 'sleep_disturbance',
        question: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep?',
        category: 'anxiety'
      },
      {
        id: 'concentration_anxiety',
        question: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?',
        category: 'anxiety'
      },
      {
        id: 'stress_level',
        question: 'How would you rate your overall stress level over the past week?',
        category: 'general'
      },
      {
        id: 'social_support',
        question: 'How satisfied are you with your current social support system?',
        category: 'general'
      },
      {
        id: 'coping_ability',
        question: 'How well do you feel you are coping with daily challenges?',
        category: 'general'
      },
      {
        id: 'life_satisfaction',
        question: 'How satisfied are you with your life overall right now?',
        category: 'general'
      },
      {
        id: 'physical_health',
        question: 'How would you rate your physical health over the past week?',
        category: 'general'
      }
    ];
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get('/mental-health-test');
      setTestHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
    }
  };

  const handleAnswer = (value) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({ ...answers, [questionId]: value });
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
      const response = await axios.post('/mental-health-test', {
        responses: answers
      });
      
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
    if (score <= 2) return { level: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score <= 4) return { level: 'good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score <= 6) return { level: 'moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score <= 8) return { level: 'concerning', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'urgent', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getRecommendations = (score) => {
    if (score <= 2) return [
      'Continue your current self-care routine',
      'Consider helping others who might be struggling',
      'Maintain your healthy habits'
    ];
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
      <div className="flex justify-center items-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (testCompleted && testResults) {
    const interpretation = getScoreInterpretation(testResults.score);
    const recommendations = getRecommendations(testResults.score);

    return (
      <div className="mental-health-test-page">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Test Results</h1>
          <p className="text-white/90">Your mental health assessment is complete</p>
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
            <p className="text-gray-600">
              {testResults.score <= 2 && "Your mental health appears to be in excellent condition. Keep up the great work!"}
              {testResults.score > 2 && testResults.score <= 4 && "Your mental health is in good shape overall. You're managing well!"}
              {testResults.score > 4 && testResults.score <= 6 && "You're experiencing some challenges with your mental health. This is common and manageable with the right support."}
              {testResults.score > 6 && testResults.score <= 8 && "You're going through a difficult time with your mental health. It's important to take this seriously and seek support."}
              {testResults.score > 8 && "Your responses suggest you're experiencing significant mental health challenges. Please seek professional help immediately."}
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={20} />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-500" size={20} />
              Your Progress
            </h3>
            {testHistory.length > 1 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={testHistory.map((test, index) => ({
                    test: `Test ${testHistory.length - index}`,
                    score: test.score,
                    date: new Date(test.created_at).toLocaleDateString()
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-600">Take more tests to see your progress over time.</p>
            )}
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
    <div className="mental-health-test-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="gradient-text">Mental Health Assessment</span>
          </h1>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
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
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        answers[questions[currentQuestion]?.id] === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {option.value}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{option.label}</div>
                        <div className="text-gray-600">{option.description}</div>
                      </div>
                    </div>
                    {answers[questions[currentQuestion]?.id] === option.value && (
                      <div className="flex items-center gap-2 text-blue-500">
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
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={answers[questions[currentQuestion]?.id] === undefined}
              className="btn btn-primary"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Test' : 'Next'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentalHealthTest;