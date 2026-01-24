import React from 'react';
import type { Glossary } from '../types/glossary';

interface GlossaryDisplayProps {
  glossary: Glossary;
}

export const GlossaryDisplay: React.FC<GlossaryDisplayProps> = ({
  glossary,
}) => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="max-w-[900px] mx-auto pb-8 border-b border-gray-300">
        <p className="text-sm uppercase text-gray-400 font-bold mb-2">Generated glossary</p>
        <h1 className="glossary-title text-[2.5rem] font-bold mb-3 text-black">
          {glossary.title || glossary.seedWord}
        </h1>
        {glossary.description && (
          <p className="text-black text-lg">{glossary.description}</p>
        )}
      </div>

      {/* Terms List */}
      <div className="max-w-[900px] mx-auto">
        {glossary.terms.map((term, index) => (
          <div
            key={`${term.term}-${index}`}
            className="py-6 border-b border-gray-300"
          >
            <div>
              {/* Term Header */}
              <h2 className="text-2xl font-bold text-black mb-3">
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
