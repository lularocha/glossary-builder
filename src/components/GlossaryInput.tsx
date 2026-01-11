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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Glossary Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="e.g., Machine Learning Glossary"
          />
          <p className="mt-1 text-sm text-gray-500">
            Give your glossary a descriptive title
          </p>
        </div>

        <div>
          <label
            htmlFor="seedWord"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Seed Word <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="seedWord"
            value={seedWord}
            onChange={(e) => setSeedWord(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="e.g., neural network"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a technical term or concept to build your glossary around
          </p>
        </div>

        <button
          type="submit"
          disabled={!seedWord.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Generate Glossary
        </button>
      </form>
    </div>
  );
};
