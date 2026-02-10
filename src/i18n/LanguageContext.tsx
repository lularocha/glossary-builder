import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Language, UIStrings } from "./strings";
import { strings } from "./strings";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: UIStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "glossary-builder-language";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === "pt" ? "pt" : "en") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Sync to localStorage when language changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: strings[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
