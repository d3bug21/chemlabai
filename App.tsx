
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptControls from './components/PromptControls';
import ResultDisplay from './components/ResultDisplay';
import { generateReaction } from './services/geminiService';
import type { ReactionResult } from './types';

const App: React.FC = () => {
  const [reactant1, setReactant1] = useState<File | null>(null);
  const [reactant2, setReactant2] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("Combine these to create a new material and explain the chemical reaction.");
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReaction = useCallback(async () => {
    if (!reactant1 || !reactant2 || !prompt.trim()) {
      setError("Please provide two reactant images and a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const reactionResult = await generateReaction(reactant1, reactant2, prompt);
      setResult(reactionResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Gemini API Error:", errorMessage);
      setError(`Failed to generate reaction: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [reactant1, reactant2, prompt]);

  const resetState = () => {
    setReactant1(null);
    setReactant2(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <Header />

        <main className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Inputs Section */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl shadow-blue-500/10">
              <h2 className="text-2xl font-bold text-blue-300 mb-6 border-b border-gray-700 pb-3">1. Add Reactants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ImageUploader
                  id="reactant1"
                  label="Reactant 1"
                  image={reactant1}
                  onImageChange={setReactant1}
                  disabled={isLoading}
                />
                <ImageUploader
                  id="reactant2"
                  label="Reactant 2"
                  image={reactant2}
                  onImageChange={setReactant2}
                  disabled={isLoading}
                />
              </div>

              <h2 className="text-2xl font-bold text-blue-300 mt-8 mb-6 border-b border-gray-700 pb-3">2. Define Reaction</h2>
              <PromptControls
                prompt={prompt}
                onPromptChange={setPrompt}
                onSubmit={handleReaction}
                onReset={resetState}
                isLoading={isLoading}
              />
            </div>

            {/* Results Section */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl shadow-purple-500/10 min-h-[300px]">
               <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-gray-700 pb-3">3. Observe Result</h2>
               <ResultDisplay
                  result={result}
                  isLoading={isLoading}
                  error={error}
               />
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>ChemLab AI | Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
