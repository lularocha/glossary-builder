import React from 'react';
import type { Glossary, Translations } from '../types/glossary';
import { DEFAULT_TRANSLATIONS } from '../types/glossary';
import { ScrollToTopButton } from './ScrollToTopButton';
import { useLanguage } from '../i18n';

interface GlossaryDisplayProps {
  glossary: Glossary;
  onExpandTerm: (termIndex: number) => Promise<void>;
  expandingTermIndex: number | null;
  translations?: Translations;
}

export const GlossaryDisplay: React.FC<GlossaryDisplayProps> = ({
  glossary,
  onExpandTerm,
  expandingTermIndex,
  translations = DEFAULT_TRANSLATIONS,
}) => {
  const { t: ui } = useLanguage();
  const t = translations;
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="max-w-[760px] mx-auto pb-8 border-b border-gray-300">
        <p className="text-sm uppercase font-semibold mb-2" style={{ color: 'var(--color-orange-400)' }}>{t.generatedGlossary}</p>
        <h1 className="glossary-title text-[2.5rem] font-bold mb-3 text-black">
          {glossary.title ? `${glossary.seedWord}: ${glossary.title}` : glossary.seedWord}
        </h1>
        {glossary.description && (
          <p className="text-black text-lg">{glossary.description}</p>
        )}
      </div>

      {/* Terms List */}
      <div className="max-w-[760px] mx-auto">
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
              <p className="text-black leading-relaxed mb-4 whitespace-pre-line">
                {term.definition}
              </p>

              {/* Learn More Button */}
              <button
                onClick={() => onExpandTerm(index)}
                disabled={expandingTermIndex === index}
                className="text-black hover:text-gray-600 font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {expandingTermIndex === index ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    {ui.loading}
                  </>
                ) : term.expanded ? (
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
                    {t.showLess}
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
                    {t.learnMore}
                  </>
                )}
              </button>

              {/* Expanded Content */}
              {term.expanded && term.expandedContent && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200">
                  {/* Additional Paragraphs */}
                  <div className="space-y-3 mb-4">
                    {term.expandedContent.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-black leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Related Terms */}
                  {term.relatedTerms.length > 0 && (
                    <p className="text-black mb-4">
                      <span className="font-semibold">{t.relatedTerms}</span>{' '}
                      {term.relatedTerms.join(', ')}
                    </p>
                  )}

                  {/* Sources Section */}
                  {term.expandedContent.sources.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-black mb-2">{t.sources}</h4>
                      <ul className="space-y-1">
                        {term.expandedContent.sources.map((source, sIdx) => (
                          <li key={sIdx} className="text-sm">
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-semibold"
                              >
                                {source.name}
                              </a>
                            ) : (
                              <span className="text-black font-semibold">{source.name}</span>
                            )}
                            {source.description && (
                              <span className="text-black"> - {source.description}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      {/* Disclaimer */}
                      <p className="text-xs text-black mt-2 italic">
                        {t.linksDisclaimer.split('. ')[0]}.
                        <br className="md:hidden" />
                        {' '}{t.linksDisclaimer.split('. ')[1]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};
