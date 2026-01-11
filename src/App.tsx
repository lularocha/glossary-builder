import { useState } from 'react';
import { GlossaryInput } from './components/GlossaryInput';
import { GlossaryDisplay } from './components/GlossaryDisplay';
import type { Glossary, GlossaryInput as GlossaryInputType } from './types/glossary';
import { generateGlossary, expandTerms, expandTermDetail } from './utils/claudeApi';

function App() {
  const [glossary, setGlossary] = useState<Glossary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [termDetails, setTermDetails] = useState<Map<string, string>>(new Map());

  const handleGenerate = async (input: GlossaryInputType) => {
    setLoading(true);
    setLoadingMessage('Generating glossary with 10 terms...');
    setError('');

    try {
      const newGlossary = await generateGlossary(input.title, input.seedWord);
      setGlossary(newGlossary);
      setTermDetails(new Map()); // Reset term details for new glossary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate glossary';
      setError(errorMessage);
      console.error('Error generating glossary:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleAddMore = async () => {
    if (!glossary) return;

    setLoading(true);
    setLoadingMessage('Generating 10 more terms...');
    setError('');

    try {
      const newTerms = await expandTerms(glossary);

      // Update the glossary with new terms
      const updatedGlossary: Glossary = {
        ...glossary,
        terms: [...glossary.terms, ...newTerms],
        updatedAt: new Date(),
      };

      setGlossary(updatedGlossary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add more terms';
      setError(errorMessage);
      console.error('Error expanding glossary:', err);
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
  };

  const handleLearnMore = async (termName: string) => {
    if (!glossary) return;

    // Check if we already have details for this term
    if (termDetails.has(termName)) {
      return; // Already loaded
    }

    setLoading(true);
    setLoadingMessage(`Loading details for "${termName}"...`);
    setError('');

    try {
      // Find the term in the glossary
      const term = glossary.terms.find((t) => t.term === termName);
      if (!term) {
        throw new Error('Term not found in glossary');
      }

      const detailedContent = await expandTermDetail(term, {
        title: glossary.title,
        seedWord: glossary.seedWord,
      });

      // Update the termDetails map with the new content
      setTermDetails(new Map(termDetails.set(termName, detailedContent)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load term details';
      setError(errorMessage);
      console.error('Error expanding term detail:', err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setGlossary(null);
    setError('');
    setTermDetails(new Map());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-5xl font-bold text-gray-900">
              Glossary Builder
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Build comprehensive glossaries powered by Claude AI
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="max-w-2xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
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
              <p className="text-blue-800 font-medium">
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
            <>
              <div className="mb-6 text-center">
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mx-auto transition-colors"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Start New Glossary
                </button>
              </div>
              <GlossaryDisplay
                glossary={glossary}
                onAddMore={handleAddMore}
                onExport={handleExport}
                onLearnMore={handleLearnMore}
                termDetails={termDetails}
                loading={loading}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
