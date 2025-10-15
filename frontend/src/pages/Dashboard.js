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

  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <div className="dashboard-page fade-in">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white/10 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto">
          <div className="mb-8">
            <div className="floating">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome back, <span className="gradient-text">{user?.username}</span>!
              </h1>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Your mental health journey continues here. Choose a feature to get started.
            </p>
            {user?.is_guest && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center">
                  <Shield className="mr-2 text-yellow-300" size={16} />
                  <span className="text-yellow-100 text-xs">
                    Guest account - some features require registration
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setSelectedFeature(feature)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                  selectedFeature?.title === feature.title
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                } ${!feature.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!feature.available}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-xs opacity-80">{feature.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {user?.is_guest && (
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
              <h3 className="text-white font-semibold mb-2">Ready for more?</h3>
              <p className="text-white/80 text-xs mb-4">
                Create a free account to unlock all features
              </p>
              <div className="space-y-2">
                <Link to="/register" className="btn btn-primary w-full text-sm py-2">
                  Create Account
                </Link>
                <Link to="/login" className="btn btn-secondary w-full text-sm py-2">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedFeature ? (
            <div className="max-w-4xl mx-auto">
              <div className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${selectedFeature.color} text-white`}>
                    {selectedFeature.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">{selectedFeature.title}</h2>
                    <p className="text-gray-600 text-lg">{selectedFeature.description}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link 
                    to={selectedFeature.link} 
                    className="btn btn-primary text-lg px-8 py-4"
                  >
                    Open {selectedFeature.title}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center">
              <div className="card">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-4">Choose a Feature</h2>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                  Select any feature from the sidebar to get started with your mental health journey. 
                  Each tool is designed to support your well-being in different ways.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;