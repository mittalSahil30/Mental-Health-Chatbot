import { apiFetch, apiForm, setAuthToken } from './client';

export interface TokenResp { access_token: string; token_type: string }
export interface MeResp { id: number; name: string; email?: string }

export async function signup(name: string, email: string, password: string): Promise<MeResp> {
  const token = await apiFetch<TokenResp>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  setAuthToken(token.access_token);
  return me();
}

export async function login(email: string, password: string): Promise<MeResp> {
  const token = await apiForm<TokenResp>('/auth/login', {
    username: email, password
  });
  setAuthToken(token.access_token);
  return me();
}

export async function guest(): Promise<MeResp> {
  const token = await apiFetch<TokenResp>('/auth/guest', { method: 'POST' });
  setAuthToken(token.access_token);
  return me();
}

export async function me(): Promise<MeResp> {
  return apiFetch<MeResp>('/auth/me');
}

export async function updateMe(data: Partial<MeResp>): Promise<MeResp> {
  return apiFetch<MeResp>('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
}
