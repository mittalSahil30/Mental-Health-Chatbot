import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chatbot from './pages/Chatbot';
import Journal from './pages/Journal';
import MentalHealthTest from './pages/MentalHealthTest';
import MindfulnessExercises from './pages/MindfulnessExercises';
import SOSContacts from './pages/SOSContacts';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
`;

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/chatbot" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/chatbot" /> : <Register />} 
            />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route 
              path="/journal" 
              element={user ? <Journal /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/test" 
              element={user ? <MentalHealthTest /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/exercises" 
              element={user ? <MindfulnessExercises /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/sos" 
              element={user ? <SOSContacts /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/login" />} 
            />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;