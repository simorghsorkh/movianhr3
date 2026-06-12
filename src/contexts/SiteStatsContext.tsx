'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_CURRENCY_RATES, type CurrencyRates } from '@/lib/currency';

export type { CurrencyRates };

/* ─────────────────────────── Types ─────────────────────────── */

export interface SiteStats {
  stat1: string;
  stat2: string;
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
  rating: number;
}

export interface PlanFeature {
  id: string;
  label: string;
  labelFa: string;
  included: boolean;
  /** Price of this item on its own, in Toman. Used for à la carte selection. */
  price: number;
}

export interface Plan {
  id: string;
  name: string;
  nameFa: string;
  /** null = "Custom / Contact us" */
  priceMonthly: number | null;
  priceYearly: number | null;
  description: string;
  descriptionFa: string;
  popular: boolean;
  highlighted: boolean; // thicker border / scale-up
  features: PlanFeature[];
  /** Price (Toman, before discount) when ALL features are selected. null = use sum of feature prices. */
  fullPackagePrice: number | null;
  /** Discount percentage (0-100) applied to fullPackagePrice when the full package is selected. */
  fullPackageDiscount: number;
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
    name: 'Sara Ahmadi', nameFa: 'سارا احمدی',
    role: 'Marketing Manager', roleFa: 'مدیر بازاریابی',
    text: 'Movian completely changed how I approach my career. The assessment gave me clarity and the roadmap kept me on track.',
    textFa: 'موویان کاملاً نگاه من به مسیر شغلی‌ام را تغییر داد. ارزیابی به من شفافیت داد و نقشه راه مرا در مسیر درست نگه داشت.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ali Rezaei', nameFa: 'علی رضایی',
    role: 'Software Engineer', roleFa: 'مهندس نرم‌افزار',
    text: 'The mentor I connected with through Movian helped me land a senior role in 3 months. Incredible platform.',
    textFa: 'منتوری که از طریق موویان با او آشنا شدم کمک کرد در ۳ ماه به یک موقعیت ارشد برسم. پلتفرم فوق‌العاده‌ای است.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Maryam Tehrani', nameFa: 'مریم تهرانی',
    role: 'Product Designer', roleFa: 'طراح محصول',
    text: "I was stuck in my career for 2 years. After using Movian's roadmap and taking 2 courses, I finally made the leap.",
    textFa: 'دو سال در مسیر شغلی‌ام گیر کرده بودم. بعد از استفاده از نقشه راه موویان و گذراندن ۲ دوره، بالاخره جهش کردم.',
    rating: 5,
  },
];

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free', nameFa: 'رایگان',
    priceMonthly: 0, priceYearly: 0,
    description: 'Perfect for getting started with career assessment.',
    descriptionFa: 'برای شروع ارزیابی مسیر شغلی‌تان ایده‌آل است.',
    popular: false, highlighted: false,
    fullPackagePrice: 0, fullPackageDiscount: 0,
    features: [
      { id: 'f1', label: 'Basic profile creation',           labelFa: 'ایجاد پروفایل پایه',               included: true,  price: 0 },
      { id: 'f2', label: 'Career assessment (1x)',           labelFa: 'ارزیابی شغلی (۱ بار)',              included: true,  price: 0 },
      { id: 'f3', label: 'View 5 mentor profiles',          labelFa: 'مشاهده ۵ پروفایل منتور',           included: true,  price: 0 },
      { id: 'f4', label: 'Access to free courses',          labelFa: 'دسترسی به دوره‌های رایگان',        included: true,  price: 0 },
      { id: 'f5', label: 'CV builder (1 template)',          labelFa: 'ساخت رزومه (۱ قالب)',               included: true,  price: 0 },
      { id: 'f6', label: 'Mentor consultation requests',    labelFa: 'درخواست مشاوره از منتور',          included: false, price: 0 },
      { id: 'f7', label: 'Personalized roadmap',            labelFa: 'نقشه راه شخصی‌سازی شده',          included: false, price: 0 },
      { id: 'f8', label: 'Priority support',                labelFa: 'پشتیبانی اولویت‌دار',             included: false, price: 0 },
    ],
  },
  {
    id: 'pro',
    name: 'Professional', nameFa: 'حرفه‌ای',
    priceMonthly: 299000, priceYearly: 249000,
    description: 'For serious job seekers who want full career support.',
    descriptionFa: 'برای جویندگان کار جدی که به حمایت کامل شغلی نیاز دارند.',
    popular: true, highlighted: true,
    fullPackagePrice: 299000, fullPackageDiscount: 10,
    features: [
      { id: 'p1', label: 'Everything in Free',              labelFa: 'همه امکانات پلان رایگان',          included: true, price: 16000 },
      { id: 'p2', label: 'Unlimited career assessments',    labelFa: 'ارزیابی شغلی نامحدود',             included: true, price: 49000 },
      { id: 'p3', label: 'Full mentor directory access',    labelFa: 'دسترسی کامل به فهرست منتورها',     included: true, price: 39000 },
      { id: 'p4', label: 'Unlimited consultation requests', labelFa: 'درخواست مشاوره نامحدود',           included: true, price: 59000 },
      { id: 'p5', label: 'Personalized career roadmap',     labelFa: 'نقشه راه شغلی شخصی‌سازی شده',     included: true, price: 49000 },
      { id: 'p6', label: 'CV builder (all templates)',      labelFa: 'ساخت رزومه (همه قالب‌ها)',         included: true, price: 29000 },
      { id: 'p7', label: 'Course enrollment discounts',     labelFa: 'تخفیف ثبت‌نام در دوره‌ها',        included: true, price: 19000 },
      { id: 'p8', label: 'Priority support',                labelFa: 'پشتیبانی اولویت‌دار',             included: true, price: 39000 },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise', nameFa: 'سازمانی',
    priceMonthly: null, priceYearly: null,
    description: 'For teams and organizations hiring at scale.',
    descriptionFa: 'برای تیم‌ها و سازمان‌هایی که در مقیاس بزرگ استخدام می‌کنند.',
    popular: false, highlighted: false,
    fullPackagePrice: null, fullPackageDiscount: 0,
    features: [
      { id: 'e1', label: 'Everything in Professional',      labelFa: 'همه امکانات پلان حرفه‌ای',        included: true, price: 0 },
      { id: 'e2', label: 'Team accounts (up to 50)',        labelFa: 'حساب تیمی (تا ۵۰ نفر)',            included: true, price: 0 },
      { id: 'e3', label: 'Dedicated account manager',       labelFa: 'مدیر حساب اختصاصی',              included: true, price: 0 },
      { id: 'e4', label: 'Custom training programs',        labelFa: 'برنامه‌های آموزشی سفارشی',        included: true, price: 0 },
      { id: 'e5', label: 'API access',                      labelFa: 'دسترسی به API',                    included: true, price: 0 },
      { id: 'e6', label: 'Analytics dashboard',             labelFa: 'داشبورد تحلیلی',                  included: true, price: 0 },
      { id: 'e7', label: 'SLA guarantee',                   labelFa: 'تضمین SLA',                       included: true, price: 0 },
      { id: 'e8', label: 'White-labeling options',          labelFa: 'قابلیت برندسازی سفارشی',          included: true, price: 0 },
    ],
  },
];

