import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex space-x-1">
        <span className={`block w-3 h-3 rounded-full bg-indigo-500 animate-bounce`}></span>
        <span className={`block w-3 h-3 rounded-full bg-indigo-500 animate-bounce`} style={{ animationDelay: '0.1s' }}></span>
        <span className={`block w-3 h-3 rounded-full bg-indigo-500 animate-bounce`} style={{ animationDelay: '0.2s' }}></span>
      </div>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      )}
    </div>
  );
}; 