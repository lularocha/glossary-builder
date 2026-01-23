import { useState, useEffect } from 'react';
import { GlossaryInput } from './components/GlossaryInput';
import { GlossaryDisplay } from './components/GlossaryDisplay';
import type { Glossary, GlossaryInput as GlossaryInputType } from './types/glossary';
import { generateGlossary } from './utils/claudeApi';
import { saveGlossary, loadGlossary, clearStorage } from './utils/storage';

function App() {
  const [glossary, setGlossary] = useState<Glossary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate glossary';
      setError(errorMessage);
      console.error('Error generating glossary:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleExport = () => {
    if (!glossary) return;

    // Generate markdown content
    let markdown = `# ${glossary.title || 'Glossary'}\n\n`;

    if (glossary.description) {
      markdown += `${glossary.description}\n\n`;
    }

    markdown += `**Seed Word:** ${glossary.seedWord}\n\n`;
    markdown += `**Total Terms:** ${glossary.terms.length}\n\n`;
    markdown += `---\n\n`;

    // Add all terms
    glossary.terms.forEach((term, index) => {
      markdown += `## ${index + 1}. ${term.term}\n\n`;
      markdown += `**Definition:** ${term.definition}\n\n`;
      markdown += `**Importance:** ${term.importance}/10\n\n`;

      if (term.relatedTerms.length > 0) {
        markdown += `**Related Terms:** ${term.relatedTerms.join(', ')}\n\n`;
      }

      markdown += `---\n\n`;
    });

    // Create download link
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${glossary.title || 'glossary'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleReset = () => {
    setGlossary(null);
    setError('');
    clearStorage();
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-4 flex justify-between items-start">
          <h1 className="text-3xl md:text-5xl font-bold text-black">
            Glossary Builder
          </h1>

          {/* Action Buttons - only show when glossary exists */}
          {glossary && (
            <>
              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
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
            </>
          )}
        </header>

        <p className="text-xl text-black mb-12">
          Build comprehensive glossaries powered by Claude AI
        </p>

        {/* Mobile Slide Menu */}
        {glossary && (
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
                    onClick={handleReset}
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
          <div className="mb-6 border-l-4 border-black pl-4">
            <p className="text-black font-medium">{error}</p>
          </div>
        )}

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
            <GlossaryDisplay glossary={glossary} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
