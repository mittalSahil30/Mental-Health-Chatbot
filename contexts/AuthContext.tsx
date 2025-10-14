
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { User } from '../types';
import { signup as apiSignup, login as apiLogin, guest as apiGuest, me as apiMe, updateMe as apiUpdateMe } from '../api/auth';
import { setAuthToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  passwordLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  enterAsGuest: () => Promise<void>;
  refreshMe: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isGuest, setIsGuest] = useLocalStorage<boolean>('isGuest', false);
  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    // On app start, if token exists try to hydrate user
    const token = window.localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await apiMe();
        const normalized: User = { id: String(me.id), name: me.name, email: me.email };
        setUser(normalized);
        setIsGuest(!Boolean(me.email));
      } catch {
        setAuthToken(null);
        setUser(null);
        setIsGuest(false);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setIsGuest(false);
    // Clear any locally cached lists
    localStorage.removeItem('journalEntries');
    localStorage.removeItem('testResults');
  }, [setUser, setIsGuest]);

  const enterAsGuest = useCallback(async () => {
    const me = await apiGuest();
    const normalized: User = { id: String(me.id), name: me.name, email: me.email };
    setUser(normalized);
    setIsGuest(true);
  }, [setUser, setIsGuest]);
    
  const refreshMe = useCallback(async () => {
    const me = await apiMe();
    const normalized: User = { id: String(me.id), name: me.name, email: me.email };
    setUser(normalized);
    setIsGuest(!Boolean(me.email));
  }, [setUser, setIsGuest]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
      const updated = await apiUpdateMe({ name: userData.name, email: userData.email });
      const normalized: User = { id: String(updated.id), name: updated.name, email: updated.email };
      setUser(normalized);
  }, [setUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const me = await apiSignup(name, email, password);
    const normalized: User = { id: String(me.id), name: me.name, email: me.email };
    setUser(normalized);
    setIsGuest(false);
  }, [setUser, setIsGuest]);

  const passwordLogin = useCallback(async (email: string, password: string) => {
    const me = await apiLogin(email, password);
    const normalized: User = { id: String(me.id), name: me.name, email: me.email };
    setUser(normalized);
    setIsGuest(false);
  }, [setUser, setIsGuest]);

  const value = { user, isAuthenticated, isGuest, loading, signup, passwordLogin, logout, enterAsGuest, refreshMe, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
