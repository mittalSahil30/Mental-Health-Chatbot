
// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Chat
  CHAT_MESSAGE: '/chat/message',
  CHAT_SESSIONS: '/chat/sessions',
  
  // Journal
  JOURNAL_ENTRIES: '/journal/entries',
  JOURNAL_STATS: '/journal/stats',
  
  // Tests
  TEST_TYPES: '/test/types',
  TEST_QUESTIONS: '/test/questions',
  TEST_SUBMIT: '/test/submit',
  TEST_RESULTS: '/test/results',
  TEST_STATS: '/test/stats',
  
  // Mindfulness
  MINDFULNESS_EXERCISES: '/mindfulness/exercises',
  MINDFULNESS_PROGRESS: '/mindfulness/progress',
  MINDFULNESS_CATEGORIES: '/mindfulness/categories',
  
  // SOS
  SOS_CONTACTS: '/sos/contacts',
  SOS_CATEGORIES: '/sos/categories',
  SOS_EMERGENCY_INFO: '/sos/emergency-info',
  
  // Profile
  PROFILE: '/profile/me',
  PROFILE_STATS: '/profile/stats'
};

// Default mood options for journal entries
export const MOOD_OPTIONS = [
  { value: 1, label: '😢 Very Low', color: '#ef4444' },
  { value: 2, label: '😞 Low', color: '#f97316' },
  { value: 3, label: '😐 Below Average', color: '#eab308' },
  { value: 4, label: '😊 Neutral', color: '#84cc16' },
  { value: 5, label: '😌 Good', color: '#22c55e' },
  { value: 6, label: '😄 Very Good', color: '#10b981' },
  { value: 7, label: '😁 Great', color: '#06b6d4' },
  { value: 8, label: '🤗 Excellent', color: '#3b82f6' },
  { value: 9, label: '😍 Amazing', color: '#8b5cf6' },
  { value: 10, label: '🥳 Fantastic', color: '#a855f7' }
];

// Test severity levels with colors
export const SEVERITY_LEVELS = {
  minimal: { label: 'Minimal', color: '#22c55e' },
  mild: { label: 'Mild', color: '#eab308' },
  moderate: { label: 'Moderate', color: '#f97316' },
  moderately_severe: { label: 'Moderately Severe', color: '#ef4444' },
  severe: { label: 'Severe', color: '#dc2626' },
  low: { label: 'Low', color: '#22c55e' },
  high: { label: 'High', color: '#ef4444' }
};

// Exercise difficulty levels
export const DIFFICULTY_LEVELS = {
  beginner: { label: 'Beginner', color: '#22c55e' },
  intermediate: { label: 'Intermediate', color: '#eab308' },
  advanced: { label: 'Advanced', color: '#ef4444' }
};
