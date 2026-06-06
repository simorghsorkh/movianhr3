'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ─────────────────────────── Types ─────────────────────────── */

export interface SiteStats {
  /** e.g. "1,500+" — job seekers count */
  stat1: string;
  /** e.g. "180+" — expert mentors */
  stat2: string;
  /** e.g. "90+" — courses */
  stat3: string;
}

export interface Testimonial {
  id: string;
  name: string;
  nameFa: string;
  role: string;
  roleFa: string;
  text: string;
  textFa: string;
  rating: number; // 1–5
}

/* ───────────────────────── Defaults ────────────────────────── */

export const DEFAULT_STATS: SiteStats = {
  stat1: '1,500+',
  stat2: '180+',
  stat3: '90+',
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sara Ahmadi',
    nameFa: 'سارا احمدی',
    role: 'Marketing Manager',
    roleFa: 'مدیر بازاریابی',
    text: 'Movian completely changed how I approach my career. The assessment gave me clarity and the roadmap kept me on track.',
    textFa: 'موویان کاملاً نگاه من به مسیر شغلی‌ام را تغییر داد. ارزیابی به من شفافیت داد و نقشه راه مرا در مسیر درست نگه داشت.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ali Rezaei',
    nameFa: 'علی رضایی',
    role: 'Software Engineer',
    roleFa: 'مهندس نرم‌افزار',
    text: 'The mentor I connected with through Movian helped me land a senior role in 3 months. Incredible platform.',
    textFa: 'منتوری که از طریق موویان با او آشنا شدم کمک کرد در ۳ ماه به یک موقعیت ارشد برسم. پلتفرم فوق‌العاده‌ای است.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Maryam Tehrani',
    nameFa: 'مریم تهرانی',
    role: 'Product Designer',
    roleFa: 'طراح محصول',
    text: "I was stuck in my career for 2 years. After using Movian's roadmap and taking 2 courses, I finally made the leap.",
    textFa: 'دو سال در مسیر شغلی‌ام گیر کرده بودم. بعد از استفاده از نقشه راه موویان و گذراندن ۲ دوره، بالاخره جهش کردم.',
    rating: 5,
  },
];

/* ──────────────────────── Context type ─────────────────────── */

interface SiteStatsContextType {
  // Stats
  stats: SiteStats;
  setStats: (stats: SiteStats) => void;
  resetStats: () => void;
  // Testimonials
  testimonials: Testimonial[];
  setTestimonials: (items: Testimonial[]) => void;
  resetTestimonials: () => void;
}

/* ──────────────────────── Provider ─────────────────────────── */

const SiteStatsContext = createContext<SiteStatsContextType | undefined>(undefined);

const STATS_KEY        = 'movian-site-stats';
const TESTIMONIALS_KEY = 'movian-testimonials';

export function SiteStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStatsState] = useState<SiteStats>(DEFAULT_STATS);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) setStatsState(JSON.parse(savedStats) as SiteStats);

      const savedTestimonials = localStorage.getItem(TESTIMONIALS_KEY);
      if (savedTestimonials) setTestimonialsState(JSON.parse(savedTestimonials) as Testimonial[]);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setStats = (newStats: SiteStats) => {
    setStatsState(newStats);
    try { localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch { /* noop */ }
  };

  const resetStats = () => {
    setStatsState(DEFAULT_STATS);
    try { localStorage.removeItem(STATS_KEY); } catch { /* noop */ }
  };

  const setTestimonials = (items: Testimonial[]) => {
    setTestimonialsState(items);
    try { localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(items)); } catch { /* noop */ }
  };

  const resetTestimonials = () => {
    setTestimonialsState(DEFAULT_TESTIMONIALS);
    try { localStorage.removeItem(TESTIMONIALS_KEY); } catch { /* noop */ }
  };

  return (
    <SiteStatsContext.Provider value={{ stats, setStats, resetStats, testimonials, setTestimonials, resetTestimonials }}>
      {children}
    </SiteStatsContext.Provider>
  );
}

export function useSiteStats() {
  const ctx = useContext(SiteStatsContext);
  if (!ctx) throw new Error('useSiteStats must be used within SiteStatsProvider');
  return ctx;
}
