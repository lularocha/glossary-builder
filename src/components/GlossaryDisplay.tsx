import React, { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="max-w-[900px] pb-8 border-b border-gray-300">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-3 text-black">
            {glossary.title || 'Glossary'}
          </h1>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={onReset}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
              Start New
            </button>
            <button
              onClick={onExport}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
              Download
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-black"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {glossary.description && (
          <p className="text-black text-lg">{glossary.description}</p>
        )}
        <p className="mt-2 text-sm text-[#f90]">Latest update: January 23, 2026</p>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4">
            <button
              onClick={() => setMenuOpen(false)}
              className="mb-6 p-2 text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  onReset();
                  setMenuOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
                Start New
              </button>
              <button
                onClick={() => {
                  onExport();
                  setMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
                Download
              </button>
            </div>
          </div>
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
                <div className="related-terms hidden">
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
    </div>
  );
};
