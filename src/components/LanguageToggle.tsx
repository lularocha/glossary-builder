import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/strings';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const buttonBase = 'px-2 py-0.5 text-sm font-medium rounded transition-colors text-white';

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
        onClick={() => setLanguage('en')}
        className={getButtonClasses('en')}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pt')}
        className={getButtonClasses('pt')}
        aria-label="Português"
      >
        PT
      </button>
    </div>
  );
};
