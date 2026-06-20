import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/strings";

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = "",
}) => {
  const { language, setLanguage } = useLanguage();

  const buttonBase =
    "w-[42px] h-[42px] text-sm font-semibold rounded-full transition-colors text-white flex items-center justify-center";

  const getButtonClasses = (lang: Language) => {
    const isActive = language === lang;
    if (isActive) {
      return `${buttonBase} bg-black`;
    }
    return `${buttonBase} bg-gray-400 hover:bg-gray-600`;
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <button
        onClick={() => setLanguage("pt")}
        className={getButtonClasses("pt")}
        aria-label="Português"
      >
        BR
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={getButtonClasses("en")}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};
