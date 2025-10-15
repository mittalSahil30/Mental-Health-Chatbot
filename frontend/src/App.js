import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Journal from './pages/Journal';
import MentalHealthTest from './pages/MentalHealthTest';
import MindfulnessExercises from './pages/MindfulnessExercises';
import SOSContacts from './pages/SOSContacts';
import Profile from './pages/Profile';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chatbot" 
              element={<Chatbot />} 
            />
            <Route 
              path="/journal" 
              element={user && !user.is_guest ? <Journal /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/mental-health-test" 
              element={user && !user.is_guest ? <MentalHealthTest /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/mindfulness" 
              element={user && !user.is_guest ? <MindfulnessExercises /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/sos-contacts" 
              element={user && !user.is_guest ? <SOSContacts /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user && !user.is_guest ? <Profile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </main>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;