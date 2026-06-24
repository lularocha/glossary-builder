import React, { useEffect, useState } from "react";
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
  const { language, t: ui } = useLanguage();
  const rulesContent = language === "pt" ? rulesContentPt : rulesContentEn;

  // Drives the slide transition: false = off-screen (below), true = in place.
  const [entered, setEntered] = useState(false);

  // Slide in on the frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Start the slide-out; the real unmount happens on the panel's transitionend.
  const handleClose = () => setEntered(false);

  // Close on Escape and lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEntered(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative bg-[var(--bg-input)] rounded-lg shadow-xl w-full max-w-[760px] max-h-[90dvh] flex flex-col transform transition-transform duration-300 ease-out ${
          entered ? "translate-y-0" : "translate-y-full"
        }`}
        onTransitionEnd={(e) => {
          // Only the panel's own slide-out unmounts the modal.
          if (e.target === e.currentTarget && !entered) onClose();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b-8 border-[#FE0] flex-shrink-0">
          <h2 className="glossary-title text-xl font-bold text-black">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Markdown Body */}
        <div className="overflow-y-auto px-8 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="glossary-title text-3xl font-bold text-black mb-4 mt-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[26px] font-bold text-[#F80] tracking-[-0.03em] leading-[1.15] mb-3 mt-8">
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
                // Fenced blocks here have no language, so also treat any
                // multi-line content as a block (inline code never wraps lines).
                const isBlock =
                  /language-/.test(className || "") ||
                  String(children).includes("\n");
                if (isBlock) {
                  return <code className={className}>{children}</code>;
                }
                return (
                  <code className="bg-gray-100 text-black rounded px-1.5 py-0.5 text-[0.9em] font-mono break-words">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 text-black rounded-md p-4 mb-4 whitespace-pre-wrap break-words text-sm font-mono leading-relaxed">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b-2 border-gray-300">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="font-semibold text-black py-2 pr-2 sm:pr-4 align-top break-words">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-black py-2 pr-2 sm:pr-4 align-top border-b border-gray-200 break-words">
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

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-4 text-left text-[14px] text-black">
            {ui.developedBy}
            <a
              href="https://sugiro.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 500, color: "#f80" }}
            >
              sugiro.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
