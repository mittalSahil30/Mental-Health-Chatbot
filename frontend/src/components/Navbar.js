import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageCircle, 
  BookOpen, 
  Brain, 
  Heart, 
  Phone, 
  User, 
  LogOut,
  Home
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <Heart className="inline-block mr-2" size={24} />
          Mental Health Chatbot
        </Link>

        {user && (
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Home size={16} className="inline-block mr-1" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/chatbot" 
                className={`nav-link ${isActive('/chatbot') ? 'active' : ''}`}
              >
                <MessageCircle size={16} className="inline-block mr-1" />
                Chatbot
              </Link>
            </li>
            {!user.is_guest && (
              <>
                <li>
                  <Link 
                    to="/journal" 
                    className={`nav-link ${isActive('/journal') ? 'active' : ''}`}
                  >
                    <BookOpen size={16} className="inline-block mr-1" />
                    Journal
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/mental-health-test" 
                    className={`nav-link ${isActive('/mental-health-test') ? 'active' : ''}`}
                  >
                    <Brain size={16} className="inline-block mr-1" />
                    Health Test
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/mindfulness" 
                    className={`nav-link ${isActive('/mindfulness') ? 'active' : ''}`}
                  >
                    <Heart size={16} className="inline-block mr-1" />
                    Mindfulness
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/sos-contacts" 
                    className={`nav-link ${isActive('/sos-contacts') ? 'active' : ''}`}
                  >
                    <Phone size={16} className="inline-block mr-1" />
                    SOS Contacts
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}

        <div className="navbar-actions">
          {user ? (
            <div className="user-info">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span>{user.username}</span>
              {!user.is_guest && (
                <Link to="/profile" className="nav-link">
                  <User size={16} className="inline-block mr-1" />
                  Profile
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={16} className="inline-block mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;