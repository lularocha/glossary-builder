import React from 'react';
import type { Glossary } from '../types/glossary';

interface GlossaryDisplayProps {
  glossary: Glossary;
  onExport: () => void;
  onReset: () => void;
}

export const GlossaryDisplay: React.FC<GlossaryDisplayProps> = ({
  glossary,
  onExport,
  onReset,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="max-w-[900px] pb-8 border-b border-gray-300">
        <h1 className="text-3xl font-bold mb-3 text-black">
          {glossary.title || 'Glossary'}
        </h1>
        {glossary.description && (
          <p className="text-black text-lg">{glossary.description}</p>
        )}
        <div className="mt-4 text-sm text-black">
          {glossary.terms.length} {glossary.terms.length === 1 ? 'term' : 'terms'}
        </div>
      </div>

      {/* Terms List */}
      <div className="max-w-[900px]">
        {glossary.terms.map((term, index) => (
          <div
            key={`${term.term}-${index}`}
            className="py-6 border-b border-gray-300"
          >
            <div>
              {/* Term Header */}
              <h2 className="text-2xl font-semibold text-black mb-3">
                {term.term}
              </h2>

              {/* Definition */}
              <p className="text-black leading-relaxed mb-4">
                {term.definition}
              </p>

              {/* Related Terms */}
              {term.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-black mb-2">
                    Related Terms:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((relatedTerm, idx) => (
                      <span
                        key={idx}
                        className="text-black text-sm"
                      >
                        {relatedTerm}{idx < term.relatedTerms.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="max-w-[900px] flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onReset}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Start New Glossary
        </button>
        <button
          onClick={onExport}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export as Markdown
        </button>
      </div>
    </div>
  );
};
