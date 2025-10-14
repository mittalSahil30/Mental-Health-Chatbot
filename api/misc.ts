import { apiFetch } from './client';

export async function getExercises() {
  return apiFetch('/misc/exercises');
}

export async function getSos() {
  return apiFetch('/misc/sos');
}
