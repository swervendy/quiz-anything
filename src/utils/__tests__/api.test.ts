import { api, ApiError } from '../api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('apiCall', () => {
    it('should make successful API calls', async () => {
      const mockResponse = { success: true, data: { test: 'data' } }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await api.generateQuestions({ topic: 'test', uuid: 'test-uuid' })
      
      expect(fetch).toHaveBeenCalledWith('/api/generateQuestions', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ topic: 'test', uuid: 'test-uuid' }),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw ApiError on HTTP error responses', async () => {
      const mockErrorResponse = { error: 'Bad Request' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      })

      await expect(api.generateQuestions({ topic: 'test', uuid: 'test-uuid' }))
        .rejects
        .toThrow(ApiError)
    })

    it('should throw ApiError on network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(api.generateQuestions({ topic: 'test', uuid: 'test-uuid' }))
        .rejects
        .toThrow(ApiError)
    })
  })

  describe('storeUUID', () => {
    it('should call storeUUID endpoint', async () => {
      const mockResponse = { success: true, uuid: 'test-uuid' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await api.storeUUID()
      
      expect(fetch).toHaveBeenCalledWith('/api/storeUUID', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('generateQuestions', () => {
    it('should call generateQuestions endpoint with correct payload', async () => {
      const mockResponse = { success: true, questions: [] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const request = { topic: 'JavaScript', uuid: 'test-uuid' }
      await api.generateQuestions(request)
      
      expect(fetch).toHaveBeenCalledWith('/api/generateQuestions', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(request),
      })
    })
  })

  describe('getYoutubeTranscript', () => {
    it('should call getYoutubeTranscript endpoint', async () => {
      const mockResponse = { success: true }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.getYoutubeTranscript('https://youtube.com/watch?v=test', 'test-uuid')
      
      expect(fetch).toHaveBeenCalledWith('/api/getYoutubeTranscript', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ 
          youtubeUrl: 'https://youtube.com/watch?v=test', 
          uuid: 'test-uuid' 
        }),
      })
    })
  })

  describe('generateYoutubeQuestions', () => {
    it('should call generateYoutubeQuestions endpoint', async () => {
      const mockResponse = { success: true, questions: [] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.generateYoutubeQuestions('test-uuid')
      
      expect(fetch).toHaveBeenCalledWith('/api/generateYoutubeQuestions', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ uuid: 'test-uuid' }),
      })
    })
  })

  describe('generateUrlQuestions', () => {
    it('should call generateUrlQuestions endpoint', async () => {
      const mockResponse = { success: true, questions: [] }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      await api.generateUrlQuestions('https://example.com', 'test-uuid')
      
      expect(fetch).toHaveBeenCalledWith('/api/generateUrlQuestions', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ 
          url: 'https://example.com', 
          uuid: 'test-uuid' 
        }),
      })
    })
  })
}) 