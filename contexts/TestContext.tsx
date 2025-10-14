
import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import type { TestResult } from '../types';
import { useAuth } from './AuthContext';
import * as testApi from '../api/test';

interface TestContextType {
  results: TestResult[];
  addResult: (result: TestResult) => Promise<void>;
  getLatestResult: () => TestResult | undefined;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setResults([]);
      return;
    }
    (async () => {
      try {
        const apiResults = await testApi.listResults();
        const normalized: TestResult[] = apiResults.map(r => ({
          score: r.score,
          interpretation: r.interpretation,
          date: r.date,
        }));
        setResults(normalized);
      } catch {
        setResults([]);
      }
    })();
  }, [isAuthenticated, user?.id]);

  const addResult = useCallback(async (result: TestResult) => {
    const created = await testApi.createResult(result.score, result.interpretation, result.date);
    setResults(prev => [{ score: created.score, interpretation: created.interpretation, date: created.date }, ...prev]);
  }, []);

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
