
import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { JournalEntry } from '../types';
import { useAuth } from './AuthContext';
import * as journalApi from '../api/journal';

interface JournalContextType {
  entries: (JournalEntry & { id: any })[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: any, updatedEntry: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: any) => Promise<void>;
  getEntry: (id: any) => (JournalEntry & { id: any }) | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setEntries([]);
      return;
    }
    (async () => {
      try {
        const list = await journalApi.listJournal();
        // Map backend fields to frontend type expectations
        const normalized = list.map(j => ({
          id: String(j.id),
          title: j.title,
          content: j.content,
          createdAt: j.created_at,
          updatedAt: j.updated_at,
        })) as JournalEntry[];
        setEntries(normalized);
      } catch (e) {
        setEntries([]);
      }
    })();
  }, [isAuthenticated, user?.id]);

  const addEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await journalApi.createJournal(entry.title, entry.content);
    const newEntry: JournalEntry = {
      id: String(created.id),
      title: created.title,
      content: created.content,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };
    setEntries(prev => [newEntry, ...prev]);
  }, []);

  const updateEntry = useCallback(async (id: any, updatedFields: Partial<JournalEntry>) => {
    const updated = await journalApi.updateJournal(Number(id), {
      title: updatedFields.title,
      content: updatedFields.content,
    });
    setEntries(prev => prev.map(e => e.id === String(id) ? {
      ...e,
      title: updated.title,
      content: updated.content,
      updatedAt: updated.updated_at,
    } : e));
  }, []);

  const deleteEntry = useCallback(async (id: any) => {
    await journalApi.deleteJournal(Number(id));
    setEntries(prev => prev.filter(entry => entry.id !== String(id)));
  }, []);

  const getEntry = useCallback((id: any) => {
    return entries.find(entry => entry.id === String(id));
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
