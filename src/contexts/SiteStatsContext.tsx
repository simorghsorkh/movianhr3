'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EMPTY_PRICE, type PriceSet } from '@/lib/currency';

export type { PriceSet };

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
  /** Price of this item on its own, entered separately per currency. Used for à la carte selection. */
  price: PriceSet;
}

export interface Plan {
  id: string;
  name: string;
  nameFa: string;
  /** true = "Custom / Contact us", no pricing or item selection shown */
  isCustom: boolean;
  description: string;
  descriptionFa: string;
  popular: boolean;
  highlighted: boolean; // thicker border / scale-up
  /** Discount percentage (0-100) applied when the user switches to yearly billing */
  yearlyDiscountPercent: number;
  features: PlanFeature[];
  /** Price (before discount) when ALL features are selected. null = use sum of feature prices. */
  fullPackagePrice: PriceSet | null;
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
    isCustom: false,
    description: 'Perfect for getting started with career assessment.',
    descriptionFa: 'برای شروع ارزیابی مسیر شغلی‌تان ایده‌آل است.',
    popular: false, highlighted: false,
    yearlyDiscountPercent: 0,
    fullPackagePrice: { rial: 0, usd: 0, eur: 0 }, fullPackageDiscount: 0,
    features: [
      { id: 'f1', label: 'Basic profile creation',           labelFa: 'ایجاد پروفایل پایه',               included: true,  price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f2', label: 'Career assessment (1x)',           labelFa: 'ارزیابی شغلی (۱ بار)',              included: true,  price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f3', label: 'View 5 mentor profiles',          labelFa: 'مشاهده ۵ پروفایل منتور',           included: true,  price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f4', label: 'Access to free courses',          labelFa: 'دسترسی به دوره‌های رایگان',        included: true,  price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f5', label: 'CV builder (1 template)',          labelFa: 'ساخت رزومه (۱ قالب)',               included: true,  price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f6', label: 'Mentor consultation requests',    labelFa: 'درخواست مشاوره از منتور',          included: false, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f7', label: 'Personalized roadmap',            labelFa: 'نقشه راه شخصی‌سازی شده',          included: false, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'f8', label: 'Priority support',                labelFa: 'پشتیبانی اولویت‌دار',             included: false, price: { rial: 0, usd: 0, eur: 0 } },
    ],
  },
  {
    id: 'pro',
    name: 'Professional', nameFa: 'حرفه‌ای',
    isCustom: false,
    description: 'For serious job seekers who want full career support.',
    descriptionFa: 'برای جویندگان کار جدی که به حمایت کامل شغلی نیاز دارند.',
    popular: true, highlighted: true,
    yearlyDiscountPercent: 17,
    fullPackagePrice: { rial: 2990000, usd: 9.99, eur: 9.49 }, fullPackageDiscount: 10,
    features: [
      { id: 'p1', label: 'Everything in Free',              labelFa: 'همه امکانات پلان رایگان',          included: true, price: { rial: 160000, usd: 0.53, eur: 0.51 } },
      { id: 'p2', label: 'Unlimited career assessments',    labelFa: 'ارزیابی شغلی نامحدود',             included: true, price: { rial: 490000, usd: 1.64, eur: 1.56 } },
      { id: 'p3', label: 'Full mentor directory access',    labelFa: 'دسترسی کامل به فهرست منتورها',     included: true, price: { rial: 390000, usd: 1.30, eur: 1.24 } },
      { id: 'p4', label: 'Unlimited consultation requests', labelFa: 'درخواست مشاوره نامحدود',           included: true, price: { rial: 590000, usd: 1.97, eur: 1.87 } },
      { id: 'p5', label: 'Personalized career roadmap',     labelFa: 'نقشه راه شغلی شخصی‌سازی شده',     included: true, price: { rial: 490000, usd: 1.64, eur: 1.56 } },
      { id: 'p6', label: 'CV builder (all templates)',      labelFa: 'ساخت رزومه (همه قالب‌ها)',         included: true, price: { rial: 290000, usd: 0.97, eur: 0.92 } },
      { id: 'p7', label: 'Course enrollment discounts',     labelFa: 'تخفیف ثبت‌نام در دوره‌ها',        included: true, price: { rial: 190000, usd: 0.63, eur: 0.60 } },
      { id: 'p8', label: 'Priority support',                labelFa: 'پشتیبانی اولویت‌دار',             included: true, price: { rial: 390000, usd: 1.30, eur: 1.24 } },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise', nameFa: 'سازمانی',
    isCustom: true,
    description: 'For teams and organizations hiring at scale.',
    descriptionFa: 'برای تیم‌ها و سازمان‌هایی که در مقیاس بزرگ استخدام می‌کنند.',
    popular: false, highlighted: false,
    yearlyDiscountPercent: 0,
    fullPackagePrice: null, fullPackageDiscount: 0,
    features: [
      { id: 'e1', label: 'Everything in Professional',      labelFa: 'همه امکانات پلان حرفه‌ای',        included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e2', label: 'Team accounts (up to 50)',        labelFa: 'حساب تیمی (تا ۵۰ نفر)',            included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e3', label: 'Dedicated account manager',       labelFa: 'مدیر حساب اختصاصی',              included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e4', label: 'Custom training programs',        labelFa: 'برنامه‌های آموزشی سفارشی',        included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e5', label: 'API access',                      labelFa: 'دسترسی به API',                    included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e6', label: 'Analytics dashboard',             labelFa: 'داشبورد تحلیلی',                  included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e7', label: 'SLA guarantee',                   labelFa: 'تضمین SLA',                       included: true, price: { rial: 0, usd: 0, eur: 0 } },
      { id: 'e8', label: 'White-labeling options',          labelFa: 'قابلیت برندسازی سفارشی',          included: true, price: { rial: 0, usd: 0, eur: 0 } },
    ],
  },
];

