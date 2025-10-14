
export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestQuestion {
    id: number;
    text: string;
    options: string[];
}

export interface TestResult {
    score: number;
    interpretation: string;
    date: string;
}

export interface MindfulnessExercise {
    id: string;
    title: string;
    description: string;
    steps: string[];
    duration: string;
    audioUrl?: string; 
}
