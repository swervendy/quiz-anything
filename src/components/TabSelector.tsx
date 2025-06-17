import React from 'react';
import { TabType, TabConfig } from '@/types';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabConfigs: TabConfig[] = [
  {
    id: 'topic',
    label: 'Topic',
    placeholder: 'Enter a topic',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    placeholder: 'Enter a YouTube URL',
  },
  {
    id: 'url',
    label: 'URL',
    placeholder: 'Enter a URL',
  },
];

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs mb-4 flex flex-wrap">
      {tabConfigs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 mr-4 rounded flex items-center justify-between transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-400 text-black dark:text-white border border-indigo-500 shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-black dark:hover:text-gray-500 hover:border hover:border-indigo-500 cursor-pointer'
          }`}
        >
          <span className="font-medium">{tab.label}</span>
          {activeTab === tab.id && (
            <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}; 