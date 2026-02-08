import { useState, useEffect } from 'react';
import { GlossaryInput } from './components/GlossaryInput';
import { GlossaryDisplay } from './components/GlossaryDisplay';
import { LanguageToggle } from './components/LanguageToggle';
import type { Glossary, GlossaryInput as GlossaryInputType } from './types/glossary';
import { DEFAULT_TRANSLATIONS } from './types/glossary';
import { generateGlossary, expandTerm } from './utils/claudeApi';
import { saveGlossary, loadGlossary, clearStorage } from './utils/storage';
import { Document, Packer, Paragraph, TextRun, ExternalHyperlink, Header, Footer, PageNumber, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { useLanguage } from './i18n';

function App() {
  const { t: ui } = useLanguage();
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
    setLoadingMessage(ui.generatingGlossary);
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

    const t = glossary.translations || DEFAULT_TRANSLATIONS;

    let content = `# ${glossary.title ? `${glossary.seedWord}: ${glossary.title}` : glossary.seedWord}\n\n`;

    if (glossary.description) {
      content += `${glossary.description}\n\n`;
    }

    content += `${t.seedWord} ${glossary.seedWord}\n\n`;
    content += `${t.totalTerms} ${glossary.terms.length}\n\n`;
    content += `---\n\n`;

    // Add all terms
    glossary.terms.forEach((term, index) => {
      content += `## ${term.term}\n\n`;
      content += `${term.definition}\n\n`;

      // Include expanded content if available
      if (term.expandedContent) {
        term.expandedContent.paragraphs.forEach((paragraph) => {
          content += `${paragraph}\n\n`;
        });

        // Include sources
        if (term.expandedContent.sources.length > 0) {
          content += `**${t.sources}:**\n`;
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
          content += `\n*${t.linksDisclaimer}*\n\n`;
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

    // Format filename: "SeedWord.md" or "SeedWord_Title.md"
    const filename = glossary.title
      ? `${glossary.seedWord}_${glossary.title}.md`
      : `${glossary.seedWord}.md`;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleExportDocx = async () => {
    if (!glossary) return;

    const t = glossary.translations || DEFAULT_TRANSLATIONS;

    // Font sizes in half-points: 24pt=48, 14pt=28, 13pt=26, 12pt=24
    const TITLE_SIZE = 48;    // 24pt
    const HEADING_SIZE = 28;  // 14pt
    const BODY_SIZE = 26;     // 13pt
    const SMALL_SIZE = 24;    // 12pt

    const children: Paragraph[] = [];

    // Title (H1) - Arial, Black, 24pt, bold
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: glossary.title ? `${glossary.seedWord}: ${glossary.title}` : glossary.seedWord,
            font: 'Arial',
            bold: true,
            size: TITLE_SIZE,
            color: '000000',
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // Description
    if (glossary.description) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: glossary.description,
              size: BODY_SIZE,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Seed Word
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${t.seedWord} ${glossary.seedWord}`,
            size: BODY_SIZE,
          }),
        ],
        spacing: { after: 100 },
      })
    );

    // Total Terms
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${t.totalTerms} ${glossary.terms.length}`,
            size: BODY_SIZE,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // Horizontal line (simulated with underscores)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '_______________________________________________',
            size: BODY_SIZE,
          }),
        ],
        spacing: { after: 200 },
      })
    );

    // Add all terms
    glossary.terms.forEach((term, index) => {
      // Term heading (H2) - Arial, Black, 16pt, bold
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: term.term,
              font: 'Arial',
              bold: true,
              size: HEADING_SIZE,
              color: '000000',
            }),
          ],
          spacing: { before: 300, after: 100 },
        })
      );

      // Definition
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: term.definition,
              size: BODY_SIZE,
            }),
          ],
          spacing: { after: 200 },
        })
      );

      // Expanded content if available
      if (term.expandedContent) {
        term.expandedContent.paragraphs.forEach((paragraph) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: BODY_SIZE,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        });

        // Sources with hyperlinks
        if (term.expandedContent.sources.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${t.sources}:`,
                  bold: true,
                  size: BODY_SIZE,
                }),
              ],
              spacing: { before: 100, after: 100 },
            })
          );

          term.expandedContent.sources.forEach((source) => {
            const bulletChildren: (TextRun | ExternalHyperlink)[] = [
              new TextRun({ text: '• ', size: BODY_SIZE }),
            ];

            if (source.url) {
              bulletChildren.push(
                new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: source.name,
                      style: 'Hyperlink',
                      size: BODY_SIZE,
                    }),
                  ],
                  link: source.url,
                })
              );
            } else {
              bulletChildren.push(new TextRun({ text: source.name, size: BODY_SIZE }));
            }

            if (source.description) {
              bulletChildren.push(new TextRun({ text: ` - ${source.description}`, size: BODY_SIZE }));
            }

            children.push(
              new Paragraph({
                children: bulletChildren,
                spacing: { after: 50 },
              })
            );
          });

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: t.linksDisclaimer,
                  italics: true,
                  size: SMALL_SIZE,
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      }

    });

    // Header text: "GLOSSARY BUILDER: SEEDWORD" if no title, or "GLOSSARY BUILDER: SEEDWORD: TITLE" if title provided
    const headerText = glossary.title
      ? `${ui.glossaryBuilder}: ${glossary.seedWord.toUpperCase()}: ${glossary.title.toUpperCase()}`
      : `${ui.glossaryBuilder}: ${glossary.seedWord.toUpperCase()}`;

    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: headerText,
                      size: 18, // 9pt
                      color: '000000',
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: 20, // 10pt
                      color: '000000',
                    }),
                  ],
                }),
              ],
            }),
          },
          children: children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    // Format filename: "SeedWord.docx" or "SeedWord_Title.docx"
    const filename = glossary.title
      ? `${glossary.seedWord}_${glossary.title}.docx`
      : `${glossary.seedWord}.docx`;
    saveAs(blob, filename);
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
        glossary.seedWord,
        glossary.detectedLanguage
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
          <div className="max-w-[760px] mx-auto px-4 lg:px-0 py-3 flex items-center justify-between gap-4">
            <p className="text-black text-sm md:text-base flex-1">
              {glossary.translations?.downloadReminder || DEFAULT_TRANSLATIONS.downloadReminder}
              <br />
              {glossary.translations?.downloadReminderLoss || DEFAULT_TRANSLATIONS.downloadReminderLoss}
            </p>
            <button
              onClick={() => setShowReminder(false)}
              className="text-black hover:text-gray-700 transition-colors flex-shrink-0"
              aria-label={ui.closeReminder}
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
        <header className={`max-w-[760px] mx-auto ${glossary ? 'mb-20' : 'mb-5'} flex justify-between items-start md:items-center`}>
          <h1 className={`tool-title font-bold text-black ${glossary ? 'text-2xl' : 'text-3xl md:text-5xl'}`}>
            {ui.appTitle}
          </h1>

          {/* Language Toggle - Only on input page */}
          {!glossary && <LanguageToggle className="mt-[6px] md:mt-0" />}

          {/* Action Buttons - only show when glossary exists */}
          {glossary && (
            <>
              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-3">
                <button
                  onClick={handleReset}
                  className="bg-orange-400 hover:bg-orange-600 text-white font-medium text-sm py-1.5 px-3 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <ArrowLeft size={18} />
                  {ui.new}
                </button>
                <button
                  onClick={handleCopy}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-1.5 px-3 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <Copy size={18} />
                  {copied ? ui.copied : ui.copy}
                </button>
                <button
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-1.5 px-3 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <Download size={18} />
                  {ui.mdFile}
                </button>
                <button
                  onClick={handleExportDocx}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-1.5 px-3 rounded-md transition duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <Download size={18} />
                  {ui.docxFile}
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
              className={`absolute top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-out ${
                menuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              style={{ backgroundColor: 'var(--dark-gray)' }}
            >
              <div className="p-4">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="mb-6 p-2 text-white"
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
                    className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    {ui.new}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
                  >
                    <Copy size={20} />
                    {copied ? ui.copied : ui.copy}
                  </button>
                  <button
                    onClick={handleExport}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
                  >
                    <Download size={20} />
                    {ui.mdFile}
                  </button>
                  <button
                    onClick={handleExportDocx}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 flex items-center gap-2"
                  >
                    <Download size={20} />
                    {ui.docxFile}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-[760px] mx-auto mb-6 border-l-4 border-black pl-4">
            <p className="text-black font-medium">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <main>
          {!glossary ? (
            <GlossaryInput
              onGenerate={handleGenerate}
              loading={loading}
              loadingMessage={loadingMessage}
            />
          ) : (
            <GlossaryDisplay
              glossary={glossary}
              onExpandTerm={handleExpandTerm}
              expandingTermIndex={expandingTermIndex}
              translations={glossary.translations || DEFAULT_TRANSLATIONS}
            />
          )}
        </main>

        <footer className="max-w-[760px] mx-auto py-4 text-sm text-left text-black">
          {ui.createdBy}<br />
          <span className="text-[#f90]">{ui.lastUpdate}</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