/** A blank starting point for a brand-new plan created from the admin panel. */
export const EMPTY_PLAN: Omit<Plan, 'id'> = {
  name: 'New Plan', nameFa: 'پکیج جدید',
  isCustom: false,
  description: '', descriptionFa: '',
  popular: false, highlighted: false,
  yearlyDiscountPercent: 0,
  fullPackagePrice: { ...EMPTY_PRICE }, fullPackageDiscount: 0,
  features: [],
};

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
}

/* ──────────────────────── Provider ─────────────────────────── */

const SiteStatsContext = createContext<SiteStatsContextType | undefined>(undefined);

const STATS_KEY        = 'movian-site-stats';
const TESTIMONIALS_KEY = 'movian-testimonials';
const PLANS_KEY        = 'movian-plans';

function isPriceSet(v: unknown): v is PriceSet {
  return typeof v === 'object' && v !== null && 'rial' in (v as Record<string, unknown>);
}

/** Convert a legacy Toman amount (pre-multi-currency) into a rough PriceSet. */
function priceFromToman(toman: number): PriceSet {
  return { rial: toman * 10, usd: Math.round((toman / 60000) * 100) / 100, eur: Math.round((toman / 65000) * 100) / 100 };
}

/** Fill in / convert fields from older shapes persisted to localStorage. */
function migratePlans(plans: unknown[]): Plan[] {
  return (plans as Array<Record<string, unknown>>).map((p) => {
    const legacyPriceMonthly = p.priceMonthly as number | null | undefined;
    const legacyPriceYearly = p.priceYearly as number | null | undefined;

    const isCustom = typeof p.isCustom === 'boolean' ? p.isCustom : legacyPriceMonthly === null;

    let yearlyDiscountPercent = p.yearlyDiscountPercent as number | undefined;
    if (yearlyDiscountPercent === undefined) {
      if (legacyPriceMonthly && legacyPriceMonthly > 0 && legacyPriceYearly != null) {
        yearlyDiscountPercent = Math.round((1 - legacyPriceYearly / legacyPriceMonthly) * 100);
      } else {
        yearlyDiscountPercent = 0;
      }
    }

    const rawFullPackagePrice = p.fullPackagePrice as PriceSet | number | null | undefined;
    const fullPackagePrice =
      rawFullPackagePrice == null
        ? null
        : isPriceSet(rawFullPackagePrice)
        ? rawFullPackagePrice
        : priceFromToman(rawFullPackagePrice);

    const features = ((p.features as Array<Record<string, unknown>>) ?? []).map((f) => {
      const rawPrice = f.price as PriceSet | number | undefined;
      const price = rawPrice == null ? { ...EMPTY_PRICE } : isPriceSet(rawPrice) ? rawPrice : priceFromToman(rawPrice);
      return { ...f, price } as PlanFeature;
    });

    return {
      ...p,
      isCustom,
      yearlyDiscountPercent,
      fullPackagePrice,
      fullPackageDiscount: (p.fullPackageDiscount as number | undefined) ?? 0,
      features,
    } as Plan;
  });
}

export function SiteStatsProvider({ children }: { children: ReactNode }) {
  const [stats,        setStatsState]        = useState<SiteStats>(DEFAULT_STATS);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [plans,        setPlansState]        = useState<Plan[]>(DEFAULT_PLANS);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STATS_KEY);
      if (s) setStatsState(JSON.parse(s));

      const t = localStorage.getItem(TESTIMONIALS_KEY);
      if (t) setTestimonialsState(JSON.parse(t));

      const p = localStorage.getItem(PLANS_KEY);
      if (p) setPlansState(migratePlans(JSON.parse(p)));
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

  return (
    <SiteStatsContext.Provider value={{
      stats, setStats, resetStats,
      testimonials, setTestimonials, resetTestimonials,
      plans, setPlans, resetPlans,
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