/* ──────────────────────── Context type ─────────────────────── */

interface SiteStatsContextType {
  stats: SiteStats;
  setStats: (stats: SiteStats) => void;
  resetStats: () => void;

  testimonials: Testimonial[];
  setTestimonials: (items: Testimonial[]) => void;
  resetTestimonials: () => void;

  plans: Plan[];
  setPlans: (plans: Plan[]) => void;
  resetPlans: () => void;

  currencyRates: CurrencyRates;
  setCurrencyRates: (rates: CurrencyRates) => void;
  resetCurrencyRates: () => void;
}

/* ──────────────────────── Provider ─────────────────────────── */

const SiteStatsContext = createContext<SiteStatsContextType | undefined>(undefined);

const STATS_KEY          = 'movian-site-stats';
const TESTIMONIALS_KEY   = 'movian-testimonials';
const PLANS_KEY          = 'movian-plans';
const CURRENCY_RATES_KEY = 'movian-currency-rates';

/** Fill in fields added after a Plan/PlanFeature shape was first persisted to localStorage. */
function migratePlans(plans: Plan[]): Plan[] {
  return plans.map((p) => ({
    ...p,
    fullPackagePrice: p.fullPackagePrice ?? null,
    fullPackageDiscount: p.fullPackageDiscount ?? 0,
    features: p.features.map((f) => ({ ...f, price: f.price ?? 0 })),
  }));
}

export function SiteStatsProvider({ children }: { children: ReactNode }) {
  const [stats,         setStatsState]         = useState<SiteStats>(DEFAULT_STATS);
  const [testimonials,  setTestimonialsState]  = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [plans,         setPlansState]         = useState<Plan[]>(DEFAULT_PLANS);
  const [currencyRates, setCurrencyRatesState] = useState<CurrencyRates>(DEFAULT_CURRENCY_RATES);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STATS_KEY);
      if (s) setStatsState(JSON.parse(s));

      const t = localStorage.getItem(TESTIMONIALS_KEY);
      if (t) setTestimonialsState(JSON.parse(t));

      const p = localStorage.getItem(PLANS_KEY);
      if (p) setPlansState(migratePlans(JSON.parse(p)));

      const c = localStorage.getItem(CURRENCY_RATES_KEY);
      if (c) setCurrencyRatesState(JSON.parse(c));
    } catch { /* ignore */ }
  }, []);

  const save = <T,>(key: string, val: T) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
  };
  const remove = (key: string) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  };

  const setStats        = (v: SiteStats)      => { setStatsState(v);        save(STATS_KEY, v);        };
  const resetStats      = ()                  => { setStatsState(DEFAULT_STATS);        remove(STATS_KEY);        };

  const setTestimonials = (v: Testimonial[])  => { setTestimonialsState(v); save(TESTIMONIALS_KEY, v); };
  const resetTestimonials = ()                => { setTestimonialsState(DEFAULT_TESTIMONIALS); remove(TESTIMONIALS_KEY); };

  const setPlans        = (v: Plan[])         => { setPlansState(v);        save(PLANS_KEY, v);        };
  const resetPlans      = ()                  => { setPlansState(DEFAULT_PLANS);        remove(PLANS_KEY);        };

  const setCurrencyRates   = (v: CurrencyRates) => { setCurrencyRatesState(v); save(CURRENCY_RATES_KEY, v); };
  const resetCurrencyRates = ()                 => { setCurrencyRatesState(DEFAULT_CURRENCY_RATES); remove(CURRENCY_RATES_KEY); };

  return (
    <SiteStatsContext.Provider value={{
      stats, setStats, resetStats,
      testimonials, setTestimonials, resetTestimonials,
      plans, setPlans, resetPlans,
      currencyRates, setCurrencyRates, resetCurrencyRates,
    }}>
      {children}
    </SiteStatsContext.Provider>
  );
}

export function useSiteStats() {
  const ctx = useContext(SiteStatsContext);
  if (!ctx) throw new Error('useSiteStats must be used within SiteStatsProvider');
  return ctx;
}
