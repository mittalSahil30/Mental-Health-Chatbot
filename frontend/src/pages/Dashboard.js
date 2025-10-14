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
  Calendar,
  TrendingUp,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Chatbot',
      description: 'Talk to our AI-powered mental health companion for support and guidance',
      icon: <MessageCircle size={24} />,
      link: '/chatbot',
      color: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      title: 'Personal Journal',
      description: 'Record your thoughts, feelings, and daily experiences privately',
      icon: <BookOpen size={24} />,
      link: '/journal',
      color: 'from-green-500 to-green-600',
      available: !user?.is_guest
    },
    {
      title: 'Mental Health Test',
      description: 'Take our comprehensive assessment to understand your mental health',
      icon: <Brain size={24} />,
      link: '/mental-health-test',
      color: 'from-purple-500 to-purple-600',
      available: !user?.is_guest
    },
    {
      title: 'Mindfulness Exercises',
      description: 'Practice meditation and mindfulness techniques for better well-being',
      icon: <Heart size={24} />,
      link: '/mindfulness',
      color: 'from-pink-500 to-pink-600',
      available: !user?.is_guest
    },
    {
      title: 'SOS Contacts',
      description: 'Access emergency contacts and crisis support resources',
      icon: <Phone size={24} />,
      link: '/sos-contacts',
      color: 'from-red-500 to-red-600',
      available: !user?.is_guest
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account and personalize your experience',
      icon: <User size={24} />,
      link: '/profile',
      color: 'from-indigo-500 to-indigo-600',
      available: !user?.is_guest
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-xl text-white/90 mb-6">
          Your mental health journey continues here
        </p>
        {user?.is_guest && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg max-w-md mx-auto">
            <div className="flex items-center">
              <Shield className="mr-2" size={20} />
              <span className="text-sm">
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
            className={`dashboard-card ${!feature.available ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              if (!feature.available) {
                e.preventDefault();
              }
            }}
          >
            <div className={`dashboard-card-icon bg-gradient-to-r ${feature.color} text-white`}>
              {feature.icon}
            </div>
            <h3 className="dashboard-card-title">{feature.title}</h3>
            <p className="dashboard-card-description">{feature.description}</p>
            {!feature.available && (
              <div className="mt-4 p-2 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <Shield className="inline-block mr-1" size={16} />
                  Requires registration
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Calendar className="mx-auto mb-4 text-blue-500" size={32} />
          <h3 className="text-lg font-semibold mb-2">Daily Check-ins</h3>
          <p className="text-gray-600">
            Track your mood and well-being with our daily assessment tools
          </p>
        </div>

        <div className="card text-center">
          <TrendingUp className="mx-auto mb-4 text-green-500" size={32} />
          <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-600">
            Monitor your mental health journey with personalized insights
          </p>
        </div>

        <div className="card text-center">
          <Shield className="mx-auto mb-4 text-purple-500" size={32} />
          <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
          <p className="text-gray-600">
            Your data is encrypted and secure. We prioritize your privacy
          </p>
        </div>
      </div>

      {user?.is_guest && (
        <div className="mt-8 text-center">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Ready to unlock all features?</h3>
            <p className="text-gray-600 mb-6">
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