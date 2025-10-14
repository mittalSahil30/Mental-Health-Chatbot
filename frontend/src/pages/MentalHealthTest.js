import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiActivity, FiCheckCircle, FiArrowRight, FiArrowLeft, FiBarChart3 } from 'react-icons/fi';
import axios from 'axios';

const TestContainer = styled.div`
  max-width: 800px;
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

const TestCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const QuestionText = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }

  &.selected {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const RadioInput = styled.input`
  margin-right: 1rem;
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const OptionText = styled.span`
  font-size: 1rem;
  color: #333;
  flex: 1;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const Button = styled.button`
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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e1e5e9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ResultsContainer = styled.div`
  text-align: center;
`;

const ResultsTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const ScoreDisplay = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Interpretation = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: left;
`;

const InterpretationTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

const InterpretationText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TestList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TestItem = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const TestItemTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const TestItemDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const TestItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;
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
  margin-bottom: 2rem;
`;

const MentalHealthTest = () => {
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/test');
      setTests(response.data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = (test) => {
    setCurrentTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    try {
      const responses = Object.keys(answers).map(key => ({
        questionIndex: parseInt(key),
        answer: answers[key]
      }));

      const response = await axios.post(`/test/${currentTest.id}/response`, responses);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const progress = currentTest ? ((currentQuestion + 1) / currentTest.questions.length) * 100 : 0;

  if (loading) {
    return (
      <TestContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          Loading mental health tests...
        </div>
      </TestContainer>
    );
  }

  if (results) {
    return (
      <TestContainer>
        <ResultsContainer>
          <ResultsTitle>Test Results</ResultsTitle>
          
          <ScoreDisplay>
            <ScoreValue>{results.score}</ScoreValue>
            <ScoreLabel>Your Score</ScoreLabel>
          </ScoreDisplay>

          <Interpretation>
            <InterpretationTitle>Interpretation</InterpretationTitle>
            <InterpretationText>{results.interpretation}</InterpretationText>
          </Interpretation>

          <Button className="primary" onClick={resetTest}>
            Take Another Test
          </Button>
        </ResultsContainer>
      </TestContainer>
    );
  }

  if (currentTest) {
    const question = currentTest.questions[currentQuestion];
    const isLastQuestion = currentQuestion === currentTest.questions.length - 1;
    const canProceed = answers[currentQuestion] !== undefined;

    return (
      <TestContainer>
        <TestCard>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>

          <QuestionContainer>
            <QuestionNumber>
              Question {currentQuestion + 1} of {currentTest.questions.length}
            </QuestionNumber>
            <QuestionText>{question.text}</QuestionText>

            <OptionsContainer>
              {question.options.map((option, index) => (
                <Option
                  key={index}
                  className={answers[currentQuestion] === index ? 'selected' : ''}
                >
                  <RadioInput
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswer(currentQuestion, index)}
                  />
                  <OptionText>{option}</OptionText>
                </Option>
              ))}
            </OptionsContainer>
          </QuestionContainer>

          <Navigation>
            <Button
              className="secondary"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <FiArrowLeft />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                className="primary"
                onClick={submitTest}
                disabled={!canProceed}
              >
                <FiCheckCircle />
                Submit Test
              </Button>
            ) : (
              <Button
                className="primary"
                onClick={nextQuestion}
                disabled={!canProceed}
              >
                Next
                <FiArrowRight />
              </Button>
            )}
          </Navigation>
        </TestCard>
      </TestContainer>
    );
  }

  return (
    <TestContainer>
      <Header>
        <Title>Mental Health Assessment</Title>
        <Subtitle>
          Take our comprehensive mental health tests to better understand your current state of mind. 
          These assessments can help identify areas where you might need support.
        </Subtitle>
      </Header>

      {tests.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Tests Available</EmptyTitle>
          <EmptyText>
            Mental health tests will be available soon. Check back later for comprehensive assessments.
          </EmptyText>
        </EmptyState>
      ) : (
        <TestList>
          {tests.map((test) => (
            <TestItem key={test.id} onClick={() => startTest(test)}>
              <TestItemTitle>{test.name}</TestItemTitle>
              <TestItemDescription>{test.description}</TestItemDescription>
              <TestItemMeta>
                <span>{test.questions.length} questions</span>
                <span>5-10 min</span>
              </TestItemMeta>
            </TestItem>
          ))}
        </TestList>
      )}

      {/* Default test if no tests are available */}
      {tests.length === 0 && (
        <TestCard>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>
              Quick Mental Health Check
            </h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              A simple 5-question assessment to help you understand your current mental state.
            </p>
            <Button 
              className="primary" 
              onClick={() => startTest({
                id: 'default',
                name: 'Quick Mental Health Check',
                questions: [
                  {
                    text: "How would you rate your overall mood today?",
                    options: ["Very poor", "Poor", "Fair", "Good", "Excellent"]
                  },
                  {
                    text: "How well did you sleep last night?",
                    options: ["Very poorly", "Poorly", "Fairly well", "Well", "Very well"]
                  },
                  {
                    text: "How would you describe your stress level?",
                    options: ["Very high", "High", "Moderate", "Low", "Very low"]
                  },
                  {
                    text: "How confident do you feel about handling daily challenges?",
                    options: ["Not at all confident", "Slightly confident", "Moderately confident", "Very confident", "Extremely confident"]
                  },
                  {
                    text: "How satisfied are you with your current life situation?",
                    options: ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"]
                  }
                ]
              })}
            >
              <FiActivity />
              Start Quick Check
            </Button>
          </div>
        </TestCard>
      )}
    </TestContainer>
  );
};

export default MentalHealthTest;