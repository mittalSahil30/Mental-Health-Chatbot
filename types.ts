
// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  emergency_contact?: string;
  created_at: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  emergency_contact?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Journal types
export interface JournalEntry {
  id: number;
  user_id: number;
  title: string;
  content: string;
  mood_rating?: number;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryCreate {
  title: string;
  content: string;
  mood_rating?: number;
  tags?: string;
}

export interface JournalStats {
  total_entries: number;
  entries_with_mood: number;
  average_mood?: number;
  mood_trend?: string;
  common_tags: Array<{ tag: string; count: number }>;
}

// Chat types
export interface ChatMessage {
  id: number;
  message: string;
  is_user: boolean;
  timestamp: string;
  sentiment_score?: number;
}

export interface ChatSession {
  id: number;
  session_id: string;
  created_at: string;
  messages: ChatMessage[];
}

export interface ChatMessageRequest {
  message: string;
  session_id?: string;
}

// Test types
export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface TestResponse {
  question_id: number;
  answer: number;
}

export interface MentalHealthTest {
  test_type: string;
  title: string;
  description: string;
  instructions: string;
  questions: TestQuestion[];
}

export interface TestResult {
  id: number;
  test_type: string;
  score: number;
  max_score: number;
  severity_level: string;
  recommendations: string;
  created_at: string;
}

export interface TestSubmission {
  test_type: string;
  responses: TestResponse[];
}

// Mindfulness types
export interface MindfulnessExercise {
  id: number;
  title: string;
  description: string;
  category: string;
  duration_minutes?: number;
  instructions: string;
  audio_url?: string;
  difficulty_level: string;
}

export interface ExerciseProgress {
  exercise_id: number;
  rating?: number;
  notes?: string;
}

// SOS types
export interface SOSContact {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  description?: string;
  category: string;
  country?: string;
}

// API response types
export interface ApiError {
  detail: string;
}
