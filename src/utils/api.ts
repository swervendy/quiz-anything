import { 
  ApiResponse, 
  GenerateQuestionsRequest, 
  GenerateQuestionsResponse, 
  StoreUUIDResponse,
  Question 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const api = {
  // UUID Management
  async storeUUID(): Promise<StoreUUIDResponse> {
    return apiCall<StoreUUIDResponse>('/api/storeUUID', {
      method: 'POST',
    });
  },

  // Question Generation
  async generateQuestions(request: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse> {
    return apiCall<GenerateQuestionsResponse>('/api/generateQuestions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async generateYoutubeQuestions(uuid: string): Promise<GenerateQuestionsResponse> {
    return apiCall<GenerateQuestionsResponse>('/api/generateYoutubeQuestions', {
      method: 'POST',
      body: JSON.stringify({ uuid }),
    });
  },

  async generateUrlQuestions(url: string, uuid: string): Promise<GenerateQuestionsResponse> {
    return apiCall<GenerateQuestionsResponse>('/api/generateUrlQuestions', {
      method: 'POST',
      body: JSON.stringify({ url, uuid }),
    });
  },

  // YouTube Transcript
  async getYoutubeTranscript(youtubeUrl: string, uuid: string): Promise<ApiResponse> {
    return apiCall<ApiResponse>('/api/getYoutubeTranscript', {
      method: 'POST',
      body: JSON.stringify({ youtubeUrl, uuid }),
    });
  },

  // User Answers
  async storeUserAnswers(sessionId: string, answers: any[]): Promise<ApiResponse> {
    return apiCall<ApiResponse>('/api/storeUserAnswers', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answers }),
    });
  },

  async getUserAnswers(sessionId: string): Promise<ApiResponse> {
    return apiCall<ApiResponse>(`/api/getUserAnswers?sessionId=${sessionId}`);
  },

  // Questions
  async getQuestions(sessionId: string): Promise<ApiResponse<Question[]>> {
    return apiCall<ApiResponse<Question[]>>(`/api/getQuestions?sessionId=${sessionId}`);
  },
};

export { ApiError }; 