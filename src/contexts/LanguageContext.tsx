import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { getLocaleForLanguage, Language, translate } from '../i18n';

const LANGUAGE_STORAGE_KEY = 'quick-manage-language';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage === 'es' || savedLanguage === 'en' ? savedLanguage : 'en';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: (key, params) => translate(language, key, params),
    locale: getLocaleForLanguage(language)
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};
