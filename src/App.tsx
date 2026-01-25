import { useState, useEffect } from 'react';
import { GlossaryInput } from './components/GlossaryInput';
import { GlossaryDisplay } from './components/GlossaryDisplay';
import type { Glossary, GlossaryInput as GlossaryInputType } from './types/glossary';
import { generateGlossary, expandTerm } from './utils/claudeApi';
import { saveGlossary, loadGlossary, clearStorage } from './utils/storage';

function App() {
  const [glossary, setGlossary] = useState<Glossary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [expandingTermIndex, setExpandingTermIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedGlossary = loadGlossary();
    if (savedGlossary) {
      setGlossary(savedGlossary);
    }
  }, []);

  // Auto-save glossary whenever it changes
  useEffect(() => {
    saveGlossary(glossary);
  }, [glossary]);

  const handleGenerate = async (input: GlossaryInputType) => {
    setLoading(true);
    setLoadingMessage('Generating glossary with 12 terms...');
    setError('');

    try {
      const newGlossary = await generateGlossary(input.title, input.seedWord);
      setGlossary(newGlossary);
      setShowReminder(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate glossary';
      setError(errorMessage);
      console.error('Error generating glossary:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  // Helper function to convert text to Title Case
  const toTitleCase = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Generate markdown formatted content
  const getFormattedContent = () => {
    if (!glossary) return '';

    let content = `# ${glossary.title || glossary.seedWord}\n\n`;

    if (glossary.description) {
      content += `${glossary.description}\n\n`;
    }

    content += `Seed Word: ${glossary.seedWord}\n\n`;
    content += `Total Terms: ${glossary.terms.length}\n\n`;
    content += `---\n\n`;

    // Add all terms
    glossary.terms.forEach((term, index) => {
      content += `## ${index + 1}. ${term.term}\n\n`;
      content += `${term.definition}\n\n`;

      // Include expanded content if available
      if (term.expandedContent) {
        term.expandedContent.paragraphs.forEach((paragraph) => {
          content += `${paragraph}\n\n`;
        });

        // Include sources
        if (term.expandedContent.sources.length > 0) {
          content += `**Sources:**\n`;
          term.expandedContent.sources.forEach((source) => {
            if (source.url) {
              content += `- [${source.name}](${source.url})`;
            } else {
              content += `- ${source.name}`;
            }
            if (source.description) {
              content += ` - ${source.description}`;
            }
            content += `\n`;
          });
          content += `\n*Links verified at time of generation. External sites may change.*\n\n`;
        }
      }

      content += `---\n\n`;
    });

    return content;
  };

  const handleCopy = async () => {
    if (!glossary) return;
    const content = getFormattedContent();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const handleExport = () => {
    if (!glossary) return;

    const content = getFormattedContent();

    // Create download link with .md format
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Format filename as "Title Glossary.md" with proper capitalization and spaces
    const baseTitle = glossary.title || glossary.seedWord;
    const formattedTitle = toTitleCase(baseTitle);
    link.download = `${formattedTitle} Glossary.md`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleReset = () => {
    setGlossary(null);
    setError('');
    setShowReminder(false);
    clearStorage();
    setMenuOpen(false);
  };

  const handleExpandTerm = async (termIndex: number) => {
    if (!glossary) return;

    const term = glossary.terms[termIndex];

    // Toggle off if already expanded
    if (term.expanded) {
      const updatedTerms = [...glossary.terms];
      updatedTerms[termIndex] = { ...term, expanded: false };
      setGlossary({ ...glossary, terms: updatedTerms });
      return;
    }

    // If content already cached, just toggle on
    if (term.expandedContent) {
      const updatedTerms = [...glossary.terms];
      updatedTerms[termIndex] = { ...term, expanded: true };
      setGlossary({ ...glossary, terms: updatedTerms });
      return;
    }

    // Fetch new content
    setExpandingTermIndex(termIndex);
    setError('');

    try {
      const expandedContent = await expandTerm(
        term.term,
        term.definition,
        glossary.title,
        glossary.seedWord
      );

      const updatedTerms = [...glossary.terms];
      updatedTerms[termIndex] = {
        ...term,
        expanded: true,
        expandedContent,
      };
      setGlossary({ ...glossary, terms: updatedTerms });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load more info for "${term.term}"`;
      setError(errorMessage);
      console.error('Error expanding term:', err);
    } finally {
      setExpandingTermIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Reminder Banner */}
      {glossary && showReminder && (
        <div className="w-full bg-yellow-100/70 mb-4">
          <div className="max-w-[900px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-black text-sm md:text-base flex-1">
              Don't forget to download your glossary!<br />
              Your generated glossary will be lost if you hit the "Start New" button or exit this page.
            </p>
            <button
              onClick={() => setShowReminder(false)}
              className="text-black hover:text-gray-700 transition-colors flex-shrink-0"
              aria-label="Close reminder"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto px-4 pt-3 pb-8 md:pt-8">
        {/* Header */}
        <header className="max-w-[900px] mx-auto mb-20 flex justify-between items-center">
          <h1 className="tool-title text-4xl md:text-5xl font-bold text-black">
            Glossary Builder
          </h1>

          {/* Action Buttons - only show when glossary exists */}
          {glossary && (
            <>
              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={handleReset}
                  className="bg-orange-400 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
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
                  onClick={handleCopy}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
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
                className="md:hidden p-2 text-black -mt-1"
              >
                <svg
                  className="w-9 h-9"
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
            </>
          )}
        </header>

        {/* Mobile Slide Menu */}
        {glossary && (
          <div
            className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
              menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide Panel */}
            <div
              className={`absolute top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-out ${
                menuOpen ? 'translate-x-0' : '-translate-x-full'
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
                    onClick={handleReset}
                    className="bg-orange-400 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
                    onClick={handleCopy}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleExport}
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
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-[900px] mx-auto mb-6 border-l-4 border-black pl-4">
            <p className="text-black font-medium">{error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="max-w-[900px] mx-auto mb-6 border-l-4 border-black pl-4">
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

        {/* Main Content */}
        <main>
          {!glossary ? (
            <GlossaryInput onGenerate={handleGenerate} />
          ) : (
            <GlossaryDisplay
              glossary={glossary}
              onExpandTerm={handleExpandTerm}
              expandingTermIndex={expandingTermIndex}
            />
          )}
        </main>

        <footer className="max-w-[900px] mx-auto py-4 text-sm text-left text-black">
          Created by Lula Rocha + Claude<br />
          <span className="text-[#f90]">Latest update: January 25, 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
