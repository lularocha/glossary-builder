import React, { useState } from 'react';
import type { GlossaryInput as GlossaryInputData } from '../types/glossary';

interface GlossaryInputProps {
  onGenerate: (data: GlossaryInputData) => void;
}

export const GlossaryInput: React.FC<GlossaryInputProps> = ({ onGenerate }) => {
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
        Just enter a single term (Seed Word) and automatically generate 12 related terms with clear definitions.
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
            Glossary Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            placeholder="e.g., Machine Learning Glossary"
          />
          <p className="mt-1 text-sm text-black">
            Give your glossary a descriptive title
          </p>
        </div>

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
