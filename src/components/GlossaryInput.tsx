import React, { useState } from 'react';
import type { GlossaryInput as GlossaryInputData } from '../types/glossary';
import { useLanguage } from '../i18n';

interface GlossaryInputProps {
  onGenerate: (data: GlossaryInputData) => void;
  loading?: boolean;
  loadingMessage?: string;
}

export const GlossaryInput: React.FC<GlossaryInputProps> = ({ onGenerate, loading, loadingMessage }) => {
  const { t: ui } = useLanguage();
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
    <div className="max-w-[760px] mx-auto">
      <p
        className="text-xl text-black mb-12"
        dangerouslySetInnerHTML={{ __html: ui.introParagraph }}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-8">
          <label
            htmlFor="seedWord"
            className="block text-lg font-bold text-black mb-2"
          >
            {ui.seedWordLabel}
          </label>
          <input
            type="text"
            id="seedWord"
            value={seedWord}
            onChange={(e) => setSeedWord(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            placeholder={ui.seedWordPlaceholder}
            required
          />
          <p className="mt-1 text-sm text-black">
            {ui.seedWordHelp}
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="title"
            className="block text-lg font-bold text-black mb-2"
          >
            {ui.glossaryTitleLabel} <span className="text-gray-400 font-normal">{ui.optional}</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
            placeholder={ui.titlePlaceholder}
          />
          <p className="mt-1 text-sm text-black">
            {ui.titleHelp}
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
                {loadingMessage || ui.processing}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!seedWord.trim()}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] mt-8 mb-8"
        >
          {ui.generateGlossary}
        </button>
      </form>
    </div>
  );
};
