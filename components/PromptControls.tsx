
import React from 'react';

interface PromptControlsProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const PromptControls: React.FC<PromptControlsProps> = ({ prompt, onPromptChange, onSubmit, onReset, isLoading }) => {
  return (
    <div className="flex flex-col space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="e.g., Show the synthesis of water..."
        rows={3}
        className="w-full p-3 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-200 placeholder-gray-500"
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
              <>
                  <LoadingSpinner />
                  Generating...
              </>
          ) : (
             'React'
          )}
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="flex-1 sm:flex-none px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PromptControls;
