export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || (typeof process !== 'undefined' ? (process as any).env?.API_BASE_URL : '') || 'http://localhost:8000';

export function getAuthToken(): string | null {
  return window.localStorage.getItem('authToken');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    window.localStorage.setItem('authToken', token);
  } else {
    window.localStorage.removeItem('authToken');
  }
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

export async function apiForm<T = any>(path: string, form: Record<string, string>): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const token = getAuthToken();
  const body = new URLSearchParams(form);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function streamGet(path: string, onToken: (token: string) => void): Promise<void> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const token = getAuthToken();
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new Error(text || `Streaming failed with status ${res.status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) onToken(decoder.decode(value, { stream: true }));
    done = readerDone;
  }
}
