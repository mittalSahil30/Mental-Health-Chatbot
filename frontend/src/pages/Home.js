import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiBook, FiActivity, FiHeart, FiPhone, FiShield, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const HeroSection = styled.section`
  max-width: 800px;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: white;
    color: #667eea;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  width: 100%;
`;

const FeaturesTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const PrivacyNote = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  margin-top: 2rem;
`;

const PrivacyTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PrivacyText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiMessageCircle />,
      title: "AI Chatbot",
      description: "Get instant emotional support and mental health guidance from our AI-powered chatbot."
    },
    {
      icon: <FiBook />,
      title: "Personal Journal",
      description: "Keep track of your thoughts, moods, and daily experiences in your private journal."
    },
    {
      icon: <FiActivity />,
      title: "Health Assessment",
      description: "Take comprehensive mental health tests to understand your current state of mind."
    },
    {
      icon: <FiHeart />,
      title: "Mindfulness Exercises",
      description: "Practice guided meditation, breathing exercises, and mindfulness techniques."
    },
    {
      icon: <FiPhone />,
      title: "SOS Contacts",
      description: "Access emergency mental health contacts and crisis support resources."
    },
    {
      icon: <FiShield />,
      title: "Privacy First",
      description: "Your data is encrypted and secure. Use as guest or create an account."
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <Title>Your Mental Health Companion</Title>
        <Subtitle>
          A safe space for emotional support, self-reflection, and mental wellness. 
          Get personalized guidance, track your journey, and find peace of mind.
        </Subtitle>
        
        <CTAButtons>
          <Button to="/chatbot" className="primary">
            <FiMessageCircle />
            Start Chatting
          </Button>
          {!user && (
            <Button to="/register" className="secondary">
              <FiUsers />
              Create Account
            </Button>
          )}
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <FeaturesTitle>Everything You Need for Mental Wellness</FeaturesTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <PrivacyNote>
          <PrivacyTitle>
            <FiShield />
            Privacy & Security
          </PrivacyTitle>
          <PrivacyText>
            We prioritize your privacy and mental health. You can use our chatbot as a guest 
            without creating an account. For additional features like journaling and health tests, 
            we offer secure account creation with encrypted data storage.
          </PrivacyText>
        </PrivacyNote>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;