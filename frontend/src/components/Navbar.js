import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiUser, FiLogOut, FiMessageCircle, FiBook, FiActivity, FiHeart, FiPhone, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0 2rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#667eea' : '#333'};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
    }
  }

  &.secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const { user, logout, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/chatbot');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <NavbarContainer>
      <Logo to="/">
        <FiHeart />
        MindCare
      </Logo>

      <NavLinks isOpen={isMenuOpen}>
        <NavLink to="/" active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/chatbot" active={isActive('/chatbot')}>
          <FiMessageCircle />
          Chatbot
        </NavLink>
        {user && (
          <>
            <NavLink to="/journal" active={isActive('/journal')}>
              <FiBook />
              Journal
            </NavLink>
            <NavLink to="/test" active={isActive('/test')}>
              <FiActivity />
              Health Test
            </NavLink>
            <NavLink to="/exercises" active={isActive('/exercises')}>
              <FiHeart />
              Exercises
            </NavLink>
            <NavLink to="/sos" active={isActive('/sos')}>
              <FiPhone />
              SOS
            </NavLink>
            <NavLink to="/profile" active={isActive('/profile')}>
              <FiSettings />
              Profile
            </NavLink>
          </>
        )}
      </NavLinks>

      <UserMenu>
        {user ? (
          <UserButton onClick={handleLogout}>
            <FiLogOut />
            Logout
          </UserButton>
        ) : (
          <AuthButtons>
            <Button 
              className="secondary" 
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </Button>
            <Button 
              className="primary" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </AuthButtons>
        )}
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </UserMenu>
    </NavbarContainer>
  );
};

export default Navbar;