import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";
import { useLanguage } from "../i18n";
import rulesContentEn from "../content/GLOSSARY_RULES.display.md?raw";
import rulesContentPt from "../content/GLOSSARY_RULES.display.pt.md?raw";

interface GlossaryRulesModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

export const GlossaryRulesModal: React.FC<GlossaryRulesModalProps> = ({
  open,
  onClose,
  title,
}) => {
  const { language } = useLanguage();
  const rulesContent = language === "pt" ? rulesContentPt : rulesContentEn;

  // Close on Escape and lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-[var(--bg-input)] rounded-lg shadow-xl w-full max-w-[760px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b-8 border-[#FE0] flex-shrink-0">
          <h2 className="glossary-title text-xl font-bold text-black">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Markdown Body */}
        <div className="overflow-y-auto px-8 py-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="glossary-title text-3xl font-bold text-black mb-4 mt-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-black mb-3 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-black mb-2 mt-6">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-base font-semibold text-black mb-2 mt-4">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="text-black leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-1 text-black leading-relaxed">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-1 text-black leading-relaxed">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-black">{children}</strong>
              ),
              hr: () => <hr className="border-t border-gray-300 my-8" />,
              code: ({ className, children }) => {
                const isBlock = /language-/.test(className || "");
                if (isBlock) {
                  return <code className={className}>{children}</code>;
                }
                return (
                  <code className="bg-gray-100 text-black rounded px-1.5 py-0.5 text-[0.9em] font-mono">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 text-black rounded-md p-4 mb-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm text-left border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b-2 border-gray-300">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="font-semibold text-black py-2 pr-4 align-top">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-black py-2 pr-4 align-top border-b border-gray-200">
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="pl-4 border-l-2 border-gray-300 text-black italic mb-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {rulesContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
