import { renderHook, act, waitFor } from '@testing-library/react'
import { useSession } from '../useSession'
import { api } from '@/utils/api'

// Mock the API module
jest.mock('@/utils/api')
const mockedApi = api as jest.Mocked<typeof api>

describe('useSession', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with existing UUID from localStorage', async () => {
    const existingUUID = 'existing-uuid-123'
    localStorage.setItem('userUUID', existingUUID)

    const { result } = renderHook(() => useSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.userUUID).toBe(existingUUID)
    expect(result.current.error).toBeNull()
    expect(mockedApi.storeUUID).not.toHaveBeenCalled()
  })

  it('should generate new UUID when none exists', async () => {
    const newUUID = 'new-uuid-456'
    mockedApi.storeUUID.mockResolvedValue({ success: true, uuid: newUUID })

    const { result } = renderHook(() => useSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.userUUID).toBe(newUUID)
    expect(result.current.error).toBeNull()
    expect(localStorage.getItem('userUUID')).toBe(newUUID)
    expect(mockedApi.storeUUID).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors during UUID generation', async () => {
    const errorMessage = 'Failed to generate UUID'
    mockedApi.storeUUID.mockResolvedValue({ success: false, error: errorMessage })

    const { result } = renderHook(() => useSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.userUUID).toBe('')
    expect(result.current.error).toBe('Failed to generate UUID')
    expect(localStorage.getItem('userUUID')).toBeNull()
  })

  it('should handle network errors during UUID generation', async () => {
    mockedApi.storeUUID.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.userUUID).toBe('')
    expect(result.current.error).toBe('Network error')
  })

  it('should create session ID with timestamp', () => {
    const { result } = renderHook(() => useSession())
    
    // Mock userUUID for this test
    result.current.userUUID = 'test-uuid'

    const sessionId = result.current.createSessionId()
    
    expect(sessionId).toMatch(/^test-uuid-\d+$/)
    expect(localStorage.getItem('sessionTimestamp')).toBeDefined()
  })

  it('should clear session data', () => {
    localStorage.setItem('userUUID', 'test-uuid')
    localStorage.setItem('sessionTimestamp', '123456789')

    const { result } = renderHook(() => useSession())

    act(() => {
      result.current.clearSession()
    })

    expect(result.current.userUUID).toBe('')
    expect(localStorage.getItem('userUUID')).toBeNull()
    expect(localStorage.getItem('sessionTimestamp')).toBeNull()
  })

  it('should reinitialize session when called', async () => {
    const newUUID = 'reinit-uuid-789'
    mockedApi.storeUUID.mockResolvedValue({ success: true, uuid: newUUID })

    const { result } = renderHook(() => useSession())

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Clear and reinitialize
    act(() => {
      result.current.clearSession()
    })

    act(() => {
      result.current.initializeSession()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.userUUID).toBe(newUUID)
    expect(mockedApi.storeUUID).toHaveBeenCalledTimes(2)
  })
}) 