import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export const useSession = () => {
  const [userUUID, setUserUUID] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if UUID exists in localStorage
      const storedUUID = localStorage.getItem('userUUID');
      
      if (storedUUID) {
        setUserUUID(storedUUID);
      } else {
        // Generate new UUID and store in database
        const response = await api.storeUUID();
        
        if (response.uuid) {
          localStorage.setItem('userUUID', response.uuid);
          setUserUUID(response.uuid);
        } else {
          throw new Error('Failed to generate UUID');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
      setError(errorMessage);
      console.error('Session initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSessionId = (): string => {
    const sessionTimestamp = Date.now();
    const sessionId = `${userUUID}-${sessionTimestamp}`;
    localStorage.setItem('sessionTimestamp', sessionTimestamp.toString());
    return sessionId;
  };

  const clearSession = () => {
    localStorage.removeItem('userUUID');
    localStorage.removeItem('sessionTimestamp');
    setUserUUID('');
  };

  return {
    userUUID,
    isLoading,
    error,
    createSessionId,
    clearSession,
    initializeSession,
  };
}; 