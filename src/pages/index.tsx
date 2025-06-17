import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TabSelector } from '@/components/TabSelector';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useSession } from '@/hooks/useSession';
import { api } from '@/utils/api';
import { TabType } from '@/types';

const HomePage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [url, setUrl] = useState('');
  const [tab, setTab] = useState<TabType>('topic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { userUUID, createSessionId, isLoading: sessionLoading, error: sessionError } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!userUUID) {
      setError('Session not initialized. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    const sessionId = createSessionId();

    try {
      if (tab === 'topic') {
        if (!topic.trim()) {
          throw new Error('Please enter a topic');
        }

        const response = await api.generateQuestions({ topic: topic.trim(), uuid: sessionId });

        if (response.questions && response.questions.length > 0) {
          router.push('/quiz');
        } else {
          throw new Error('Failed to generate questions. Please try again.');
        }
      } else if (tab === 'youtube') {
        if (!youtubeURL.trim()) {
          throw new Error('Please enter a YouTube URL');
        }

        // Step 1: Get YouTube transcript
        const transcriptResponse = await api.getYoutubeTranscript(youtubeURL.trim(), sessionId);

        if (!transcriptResponse.success) {
          throw new Error('Failed to get YouTube transcript. Please check the URL and try again.');
        }

        // Step 2: Generate questions from transcript
        const questionsResponse = await api.generateYoutubeQuestions(sessionId);

        if (questionsResponse.questions && questionsResponse.questions.length > 0) {
          router.push('/quiz');
        } else {
          throw new Error('Failed to generate questions from YouTube transcript.');
        }
      } else if (tab === 'url') {
        if (!url.trim()) {
          throw new Error('Please enter a URL');
        }

        const response = await api.generateUrlQuestions(url.trim(), sessionId);

        if (response.questions && response.questions.length > 0) {
          router.push('/quiz');
        } else {
          throw new Error('Failed to generate questions from URL content.');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error in handleSubmit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputValue = (): string => {
    switch (tab) {
      case 'topic':
        return topic;
      case 'youtube':
        return youtubeURL;
      case 'url':
        return url;
      default:
        return '';
    }
  };

  const setInputValue = (value: string) => {
    switch (tab) {
      case 'topic':
        setTopic(value);
        break;
      case 'youtube':
        setYoutubeURL(value);
        break;
      case 'url':
        setUrl(value);
        break;
    }
  };

  const getPlaceholder = (): string => {
    switch (tab) {
      case 'topic':
        return 'Enter a topic (e.g., "Photosynthesis", "World War II", "JavaScript")';
      case 'youtube':
        return 'Enter a YouTube URL (e.g., https://www.youtube.com/watch?v=...)';
      case 'url':
        return 'Enter a URL (e.g., https://wikipedia.org/article/...)';
      default:
        return '';
    }
  };

  if (sessionLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <LoadingSpinner message="Initializing session..." />
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Session Error</h1>
          <p className="text-gray-600 mb-4">{sessionError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Refresh Page
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-40 px-8 lg:px-40">
      <h1 className="text-4xl font-bold mb-3 text-center">Quiz Anything</h1>
      <p className="text-xl mb-6 text-center">Make a quiz about any topic, YouTube video, or URL</p>
      
      <TabSelector activeTab={tab} onTabChange={setTab} />
      
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-2 lg:flex">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={getInputValue()}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border-indigo-500 rounded mb-4 thin-border"
            disabled={isLoading}
          />
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !getInputValue().trim()}
            className="flex justify-center items-center w-full h-full text-lg font-bold text-white bg-indigo-500 border-4 border-indigo-500 py-4 px-16 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
          >
            {isLoading ? (
              <LoadingSpinner message="Building your quiz! This may take a sec..." />
            ) : (
              'Start Quiz'
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default HomePage; 