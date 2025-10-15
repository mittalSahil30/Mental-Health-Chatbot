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
    <div className="dashboard-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome back, <span className="gradient-text">{user?.username}</span>!
          </h1>
        </div>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your mental health journey continues here. Take a moment to check in with yourself and explore the tools designed to support your well-being.
        </p>
        {user?.is_guest && (
          <div className="glass-card max-w-lg mx-auto p-6 border-l-4 border-yellow-400">
            <div className="flex items-center justify-center">
              <Shield className="mr-3 text-yellow-600" size={24} />
              <span className="text-yellow-800 font-semibold">
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
            className={`dashboard-card scale-in ${!feature.available ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
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
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700 text-center font-medium">
                  <Shield className="inline-block mr-2" size={16} />
                  Requires registration
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center scale-in" style={{ animationDelay: '0.6s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calendar className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 gradient-text">Daily Check-ins</h3>
          <p className="text-gray-600 leading-relaxed">
            Track your mood and well-being with our daily assessment tools designed to help you stay connected with your mental health.
          </p>
        </div>

        <div className="card text-center scale-in" style={{ animationDelay: '0.7s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <TrendingUp className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 gradient-text">Progress Tracking</h3>
          <p className="text-gray-600 leading-relaxed">
            Monitor your mental health journey with personalized insights and visual progress tracking that celebrates your growth.
          </p>
        </div>

        <div className="card text-center scale-in" style={{ animationDelay: '0.8s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3 gradient-text">Privacy First</h3>
          <p className="text-gray-600 leading-relaxed">
            Your data is encrypted and secure. We prioritize your privacy and ensure your personal information stays confidential.
          </p>
        </div>
      </div>

      {user?.is_guest && (
        <div className="mt-16 text-center">
          <div className="card max-w-3xl mx-auto scale-in" style={{ animationDelay: '0.9s' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Ready to unlock all features?</h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Create a free account to access your personal journal, mental health assessments, 
              mindfulness exercises, and more personalized features designed to support your mental health journey.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
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