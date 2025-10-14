
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { User } from '../types';
import { authAPI, setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (user: User, token: string, guest?: boolean) => void;
  logout: () => void;
  enterAsGuest: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isGuest, setIsGuest] = useLocalStorage<boolean>('isGuest', false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  // Define logout first
  const logout = useCallback(() => {
    setUser(null);
    setIsGuest(false);
    clearAuthToken();
    // Clear other related local storage
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('testResults');
  }, [setUser, setIsGuest]);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token && user) {
        try {
          await authAPI.verifyToken();
          setLoading(false);
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, [user, logout]);

  const login = useCallback((userData: User, token: string, guest = false) => {
    setUser(userData);
    setIsGuest(guest);
    setAuthToken(token);
    setLoading(false);
  }, [setUser, setIsGuest]);

  const enterAsGuest = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.guestLogin();
      const guestUser: User = {
        id: response.user.id.toString(),
        name: response.user.username,
        email: response.user.email,
      };
      login(guestUser, response.access_token, true);
    } catch (error) {
      console.error('Guest login failed:', error);
      setLoading(false);
      throw error;
    }
  }, [login]);
    
  const updateUser = useCallback((userData: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...userData });
      }
  }, [user, setUser]);

  const value = { user, isAuthenticated, isGuest, login, logout, enterAsGuest, updateUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
