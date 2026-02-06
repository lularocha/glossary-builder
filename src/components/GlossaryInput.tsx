import React, { useState } from 'react';
import type { GlossaryInput as GlossaryInputData } from '../types/glossary';

interface GlossaryInputProps {
  onGenerate: (data: GlossaryInputData) => void;
  loading?: boolean;
  loadingMessage?: string;
}

export const GlossaryInput: React.FC<GlossaryInputProps> = ({ onGenerate, loading, loadingMessage }) => {
  const [title, setTitle] = useState('');
  const [seedWord, setSeedWord] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seedWord.trim()) {
      onGenerate({
        title: title.trim() || undefined,
        seedWord: seedWord.trim(),
      });
    }
  };

  return (
    <div className="max-w-[900px] mx-auto">
      <p className="text-xl text-black mb-12">
        Build glossaries powered by Claude AI.<br />
        Just enter a single term (Seed Word) and automatically generate 12 related terms with clear definitions. Output is optimized for technical, scientific, and educational contexts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-8">
          <label
            htmlFor="seedWord"
            className="block text-lg font-bold text-black mb-2"
          >
            Seed Word
          </label>
          <input
            type="text"
            id="seedWord"
            value={seedWord}
            onChange={(e) => setSeedWord(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            placeholder="e.g., Neural Network"
            required
          />
          <p className="mt-1 text-sm text-black">
            Enter a technical term or concept to build your glossary around
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="title"
            className="block text-lg font-bold text-black mb-2"
          >
            Glossary Title <span className="text-gray-400 font-semibold">(optional)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            placeholder="e.g., Machine Learning"
          />
          <p className="mt-1 text-sm text-black">
            Give your glossary a descriptive title. This helps Claude understand the context of the Seed Word.
          </p>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 border-l-4 border-black pl-4">
            <div className="flex items-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-black font-medium">
                {loadingMessage || 'Processing...'}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!seedWord.trim()}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] mt-8 mb-8"
        >
          Generate Glossary
        </button>
      </form>
    </div>
  );
};
