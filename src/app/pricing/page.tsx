'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useSiteStats } from '@/contexts/SiteStatsContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  formatPrice, defaultCurrencyForLang, CURRENCIES, currencyLabel, isZeroPrice,
  addPrices, scalePrice, EMPTY_PRICE, type Currency, type PriceSet,
} from '@/lib/currency';
import type { Plan } from '@/contexts/SiteStatsContext';

/** Compute the displayed monthly/yearly price for a plan given the selected feature ids. */
function computePlanPrice(plan: Plan, selected: Set<string>, billing: 'monthly' | 'yearly'): PriceSet {
  const allSelected = plan.features.length > 0 && selected.size === plan.features.length;

  let monthly: PriceSet;
  if (allSelected && plan.fullPackagePrice !== null) {
    monthly = scalePrice(plan.fullPackagePrice, 1 - plan.fullPackageDiscount / 100);
  } else {
    monthly = plan.features
      .filter((f) => selected.has(f.id))
      .reduce((sum, f) => addPrices(sum, f.price), { ...EMPTY_PRICE });
  }

  if (billing === 'yearly' && plan.yearlyDiscountPercent > 0) {
    monthly = scalePrice(monthly, 1 - plan.yearlyDiscountPercent / 100);
  }

  return monthly;
}

export default function PricingPage() {
  const { t, lang, isRTL } = useLang();
  const { plans: contextPlans } = useSiteStats();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const fa = lang === 'fa';

  /* Selected à-la-carte feature ids per plan, defaults to each plan's "included" set */
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    setSelectedFeatures((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const plan of contextPlans) {
        if (!next[plan.id]) {
          next[plan.id] = new Set(plan.features.filter((f) => f.included).map((f) => f.id));
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [contextPlans]);

  const toggleFeature = (planId: string, featureId: string) => {
    setSelectedFeatures((prev) => {
      const set = new Set(prev[planId] ?? []);
      if (set.has(featureId)) set.delete(featureId);
      else set.add(featureId);
      return { ...prev, [planId]: set };
    });
  };

  const selectAll = (plan: Plan) => {
    setSelectedFeatures((prev) => ({ ...prev, [plan.id]: new Set(plan.features.map((f) => f.id)) }));
  };
  const selectNone = (plan: Plan) => {
    setSelectedFeatures((prev) => ({ ...prev, [plan.id]: new Set() }));
  };

  /* Currency selector — defaults based on site language, user can override */
  const [currency, setCurrency] = useState<Currency>(defaultCurrencyForLang(lang));
  const [currencyTouched, setCurrencyTouched] = useState(false);
  useEffect(() => {
    if (!currencyTouched) setCurrency(defaultCurrencyForLang(lang));
  }, [lang, currencyTouched]);

  const faq = fa ? [
    { q: 'آیا می‌توانم هر زمان لغو کنم؟', a: 'بله. اشتراک خود را در هر زمان بدون جریمه لغو کنید. تا پایان دوره صورت‌حساب دسترسی شما حفظ می‌شود.' },
    { q: 'آیا دوره آزمایشی رایگان وجود دارد؟', a: 'بله! پلان رایگان دسترسی کامل به امکانات اصلی را برای همیشه می‌دهد. فقط زمانی ارتقا دهید که به امکانات بیشتری نیاز دارید.' },
    { q: 'صورت‌حساب منتور چگونه کار می‌کند؟', a: 'منتورها نرخ خود را تعیین می‌کنند. موویان ۱۵٪ کارمزد پلتفرم از جلسات موفق دریافت می‌کند.' },
    { q: 'آیا دوره‌ها در قیمت گنجانده شده‌اند؟', a: 'مشترکان پلان حرفه‌ای ۲۰٪ تخفیف روی همه دوره‌ها می‌گیرند. کاربران رایگان قیمت کامل را پرداخت می‌کنند.' },
  ] : [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription at any time with no penalties. You keep access until the end of your billing period.' },
    { q: 'Is there a free trial?', a: 'Yes! The Free plan gives you full access to core features indefinitely. Upgrade only when you need more.' },
    { q: 'How does mentor billing work?', a: 'Mentors set their own rates. Movian charges a 15% platform fee on successful sessions.' },
    { q: 'Are courses included in the price?', a: 'Pro subscribers get a 20% discount on all courses. Free users pay full course prices.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-700 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('pricingTitle')}</h1>
            <p className="text-xl text-white/75 mb-8">{t('pricingSubtitle')}</p>

            <div className={cn('flex flex-wrap items-center justify-center gap-4', isRTL ? 'flex-row-reverse' : '')}>
              {/* Billing toggle */}
              <div className="inline-flex items-center gap-1 bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setBilling('monthly')}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', billing === 'monthly' ? 'bg-white text-primary-700' : 'text-white/70 hover:text-white')}
                >
                  {fa ? 'ماهانه' : 'Monthly'}
                </button>
                <button
                  onClick={() => setBilling('yearly')}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2', billing === 'yearly' ? 'bg-white text-primary-700' : 'text-white/70 hover:text-white')}
                >
                  {fa ? 'سالانه' : 'Yearly'}
                  <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">-17%</span>
                </button>
              </div>

              {/* Currency selector */}
              <div className="inline-flex items-center gap-1 bg-white/10 rounded-xl p-1">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCurrency(c); setCurrencyTouched(true); }}
                    className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', currency === c ? 'bg-white text-primary-700' : 'text-white/70 hover:text-white')}
                  >
                    {currencyLabel(c, lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {contextPlans.map((plan) => {
                const displayName = fa ? plan.nameFa : plan.name;
                const displayDesc = fa ? plan.descriptionFa : plan.description;
                const borderColor = plan.highlighted ? 'border-primary-500' : 'border-gray-200';
                const isCustom = plan.isCustom;

                const selected = selectedFeatures[plan.id] ?? new Set<string>();
                const allSelected = plan.features.length > 0 && selected.size === plan.features.length;
                const isFullPackage = allSelected && plan.fullPackagePrice !== null;
                const totalPrice = computePlanPrice(plan, selected, billing);

                return (
                  <div
                    key={plan.id}
                    className={cn('relative bg-white rounded-2xl border-2 shadow-sm flex flex-col', borderColor, plan.highlighted && 'shadow-xl scale-105')}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <Badge variant="info" className="bg-primary-600 text-white px-4 py-1">
                          {t('mostPopular')}
                        </Badge>
                      </div>
                    )}
                    <div className="p-6 border-b border-gray-100">
                      <h3 className={cn('text-xl font-bold text-gray-900 mb-1', isRTL ? 'text-right' : '')}>{displayName}</h3>
                      <p className={cn('text-sm text-gray-600 mb-4', isRTL ? 'text-right' : '')}>{displayDesc}</p>
                      <div className="flex items-baseline gap-1">
                        {isCustom ? (
                          <span className="text-2xl font-bold text-gray-900">{fa ? 'سفارشی' : lang === 'nl' ? 'Op aanvraag' : 'Custom'}</span>
                        ) : isZeroPrice(totalPrice) ? (
                          <span className="text-3xl font-bold text-gray-900">{fa ? 'رایگان' : lang === 'nl' ? 'Gratis' : 'Free'}</span>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-gray-900">
                              {formatPrice(totalPrice, currency, lang)}
                            </span>
                            <span className="text-gray-500 text-sm">{t('perMonth')}</span>
                          </>
                        )}
                      </div>
                      {isFullPackage && plan.fullPackageDiscount > 0 && (
                        <div className="mt-2">
                          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                            {fa
                              ? `فول پکیج · ${plan.fullPackageDiscount}٪ تخفیف`
                              : lang === 'nl'
                              ? `Volledig pakket · ${plan.fullPackageDiscount}% korting`
                              : `Full package · ${plan.fullPackageDiscount}% off`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      {!isCustom && (
                        <div className={cn('flex items-center justify-between mb-3', isRTL ? 'flex-row-reverse' : '')}>
                          <span className={cn('text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>
                            {fa ? 'موارد دلخواه خود را انتخاب کنید' : lang === 'nl' ? 'Selecteer uw items' : 'Select your items'}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => selectAll(plan)} className="text-xs text-primary-600 hover:underline">
                              {fa ? 'انتخاب همه' : lang === 'nl' ? 'Alles' : 'All'}
                            </button>
                            <button onClick={() => selectNone(plan)} className="text-xs text-gray-400 hover:underline">
                              {fa ? 'هیچ‌کدام' : lang === 'nl' ? 'Geen' : 'None'}
                            </button>
                          </div>
                        </div>
                      )}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((f) => {
                          const label = fa ? f.labelFa : f.label;
                          if (isCustom) {
                            return (
                              <li key={f.id} className={cn('flex items-center gap-2.5 text-sm', isRTL ? 'flex-row-reverse' : '', f.included ? 'text-gray-700' : 'text-gray-400')}>
                                {f.included
                                  ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                                  : <X size={15} className="text-gray-300 flex-shrink-0" />}
                                {label}
                              </li>
                            );
                          }
                          const checked = selected.has(f.id);
                          return (
                            <li key={f.id} className={cn('flex items-center gap-2.5 text-sm', isRTL ? 'flex-row-reverse' : '')}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleFeature(plan.id, f.id)}
                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-400 flex-shrink-0"
                              />
                              <span className={cn('flex-1', isRTL ? 'text-right' : '', checked ? 'text-gray-700' : 'text-gray-400')}>
                                {label}
                              </span>
                              {!isZeroPrice(f.price) && (
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatPrice(f.price, currency, lang)}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                      <Link href={isCustom ? '/contact' : '/register'}>
                        <Button variant={plan.highlighted ? 'primary' : 'outline'} fullWidth>
                          {isCustom ? t('contactUs') : t('getStarted')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {fa ? 'سوالات متداول' : 'Frequently Asked Questions'}
          </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <Card key={item.q} padding="md">
                  <h3 className={cn('font-semibold text-gray-900 mb-2', isRTL ? 'text-right' : '')}>{item.q}</h3>
                  <p className={cn('text-sm text-gray-600', isRTL ? 'text-right' : '')}>{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
