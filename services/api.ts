import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  JournalEntry,
  JournalEntryCreate,
  JournalStats,
  ChatMessage,
  ChatSession,
  ChatMessageRequest,
  MentalHealthTest,
  TestResult,
  TestSubmission,
  MindfulnessExercise,
  ExerciseProgress,
  SOSContact,
  ApiError
} from '../types';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.ME);
  }

  logout() {
    this.setToken(null);
  }

  // Journal methods
  async getJournalEntries(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    tag?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<JournalEntry[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `${API_ENDPOINTS.JOURNAL_ENTRIES}?${queryParams}`;
    return this.request<JournalEntry[]>(endpoint);
  }

  async createJournalEntry(entry: JournalEntryCreate): Promise<JournalEntry> {
    return this.request<JournalEntry>(API_ENDPOINTS.JOURNAL_ENTRIES, {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateJournalEntry(id: number, entry: Partial<JournalEntryCreate>): Promise<JournalEntry> {
    return this.request<JournalEntry>(`${API_ENDPOINTS.JOURNAL_ENTRIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteJournalEntry(id: number): Promise<void> {
    await this.request(`${API_ENDPOINTS.JOURNAL_ENTRIES}/${id}`, {
      method: 'DELETE',
    });
  }

  async getJournalStats(): Promise<JournalStats> {
    return this.request<JournalStats>(API_ENDPOINTS.JOURNAL_STATS);
  }

  // Chat methods
  async sendMessage(messageData: ChatMessageRequest): Promise<ChatMessage> {
    return this.request<ChatMessage>(API_ENDPOINTS.CHAT_MESSAGE, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return this.request<ChatSession[]>(API_ENDPOINTS.CHAT_SESSIONS);
  }

  async getChatSession(sessionId: string): Promise<ChatSession> {
    return this.request<ChatSession>(`${API_ENDPOINTS.CHAT_SESSIONS}/${sessionId}`);
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    await this.request(`${API_ENDPOINTS.CHAT_SESSIONS}/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Test methods
  async getTestTypes(): Promise<any> {
    return this.request(API_ENDPOINTS.TEST_TYPES);
  }

  async getTestQuestions(testType: string): Promise<MentalHealthTest> {
    return this.request<MentalHealthTest>(`${API_ENDPOINTS.TEST_QUESTIONS}/${testType}`);
  }

  async submitTest(testData: TestSubmission): Promise<TestResult> {
    return this.request<TestResult>(API_ENDPOINTS.TEST_SUBMIT, {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async getTestResults(): Promise<TestResult[]> {
    return this.request<TestResult[]>(API_ENDPOINTS.TEST_RESULTS);
  }

  async getTestStats(): Promise<any> {
    return this.request(API_ENDPOINTS.TEST_STATS);
  }

  // Mindfulness methods
  async getMindfulnessExercises(params?: {
    category?: string;
    difficulty?: string;
    max_duration?: number;
  }): Promise<MindfulnessExercise[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `${API_ENDPOINTS.MINDFULNESS_EXERCISES}?${queryParams}`;
    return this.request<MindfulnessExercise[]>(endpoint);
  }

  async getMindfulnessExercise(id: number): Promise<MindfulnessExercise> {
    return this.request<MindfulnessExercise>(`${API_ENDPOINTS.MINDFULNESS_EXERCISES}/${id}`);
  }

  async completeExercise(id: number, progress: ExerciseProgress): Promise<any> {
    return this.request(`${API_ENDPOINTS.MINDFULNESS_EXERCISES}/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  async getMindfulnessProgress(): Promise<any> {
    return this.request(API_ENDPOINTS.MINDFULNESS_PROGRESS);
  }

  async getMindfulnessCategories(): Promise<any> {
    return this.request(API_ENDPOINTS.MINDFULNESS_CATEGORIES);
  }

  // SOS methods
  async getSOSContacts(params?: {
    category?: string;
    country?: string;
  }): Promise<SOSContact[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `${API_ENDPOINTS.SOS_CONTACTS}?${queryParams}`;
    return this.request<SOSContact[]>(endpoint);
  }

  async getSOSCategories(): Promise<any> {
    return this.request(API_ENDPOINTS.SOS_CATEGORIES);
  }

  async getEmergencyInfo(): Promise<any> {
    return this.request(API_ENDPOINTS.SOS_EMERGENCY_INFO);
  }

  // Profile methods
  async getProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.PROFILE);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getProfileStats(): Promise<any> {
    return this.request(API_ENDPOINTS.PROFILE_STATS);
  }
}

export const apiService = new ApiService();