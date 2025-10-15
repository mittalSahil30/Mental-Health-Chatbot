import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  BookOpen, 
  Brain, 
  Heart, 
  Phone, 
  User,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Chatbot',
      description: 'Talk to our AI assistant for mental health support and guidance.',
      icon: <MessageCircle size={32} />,
      link: '/chatbot',
      available: true
    },
    {
      title: 'Personal Journal',
      description: 'Record your thoughts and feelings in a private journal.',
      icon: <BookOpen size={32} />,
      link: '/journal',
      available: !user?.is_guest
    },
    {
      title: 'Health Assessment',
      description: 'Take a comprehensive mental health assessment.',
      icon: <Brain size={32} />,
      link: '/mental-health-test',
      available: !user?.is_guest
    },
    {
      title: 'Mindfulness',
      description: 'Practice meditation and mindfulness exercises.',
      icon: <Heart size={32} />,
      link: '/mindfulness',
      available: !user?.is_guest
    },
    {
      title: 'SOS Contacts',
      description: 'Access emergency contacts and support resources.',
      icon: <Phone size={32} />,
      link: '/sos-contacts',
      available: !user?.is_guest
    },
    {
      title: 'Profile',
      description: 'Manage your account and personal information.',
      icon: <User size={32} />,
      link: '/profile',
      available: !user?.is_guest
    }
  ];

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.username}!
        </h1>
        <p className="page-subtitle">
          Your mental health journey continues here. Choose a feature to get started.
        </p>
        {user?.is_guest && (
          <div className="card max-w-2xl mx-auto mt-6 border-accent-warning">
            <div className="flex items-center gap-3">
              <Shield className="text-accent-warning" size={24} />
              <span className="text-accent-warning font-medium">
                You're using a guest account. Register to access all features.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.available ? feature.link : '#'}
            className={`dashboard-card scale-in ${!feature.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={(e) => {
              if (!feature.available) {
                e.preventDefault();
              }
            }}
          >
            <div className="dashboard-card-icon">
              {feature.icon}
            </div>
            <h3 className="dashboard-card-title">{feature.title}</h3>
            <p className="dashboard-card-description">{feature.description}</p>
            {!feature.available && (
              <div className="mt-4 p-3 bg-accent-warning/10 border border-accent-warning/20 rounded-lg">
                <p className="text-sm text-accent-warning text-center font-medium">
                  <Shield className="inline-block mr-2" size={16} />
                  Requires registration
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {user?.is_guest && (
        <div className="text-center">
          <div className="card max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to unlock all features?</h3>
            <p className="text-secondary mb-8">
              Create a free account to access your personal journal, mental health assessments, 
              mindfulness exercises, and more personalized features.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-primary">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;