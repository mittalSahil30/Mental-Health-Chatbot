import { apiFetch } from './client';

export interface TestResultOut { id: number; score: number; interpretation: string; date: string }

export async function listResults(): Promise<TestResultOut[]> {
  return apiFetch('/test/results');
}

export async function createResult(score: number, interpretation: string, date: string): Promise<TestResultOut> {
  return apiFetch('/test/results', { method: 'POST', body: JSON.stringify({ score, interpretation, date }) });
}
