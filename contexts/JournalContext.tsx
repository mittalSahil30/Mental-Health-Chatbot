
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { JournalEntry } from '../types';
import { useAuth } from './AuthContext';

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updatedEntry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // We use a user-specific key to keep journals private.
  const storageKey = user && user.id !== 'guest' ? `journalEntries_${user.id}` : 'journalEntries_guest';
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(storageKey, []);

  const addEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
  }, [setEntries]);

  const updateEntry = useCallback((id: string, updatedFields: Partial<JournalEntry>) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, ...updatedFields, updatedAt: new Date().toISOString() } : entry
      )
    );
  }, [setEntries]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, [setEntries]);

  const getEntry = useCallback((id: string) => {
    return entries.find(entry => entry.id === id);
  }, [entries]);

  const value = { entries, addEntry, updateEntry, deleteEntry, getEntry };

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
