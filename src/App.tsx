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
  };

  const handleReset = () => {
    setGlossary(null);
    setError('');
    clearStorage();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            Glossary Builder
          </h1>
          <p className="text-xl text-black">
            Build comprehensive glossaries powered by Claude AI
          </p>
        </header>

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
            <GlossaryDisplay
              glossary={glossary}
              onExport={handleExport}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
