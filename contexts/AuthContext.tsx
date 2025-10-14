
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (user: User) => void;
  logout: () => void;
  enterAsGuest: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isGuest, setIsGuest] = useLocalStorage<boolean>('isGuest', false);
  const isAuthenticated = !!user;

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsGuest(false);
  }, [setUser, setIsGuest]);

  const logout = useCallback(() => {
    setUser(null);
    setIsGuest(false);
    // Optionally clear other related local storage
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('testResults');
  }, [setUser, setIsGuest]);

  const enterAsGuest = useCallback(() => {
    const guestUser: User = { id: 'guest', name: 'Guest' };
    setUser(guestUser);
    setIsGuest(true);
  }, [setUser, setIsGuest]);
    
  const updateUser = useCallback((userData: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...userData });
      }
  }, [user, setUser]);

  const value = { user, isAuthenticated, isGuest, login, logout, enterAsGuest, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
