'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '@/lib/types';
import { translations, type TranslationKey } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Map from ISO country code → platform language */
function countryToLang(countryCode: string): Language {
  if (countryCode === 'IR') return 'fa';
  if (countryCode === 'NL') return 'nl';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with 'en' as the default — SSR-safe
  const [lang, setLangState] = useState<Language>('en');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    // 1. If user has manually chosen a language before, respect that
    const saved = localStorage.getItem('movian-lang') as Language | null;
    if (saved === 'en' || saved === 'fa' || saved === 'nl') {
      setLangState(saved);
      setResolved(true);
      return;
    }

    // 2. No saved preference — auto-detect from IP
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data: { country_code?: string }) => {
        const detected = countryToLang(data.country_code ?? '');
        setLangState(detected);
      })
      .catch(() => {
        // Network error or blocked — stay on English
      })
      .finally(() => {
        setResolved(true);
      });
  }, []);

  /** Called when the user explicitly picks a language */
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('movian-lang', newLang);
    applyToDocument(newLang);
  };

  /** Keep <html> attributes in sync whenever lang changes */
  useEffect(() => {
    if (resolved) {
      applyToDocument(lang);
    }
  }, [lang, resolved]);

  const t = (key: TranslationKey): string => {
    const dict = translations[lang] as Record<string, string>;
    return dict?.[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  };

  const dir: 'rtl' | 'ltr' = lang === 'fa' ? 'rtl' : 'ltr';
  const isRTL = lang === 'fa';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

function applyToDocument(lang: Language) {
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
