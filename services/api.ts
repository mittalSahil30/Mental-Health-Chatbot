/**
 * API Service for Mental Health Chatbot Backend
 * Handles all communication with the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to clear auth token
export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

// ============= Authentication APIs =============

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
    is_guest: boolean;
  };
}

export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  guestLogin: async (): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/guest', {
      method: 'POST',
    });
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },
};

// ============= Chat APIs =============

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  message: string;
  response: string;
  sentiment: string;
  timestamp: string;
}

export interface ChatHistory {
  chats: Array<{
    id: number;
    user_id: number;
    message: string;
    response: string;
    timestamp: string;
    sentiment: string;
  }>;
  total: number;
  pages: number;
  current_page: number;
}

export const chatAPI = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    return apiRequest<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  getHistory: async (page = 1, perPage = 20): Promise<ChatHistory> => {
    return apiRequest<ChatHistory>(`/chat/history?page=${page}&per_page=${perPage}`);
  },

  clearHistory: async () => {
    return apiRequest('/chat/clear-history', {
      method: 'DELETE',
    });
  },

  getAnalytics: async () => {
    return apiRequest('/chat/analytics');
  },
};

// ============= Journal APIs =============

export interface JournalEntryData {
  title: string;
  content: string;
  mood?: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntriesResponse {
  entries: JournalEntry[];
  total: number;
  pages: number;
  current_page: number;
}

export const journalAPI = {
  getEntries: async (page = 1, perPage = 10, mood?: string): Promise<JournalEntriesResponse> => {
    let url = `/journal/entries?page=${page}&per_page=${perPage}`;
    if (mood) {
      url += `&mood=${mood}`;
    }
    return apiRequest<JournalEntriesResponse>(url);
  },

  createEntry: async (data: JournalEntryData) => {
    return apiRequest('/journal/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEntry: async (id: number) => {
    return apiRequest(`/journal/entries/${id}`);
  },

  updateEntry: async (id: number, data: Partial<JournalEntryData>) => {
    return apiRequest(`/journal/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteEntry: async (id: number) => {
    return apiRequest(`/journal/entries/${id}`, {
      method: 'DELETE',
    });
  },

  getMoodAnalytics: async () => {
    return apiRequest('/journal/moods');
  },
};

// ============= Assessment APIs =============

export interface AssessmentSubmission {
  assessment_type: string;
  answers: number[];
}

export interface AssessmentResult {
  id: number;
  user_id: number;
  assessment_type: string;
  score: number;
  max_score: number;
  severity_level: string;
  answers: number[];
  recommendations: string;
  created_at: string;
}

export const assessmentAPI = {
  getTypes: async () => {
    return apiRequest('/assessment/types');
  },

  submitAssessment: async (data: AssessmentSubmission) => {
    return apiRequest('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getResults: async () => {
    return apiRequest('/assessment/results');
  },

  getResult: async (id: number) => {
    return apiRequest(`/assessment/results/${id}`);
  },

  getAnalytics: async () => {
    return apiRequest('/assessment/analytics');
  },
};

// ============= Mindfulness APIs =============

export interface MindfulnessExercise {
  id: number;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  description: string;
  instructions: string[];
  benefits: string[];
}

export const mindfulnessAPI = {
  getExercises: async () => {
    return apiRequest('/mindfulness/exercises');
  },

  getExercise: async (id: number) => {
    return apiRequest(`/mindfulness/exercises/${id}`);
  },

  getExercisesByCategory: async (category: string) => {
    return apiRequest(`/mindfulness/exercises/category/${category}`);
  },

  getExercisesByDifficulty: async (difficulty: string) => {
    return apiRequest(`/mindfulness/exercises/difficulty/${difficulty}`);
  },

  getCategories: async () => {
    return apiRequest('/mindfulness/categories');
  },
};

// ============= Profile APIs =============

export interface ProfileData {
  full_name?: string;
  age?: number;
  gender?: string;
  bio?: string;
  profile_picture?: string;
  preferences?: Record<string, any>;
  username?: string;
  email?: string;
}

export const profileAPI = {
  getProfile: async () => {
    return apiRequest('/profile');
  },

  updateProfile: async (data: ProfileData) => {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return apiRequest('/profile/stats');
  },

  deleteAccount: async () => {
    return apiRequest('/profile/delete', {
      method: 'DELETE',
    });
  },
};

// ============= SOS APIs =============

export interface SOSContact {
  id: number;
  name: string;
  phone_number: string | null;
  email: string | null;
  description: string | null;
  category: string | null;
  is_active: boolean;
}

export interface SOSContactData {
  name: string;
  phone_number?: string;
  email?: string;
  description?: string;
  category?: string;
}

export const sosAPI = {
  getContacts: async (category?: string) => {
    const url = category ? `/sos/contacts?category=${category}` : '/sos/contacts';
    return apiRequest(url);
  },

  getContact: async (id: number) => {
    return apiRequest(`/sos/contacts/${id}`);
  },

  createContact: async (data: SOSContactData) => {
    return apiRequest('/sos/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateContact: async (id: number, data: Partial<SOSContactData>) => {
    return apiRequest(`/sos/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteContact: async (id: number) => {
    return apiRequest(`/sos/contacts/${id}`, {
      method: 'DELETE',
    });
  },

  getCategories: async () => {
    return apiRequest('/sos/categories');
  },
};
