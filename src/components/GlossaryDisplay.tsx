import React, { useState } from 'react';
import type { Glossary } from '../types/glossary';

interface GlossaryDisplayProps {
  glossary: Glossary;
  onAddMore: () => void;
  onExport: () => void;
  onReset: () => void;
  onLearnMore: (termName: string) => void;
  termDetails: Map<string, string>;
  loading: boolean;
}

export const GlossaryDisplay: React.FC<GlossaryDisplayProps> = ({
  glossary,
  onAddMore,
  onExport,
  onReset,
  onLearnMore,
  termDetails,
  loading,
}) => {
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const toggleTerm = (termName: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(termName)) {
      newExpanded.delete(termName);
    } else {
      newExpanded.add(termName);
      onLearnMore(termName);
    }
    setExpandedTerms(newExpanded);
  };

  const isExpanded = (termName: string) => expandedTerms.has(termName);

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

              {/* Importance Score - Hidden for review */}
              {/* TODO: Review importance scale UI/UX - see backlog/implementation-plan.md */}
              {/* <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-black">
                    Importance:
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < term.importance
                            ? 'bg-black'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-black">
                      {term.importance}/10
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Related Terms */}
              {term.relatedTerms.length > 0 && (
                <div className="mb-4">
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

              {/* Expanded Detail Content */}
              {isExpanded(term.term) && termDetails.has(term.term) && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div
                    className="prose prose-sm max-w-none text-black"
                    dangerouslySetInnerHTML={{
                      __html: termDetails.get(term.term)!.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              )}

              {/* Learn More Button */}
              <button
                onClick={() => toggleTerm(term.term)}
                className="mt-4 text-black hover:text-gray-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                {isExpanded(term.term) ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    Show Less
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    Learn More
                  </>
                )}
              </button>
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
          onClick={onAddMore}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add 10 More Terms
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
