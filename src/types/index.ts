export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizSession {
  uuid: string;
  sessionId: string;
  topic?: string;
  youtubeUrl?: string;
  url?: string;
  questions: Question[];
  createdAt: Date;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateQuestionsRequest {
  topic?: string;
  youtubeUrl?: string;
  url?: string;
  uuid: string;
}

export interface GenerateQuestionsResponse extends ApiResponse {
  questions?: Question[];
}

export interface StoreUUIDResponse extends ApiResponse {
  uuid?: string;
}

export interface UserSession {
  uuid: string;
  sessionId: string;
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt?: Date;
}

export type TabType = 'topic' | 'youtube' | 'url';

export interface TabConfig {
  id: TabType;
  label: string;
  placeholder: string;
  icon?: any; // Simplified for now
} 