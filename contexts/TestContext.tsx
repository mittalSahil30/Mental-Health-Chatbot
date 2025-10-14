
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { TestResult } from '../types';
import { useAuth } from './AuthContext';

interface TestContextType {
  results: TestResult[];
  addResult: (result: TestResult) => void;
  getLatestResult: () => TestResult | undefined;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user && user.id !== 'guest' ? `testResults_${user.id}` : 'testResults_guest';
  const [results, setResults] = useLocalStorage<TestResult[]>(storageKey, []);

  const addResult = useCallback((result: TestResult) => {
    setResults(prev => [result, ...prev]);
  }, [setResults]);

  const getLatestResult = useCallback(() => {
    return results?.[0];
  }, [results]);

  const value = { results, addResult, getLatestResult };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};
