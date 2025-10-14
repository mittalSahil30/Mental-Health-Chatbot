
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ChatbotPage from './pages/ChatbotPage';
import JournalPage from './pages/JournalPage';
import TestPage from './pages/TestPage';
import ExercisesPage from './pages/ExercisesPage';
import SosPage from './pages/SosPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import { JournalProvider } from './contexts/JournalContext';
import { TestProvider } from './contexts/TestContext';

// A wrapper for routes that require authentication.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  if (!isAuthenticated || isGuest) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// A wrapper for routes accessible by guests and authenticated users.
const AccessibleRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

const AppRoutes: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="/chatbot" />} />
                <Route path="chatbot" element={<AccessibleRoute><ChatbotPage /></AccessibleRoute>} />
                <Route path="journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
                <Route path="test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
                <Route path="exercises" element={<AccessibleRoute><ExercisesPage /></AccessibleRoute>} />
                <Route path="sos" element={<AccessibleRoute><SosPage /></AccessibleRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <JournalProvider>
            <TestProvider>
                <HashRouter>
                    <AppRoutes />
                </HashRouter>
            </TestProvider>
        </JournalProvider>
    </AuthProvider>
  );
};

export default App;
