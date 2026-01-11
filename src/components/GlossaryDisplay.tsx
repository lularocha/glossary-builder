import React, { useState } from 'react';
import type { Glossary } from '../types/glossary';

interface GlossaryDisplayProps {
  glossary: Glossary;
  onAddMore: () => void;
  onExport: () => void;
  onLearnMore: (termName: string) => void;
  termDetails: Map<string, string>;
  loading: boolean;
}

export const GlossaryDisplay: React.FC<GlossaryDisplayProps> = ({
  glossary,
  onAddMore,
  onExport,
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">
          {glossary.title || 'Glossary'}
        </h1>
        {glossary.description && (
          <p className="text-blue-100 text-lg">{glossary.description}</p>
        )}
        <div className="mt-4 text-sm text-blue-200">
          {glossary.terms.length} {glossary.terms.length === 1 ? 'term' : 'terms'}
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {glossary.terms.map((term, index) => (
          <div
            key={`${term.term}-${index}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              {/* Term Header */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {term.term}
              </h2>

              {/* Definition */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {term.definition}
              </p>

              {/* Importance Score */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Importance:
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i < term.importance
                            ? 'bg-blue-600'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                      {term.importance}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Terms */}
              {term.relatedTerms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Related Terms:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((relatedTerm, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {relatedTerm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Detail Content */}
              {isExpanded(term.term) && termDetails.has(term.term) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: termDetails.get(term.term)!.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              )}

              {/* Learn More Button */}
              <button
                onClick={() => toggleTerm(term.term)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
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
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onAddMore}
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
