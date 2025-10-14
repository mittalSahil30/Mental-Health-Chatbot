
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  enterAsGuest: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const isAuthenticated = !!user && !isGuest;

  // Check for existing token on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const guestMode = localStorage.getItem('isGuest') === 'true';
      
      if (guestMode) {
        setIsGuest(true);
        setUser({ id: 0, username: 'Guest', email: '', created_at: '', is_active: true });
      } else if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Token is invalid, clear it
          apiService.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      setUser(response.user);
      setIsGuest(false);
      localStorage.removeItem('isGuest');
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
      setIsGuest(false);
      localStorage.removeItem('isGuest');
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('isGuest');
  }, []);

  const enterAsGuest = useCallback(() => {
    const guestUser: User = { 
      id: 0, 
      username: 'Guest', 
      email: '', 
      created_at: new Date().toISOString(),
      is_active: true 
    };
    setUser(guestUser);
    setIsGuest(true);
    localStorage.setItem('isGuest', 'true');
  }, []);
    
  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  }, [user]);

  const value = { 
    user, 
    isAuthenticated, 
    isGuest, 
    isLoading,
    login, 
    register,
    logout, 
    enterAsGuest, 
    updateUser 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
