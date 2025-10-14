import { apiFetch } from './client';

export interface JournalOut { id: number; title: string; content: string; created_at: string; updated_at: string }

export async function listJournal(): Promise<JournalOut[]> {
  return apiFetch('/journal/');
}

export async function createJournal(title: string, content: string): Promise<JournalOut> {
  return apiFetch('/journal/', { method: 'POST', body: JSON.stringify({ title, content }) });
}

export async function updateJournal(id: number, data: Partial<Pick<JournalOut, 'title' | 'content'>>): Promise<JournalOut> {
  return apiFetch(`/journal/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteJournal(id: number): Promise<void> {
  await apiFetch(`/journal/${id}`, { method: 'DELETE' });
}
