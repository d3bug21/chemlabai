
import React from 'react';
import type { ReactionResult } from '../types';

interface ResultDisplayProps {
  result: ReactionResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    <p className="mt-4 text-lg font-semibold">Simulating Reaction...</p>
    <p className="text-sm">Gemini is analyzing the reactants. Please wait.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-8 bg-red-900/20 rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
    <p className="text-sm">{message}</p>
  </div>
);

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
    <p className="mt-4 text-lg font-semibold">Lab is Ready</p>
    <p className="text-sm">Your experiment results will appear here.</p>
  </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!result) return <InitialState />;

  return (
    <div className="space-y-6 animate-fade-in">
      {result.image && (
        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Generated Image</h3>
          <img
            src={result.image}
            alt="Generated chemical reaction"
            className="w-full rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      )}
      {result.text && (
        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">Explanation</h3>
          <div className="p-4 bg-gray-900/70 rounded-lg border border-gray-700 text-gray-300 whitespace-pre-wrap leading-relaxed">
            <p>{result.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
