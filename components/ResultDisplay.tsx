import React, { useState, useEffect, useRef } from 'react';
import type { ReactionResult } from '../types';
import { textToSpeech, isElevenLabsConfigured } from '../services/elevenlabsService';

interface ResultDisplayProps {
  result: ReactionResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
    <p className="mt-4 text-lg font-semibold">Simulating Reaction...</p>
    <ul className="mt-3 text-sm space-y-1.5 text-gray-500">
      <li className="animate-pulse" style={{ animationDelay: '0s' }}>🔬 Analyzing reactants...</li>
      <li className="animate-pulse" style={{ animationDelay: '0.5s' }}>🔄 Simulating chemical bonds...</li>
      <li className="animate-pulse" style={{ animationDelay: '1s' }}>🎨 Rendering photorealistic result...</li>
      <li className="animate-pulse" style={{ animationDelay: '1.5s' }}>✍️ Composing educational explanation...</li>
    </ul>
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

const FormattedExplanation: React.FC<{ text: string }> = ({ text }) => {
  try {
    const sections = text.split('**').filter(s => s.trim() !== '');

    if (sections.length === 0 || sections.length % 2 !== 0) {
      return <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>;
    }

    const content: { title: string; content: string }[] = [];
    for (let i = 0; i < sections.length; i += 2) {
      content.push({
        title: sections[i].replace(':', '').trim(),
        content: sections[i + 1].trim(),
      });
    }

    return (
      <div className="space-y-4">
        {content.map(({ title, content }) => {
          const isList = content.startsWith('-');
          return (
            <div key={title}>
              <h4 className="font-semibold text-purple-300 text-lg">{title}</h4>
              {isList ? (
                <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                  {content.split('\n').map((item, index) => {
                    const trimmedItem = item.trim().replace(/^- /, '');
                    return trimmedItem ? <li key={index} className="text-gray-300 leading-relaxed">{trimmedItem}</li> : null;
                  })}
                </ul>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed mt-1">{content}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Failed to parse explanation:", error);
    return <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{text}</p>;
  }
};

const AudioButton: React.FC<{ text: string }> = ({ text }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, []);

    if (!isElevenLabsConfigured) {
        return (
            <div className="relative group">
                <button
                    disabled
                    className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Audio explanation unavailable"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-medium text-white bg-gray-900/90 border border-gray-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    role="tooltip">
                    ElevenLabs API key not configured. Audio is unavailable.
                </div>
            </div>
        );
    }

    const handlePlay = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        setIsFetching(true);
        try {
            const audioBlob = await textToSpeech(text);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            
            audio.onended = () => {
                setIsPlaying(false);
            };

            audio.play();
            setIsPlaying(true);
        } catch (error: unknown) {
            console.error("Failed to fetch audio:", error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            alert(`Could not generate audio: ${message}`);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <button
            onClick={handlePlay}
            disabled={isFetching}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
            aria-label={isPlaying ? "Pause explanation" : "Listen to explanation"}
        >
            {isFetching ? (
                <svg className="animate-spin h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
};

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-200">Educational Explanation</h3>
            <AudioButton text={result.text} />
          </div>
          <div className="p-4 bg-gray-900/70 rounded-lg border border-gray-700">
            <FormattedExplanation text={result.text} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;