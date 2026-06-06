'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteStats {
  /** e.g. "1,500+" — job seekers count */
  stat1: string;
  /** e.g. "180+" — expert mentors */
  stat2: string;
  /** e.g. "90+" — courses */
  stat3: string;
}

/** Real / default values shown when admin has not overridden anything */
export const DEFAULT_STATS: SiteStats = {
  stat1: '1,500+',
  stat2: '180+',
  stat3: '90+',
};

interface SiteStatsContextType {
  stats: SiteStats;
  setStats: (stats: SiteStats) => void;
  resetStats: () => void;
}

const SiteStatsContext = createContext<SiteStatsContextType | undefined>(undefined);

const STORAGE_KEY = 'movian-site-stats';

export function SiteStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStatsState] = useState<SiteStats>(DEFAULT_STATS);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SiteStats;
        setStatsState(parsed);
      }
    } catch {
      // Ignore
    }
  }, []);

  const setStats = (newStats: SiteStats) => {
    setStatsState(newStats);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch {
      // Ignore storage errors
    }
  };

  const resetStats = () => {
    setStatsState(DEFAULT_STATS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <SiteStatsContext.Provider value={{ stats, setStats, resetStats }}>
      {children}
    </SiteStatsContext.Provider>
  );
}

export function useSiteStats() {
  const ctx = useContext(SiteStatsContext);
  if (!ctx) throw new Error('useSiteStats must be used within SiteStatsProvider');
  return ctx;
}
