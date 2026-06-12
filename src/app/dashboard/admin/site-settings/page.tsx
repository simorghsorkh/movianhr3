'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings, RotateCcw, Save, Users, Award, BookOpen, CheckCircle,
  Star, Plus, Pencil, Trash2, X, ChevronUp, ChevronDown,
  DollarSign, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import {
  useSiteStats,
  DEFAULT_STATS, DEFAULT_TESTIMONIALS, DEFAULT_PLANS,
  type SiteStats, type Testimonial, type Plan, type PlanFeature, type CurrencyRates,
} from '@/contexts/SiteStatsContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ──────────────────────── Helpers ──────────────────────────── */

const EMPTY_TESTIMONIAL: Omit<Testimonial, 'id'> = {
  name: '', nameFa: '', role: '', roleFa: '', text: '', textFa: '', rating: 5,
};

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ────────────────────── Testimonial Form ───────────────────── */

function TestimonialForm({
  initial,
  onSave,
  onCancel,
  isRTL,
  lang,
}: {
  initial: Omit<Testimonial, 'id'>;
  onSave: (data: Omit<Testimonial, 'id'>) => void;
  onCancel: () => void;
  isRTL: boolean;
  lang: string;
}) {
  const fa = lang === 'fa';
  const nl = lang === 'nl';
  const [form, setForm] = useState(initial);

  const field = (
    key: keyof typeof EMPTY_TESTIMONIAL,
    label: string,
    dir: 'ltr' | 'rtl' = 'ltr',
    multiline = false
  ) => (
    <div>
      <label className={cn('block text-xs font-semibold text-gray-600 mb-1', isRTL ? 'text-right' : '')}>
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={form[key] as string}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          dir={dir}
          className={cn('w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', dir === 'rtl' ? 'text-right' : '')}
        />
      ) : (
        <input
          type="text"
          value={form[key] as string}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          dir={dir}
          className={cn('w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', dir === 'rtl' ? 'text-right' : '')}
        />
      )}
    </div>
  );

  return (
    <div className="border border-primary-200 bg-primary-50/30 rounded-xl p-5 space-y-4">
      {/* Rating */}
      <div>
        <label className={cn('block text-xs font-semibold text-gray-600 mb-2', isRTL ? 'text-right' : '')}>
          {fa ? 'امتیاز' : nl ? 'Beoordeling' : 'Rating'}
        </label>
        <div className={cn('flex gap-1', isRTL ? 'flex-row-reverse' : '')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((p) => ({ ...p, rating: n }))}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={22}
                className={n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name + Name FA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('name',   fa ? 'نام (انگلیسی)'   : nl ? 'Naam (EN)'  : 'Name (EN)',   'ltr')}
        {field('nameFa', fa ? 'نام (فارسی)'     : nl ? 'Naam (FA)'  : 'Name (FA)',   'rtl')}
      </div>

      {/* Role + Role FA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('role',   fa ? 'موقعیت (انگلیسی)' : nl ? 'Functie (EN)' : 'Role (EN)', 'ltr')}
        {field('roleFa', fa ? 'موقعیت (فارسی)'   : nl ? 'Functie (FA)' : 'Role (FA)', 'rtl')}
      </div>

      {/* Text + Text FA */}
      {field('text',   fa ? 'متن نظر (انگلیسی)' : nl ? 'Tekst (EN)' : 'Review text (EN)', 'ltr', true)}
      {field('textFa', fa ? 'متن نظر (فارسی)'   : nl ? 'Tekst (FA)' : 'Review text (FA)', 'rtl', true)}

      {/* Actions */}
      <div className={cn('flex gap-2 pt-1', isRTL ? 'flex-row-reverse' : '')}>
        <Button size="sm" onClick={() => onSave(form)} className="flex items-center gap-1.5">
          <CheckCircle size={14} />
          {fa ? 'ذخیره' : nl ? 'Opslaan' : 'Save'}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="flex items-center gap-1.5 text-gray-600">
          <X size={14} />
          {fa ? 'انصراف' : nl ? 'Annuleren' : 'Cancel'}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────── Plans Editor ──────────────────────── */

function PlansEditor({
  plans, setPlans, resetPlans, isRTL, fa, nl,
}: {
  plans: Plan[];
  setPlans: (p: Plan[]) => void;
  resetPlans: () => void;
  isRTL: boolean;
  fa: boolean;
  nl: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const updatePlan = (id: string, patch: Partial<Plan>) =>
    setPlans(plans.map((p) => p.id === id ? { ...p, ...patch } : p));

  const updateFeature = (planId: string, featureId: string, patch: Partial<PlanFeature>) =>
    setPlans(plans.map((p) =>
      p.id === planId
        ? { ...p, features: p.features.map((f) => f.id === featureId ? { ...f, ...patch } : f) }
        : p
    ));

  const addFeature = (planId: string) =>
    setPlans(plans.map((p) =>
      p.id === planId
        ? { ...p, features: [...p.features, { id: genId(), label: '', labelFa: '', included: true, price: 0 }] }
        : p
    ));

  const deleteFeature = (planId: string, featureId: string) =>
    setPlans(plans.map((p) =>
      p.id === planId
        ? { ...p, features: p.features.filter((f) => f.id !== featureId) }
        : p
    ));

  const label = (text: string) => (
    <span className={cn('block text-xs font-semibold text-gray-600 mb-1', isRTL ? 'text-right' : '')}>{text}</span>
  );
  const textInput = (
    value: string,
    onChange: (v: string) => void,
    dir: 'ltr' | 'rtl' = 'ltr'
  ) => (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
      className={cn('w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all', dir === 'rtl' ? 'text-right' : '')}
    />
  );

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const isExpanded = expandedId === plan.id;
        const displayName = fa ? plan.nameFa : plan.name;

        return (
          <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Plan header row */}
            <div className={cn('flex items-center justify-between gap-3 px-5 py-4', isRTL ? 'flex-row-reverse' : '')}>
              <div className={cn('flex items-center gap-3 flex-1 min-w-0', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={16} className="text-primary-600" />
                </div>
                <div className={cn('min-w-0', isRTL ? 'text-right' : '')}>
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">
                    {plan.priceMonthly === null
                      ? (fa ? 'سفارشی' : nl ? 'Op aanvraag' : 'Custom')
                      : plan.priceMonthly === 0
                      ? (fa ? 'رایگان' : nl ? 'Gratis' : 'Free')
                      : `${plan.priceMonthly.toLocaleString()} / ${fa ? 'ماه' : nl ? 'mnd' : 'mo'}`}
                  </p>
                </div>
                {plan.popular && (
                  <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                    {fa ? 'محبوب' : nl ? 'Populair' : 'Popular'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all flex-shrink-0"
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Expanded editor */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-5">

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    {label(fa ? 'نام (انگلیسی)' : nl ? 'Naam (EN)' : 'Name (EN)')}
                    {textInput(plan.name, (v) => updatePlan(plan.id, { name: v }))}
                  </div>
                  <div>
                    {label(fa ? 'نام (فارسی)' : nl ? 'Naam (FA)' : 'Name (FA)')}
                    {textInput(plan.nameFa, (v) => updatePlan(plan.id, { nameFa: v }), 'rtl')}
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    {label(fa ? 'قیمت ماهانه (۰ = رایگان، خالی = سفارشی)' : nl ? 'Maandprijs (0=gratis, leeg=op aanvraag)' : 'Monthly price (0=free, empty=custom)')}
                    <input
                      type="number"
                      min={0}
                      value={plan.priceMonthly ?? ''}
                      onChange={(e) => updatePlan(plan.id, {
                        priceMonthly: e.target.value === '' ? null : Number(e.target.value),
                      })}
                      dir="ltr"
                      placeholder={fa ? 'خالی = سفارشی' : 'empty = custom'}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                  <div>
                    {label(fa ? 'قیمت سالانه (در ماه)' : nl ? 'Jaarprijs (per maand)' : 'Yearly price (per month)')}
                    <input
                      type="number"
                      min={0}
                      value={plan.priceYearly ?? ''}
                      onChange={(e) => updatePlan(plan.id, {
                        priceYearly: e.target.value === '' ? null : Number(e.target.value),
                      })}
                      dir="ltr"
                      placeholder={fa ? 'خالی = سفارشی' : 'empty = custom'}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  {label(fa ? 'توضیحات (انگلیسی)' : nl ? 'Beschrijving (EN)' : 'Description (EN)')}
                  {textInput(plan.description, (v) => updatePlan(plan.id, { description: v }))}
                </div>
                <div>
                  {label(fa ? 'توضیحات (فارسی)' : nl ? 'Beschrijving (FA)' : 'Description (FA)')}
                  {textInput(plan.descriptionFa, (v) => updatePlan(plan.id, { descriptionFa: v }), 'rtl')}
                </div>

                {/* Full package price + discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-primary-50/50 border border-primary-100 rounded-xl p-3">
                  <div>
                    {label(fa ? 'قیمت فول پکیج (تومان)' : nl ? 'Prijs volledig pakket (Toman)' : 'Full package price (Toman)')}
                    <input
                      type="number"
                      min={0}
                      value={plan.fullPackagePrice ?? ''}
                      onChange={(e) => updatePlan(plan.id, {
                        fullPackagePrice: e.target.value === '' ? null : Number(e.target.value),
                      })}
                      dir="ltr"
                      placeholder={fa ? 'خالی = جمع قیمت موارد' : 'empty = sum of items'}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                  <div>
                    {label(fa ? 'درصد تخفیف فول پکیج' : nl ? 'Korting volledig pakket (%)' : 'Full package discount (%)')}
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={plan.fullPackageDiscount}
                      onChange={(e) => updatePlan(plan.id, { fullPackageDiscount: Number(e.target.value) })}
                      dir="ltr"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                  <p className={cn('text-xs text-gray-500 sm:col-span-2', isRTL ? 'text-right' : '')}>
                    {fa
                      ? 'زمانی که کاربر همه موارد را انتخاب کند، به‌جای جمع قیمت‌ها، این قیمت با این درصد تخفیف نمایش داده می‌شود.'
                      : nl
                      ? 'Als de gebruiker alle items selecteert, wordt deze prijs met deze korting getoond in plaats van de som van de items.'
                      : 'When the user selects every item, this price (minus the discount) is shown instead of the sum of item prices.'}
                  </p>
                </div>

                {/* Toggles */}
                <div className={cn('flex items-center gap-6', isRTL ? 'flex-row-reverse' : '')}>
                  {/* Popular badge toggle */}
                  <button
                    onClick={() => updatePlan(plan.id, { popular: !plan.popular })}
                    className={cn('flex items-center gap-2 text-sm font-medium transition-colors', isRTL ? 'flex-row-reverse' : '', plan.popular ? 'text-primary-600' : 'text-gray-400')}
                  >
                    {plan.popular
                      ? <ToggleRight size={20} className="text-primary-500" />
                      : <ToggleLeft size={20} />}
                    {fa ? 'نشان «محبوب»' : nl ? 'Populair-badge' : '"Popular" badge'}
                  </button>
                  {/* Highlighted (scale up) toggle */}
                  <button
                    onClick={() => updatePlan(plan.id, { highlighted: !plan.highlighted })}
                    className={cn('flex items-center gap-2 text-sm font-medium transition-colors', isRTL ? 'flex-row-reverse' : '', plan.highlighted ? 'text-primary-600' : 'text-gray-400')}
                  >
                    {plan.highlighted
                      ? <ToggleRight size={20} className="text-primary-500" />
                      : <ToggleLeft size={20} />}
                    {fa ? 'برجسته (بزرگ‌نمایی)' : nl ? 'Uitgelicht (vergroot)' : 'Highlighted (scaled)'}
                  </button>
                </div>

                {/* Features list */}
                <div>
                  <p className={cn('text-xs font-semibold text-gray-600 mb-2', isRTL ? 'text-right' : '')}>
                    {fa ? 'ویژگی‌ها' : nl ? 'Functies' : 'Features'}
                  </p>
                  <div className="space-y-2">
                    {plan.features.map((feat) => (
                      <div key={feat.id}>
                        {editingFeatureId === `${plan.id}:${feat.id}` ? (
                          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={feat.label}
                                onChange={(e) => updateFeature(plan.id, feat.id, { label: e.target.value })}
                                placeholder="Feature (EN)"
                                dir="ltr"
                                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                              />
                              <input
                                type="text"
                                value={feat.labelFa}
                                onChange={(e) => updateFeature(plan.id, feat.id, { labelFa: e.target.value })}
                                placeholder="ویژگی (FA)"
                                dir="rtl"
                                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-300"
                              />
                            </div>
                            <div>
                              {label(fa ? 'قیمت این مورد (تومان)' : nl ? 'Prijs van dit item (Toman)' : 'Price of this item (Toman)')}
                              <input
                                type="number"
                                min={0}
                                value={feat.price}
                                onChange={(e) => updateFeature(plan.id, feat.id, { price: Number(e.target.value) })}
                                dir="ltr"
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                              />
                            </div>
                            <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                              <button
                                onClick={() => updateFeature(plan.id, feat.id, { included: !feat.included })}
                                className={cn('flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all', feat.included ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-500')}
                              >
                                <CheckCircle size={13} />
                                {feat.included ? (fa ? 'فعال' : 'Included') : (fa ? 'غیرفعال' : 'Excluded')}
                              </button>
                              <button
                                onClick={() => setEditingFeatureId(null)}
                                className="text-xs text-primary-600 hover:underline"
                              >
                                {fa ? 'تأیید' : nl ? 'OK' : 'Done'}
                              </button>
                              <button
                                onClick={() => { deleteFeature(plan.id, feat.id); setEditingFeatureId(null); }}
                                className="text-xs text-red-500 hover:underline"
                              >
                                {fa ? 'حذف' : nl ? 'Verwijder' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group', isRTL ? 'flex-row-reverse' : '')}
                            onClick={() => setEditingFeatureId(`${plan.id}:${feat.id}`)}
                          >
                            <CheckCircle
                              size={14}
                              className={cn('flex-shrink-0', feat.included ? 'text-green-500' : 'text-gray-300')}
                            />
                            <span className={cn('text-sm text-gray-700 flex-1 truncate', isRTL ? 'text-right' : '')}>
                              {fa ? feat.labelFa : feat.label}
                            </span>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {feat.price > 0 ? feat.price.toLocaleString() : ''}
                            </span>
                            <Pencil size={12} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add feature */}
                  <button
                    onClick={() => addFeature(plan.id)}
                    className={cn('mt-2 flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium', isRTL ? 'flex-row-reverse' : '')}
                  >
                    <Plus size={13} />
                    {fa ? 'افزودن ویژگی' : nl ? 'Functie toevoegen' : 'Add feature'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Reset */}
      <div className={cn('flex pt-2', isRTL ? 'justify-end' : '')}>
        <Button variant="outline" onClick={resetPlans} className="flex items-center gap-2 text-gray-600">
          <RotateCcw size={16} />
          {fa ? 'بازگشت به پیش‌فرض' : nl ? 'Terugzetten naar standaard' : 'Reset to Default'}
        </Button>
      </div>

      <p className={cn('text-xs text-gray-400', isRTL ? 'text-right' : '')}>
        {fa
          ? '⚠️ تغییرات در مرورگر ذخیره می‌شوند و بلافاصله در صفحه قیمت‌گذاری نمایش داده می‌شوند.'
          : nl
          ? '⚠️ Wijzigingen worden opgeslagen in de browser en zijn direct zichtbaar op de prijspagina.'
          : '⚠️ Changes are stored in the browser and immediately reflected on the pricing page.'}
      </p>
    </div>
  );
}

/* ────────────────────────── Page ───────────────────────────── */

export default function SiteSettingsPage() {
  const { isRTL, lang } = useLang();
  const {
    stats, setStats, resetStats,
    testimonials, setTestimonials, resetTestimonials,
    plans, setPlans, resetPlans,
    currencyRates, setCurrencyRates, resetCurrencyRates,
  } = useSiteStats();

  const fa = lang === 'fa';
  const nl = lang === 'nl';

  /* ── Tab state ── */
  const [tab, setTab] = useState<'stats' | 'testimonials' | 'plans' | 'currency'>('stats');

  /* ── Currency form state ── */
  const [currencyForm, setCurrencyForm] = useState<CurrencyRates>(currencyRates);
  const [currencySaved, setCurrencySaved] = useState(false);

  useEffect(() => { setCurrencyForm(currencyRates); }, [currencyRates]);

  const handleCurrencySave = () => {
    setCurrencyRates(currencyForm);
    setCurrencySaved(true);
    setTimeout(() => setCurrencySaved(false), 2500);
  };

  /* ── Stats form state ── */
  const [form, setForm] = useState<SiteStats>(stats);
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => { setForm(stats); }, [stats]);

  const handleStatsSave = () => {
    setStats(form);
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 2500);
  };

  /* ── Testimonials state ── */
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [addingNew, setAddingNew]   = useState(false);

  const handleAdd = (data: Omit<Testimonial, 'id'>) => {
    setTestimonials([...testimonials, { ...data, id: genId() }]);
    setAddingNew(false);
  };

  const handleEdit = (id: string, data: Omit<Testimonial, 'id'>) => {
    setTestimonials(testimonials.map((t) => t.id === id ? { ...data, id } : t));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const next = [...testimonials];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setTestimonials(next);
  };

  /* ── Labels ── */
  const L = {
    statsTab:        fa ? 'آمار صفحه اصلی'    : nl ? 'Homepage statistieken' : 'Homepage Stats',
    testimonialsTab: fa ? 'نظرات کاربران'      : nl ? 'Gebruikersreviews'     : 'Testimonials',
    plansTab:        fa ? 'پکیج‌های قیمت'     : nl ? 'Prijspakketten'        : 'Pricing Plans',
    currencyTab:     fa ? 'نرخ ارز'           : nl ? 'Wisselkoersen'         : 'Currency Rates',
    stat1Label:      fa ? 'کارجویان'           : nl ? 'Werkzoekenden'         : 'Job Seekers',
    stat2Label:      fa ? 'منتورهای متخصص'    : nl ? 'Expert mentors'        : 'Expert Mentors',
    stat3Label:      fa ? 'دوره‌ها'            : nl ? 'Cursussen'             : 'Courses',
    preview:         fa ? 'پیش‌نمایش'         : nl ? 'Voorbeeld'             : 'Preview',
    saveBtn:         fa ? 'ذخیره تغییرات'     : nl ? 'Opslaan'               : 'Save Changes',
    resetBtn:        fa ? 'بازگشت به پیش‌فرض' : nl ? 'Terugzetten'           : 'Reset to Default',
    savedMsg:        fa ? '✓ ذخیره شد'        : nl ? '✓ Opgeslagen'          : '✓ Saved',
    addBtn:          fa ? 'افزودن نظر جدید'   : nl ? 'Review toevoegen'      : 'Add Testimonial',
    resetTest:       fa ? 'بازگشت به پیش‌فرض' : nl ? 'Terugzetten'           : 'Reset to Default',
    noTestimonials:  fa ? 'هیچ نظری وجود ندارد.' : nl ? 'Geen reviews.'      : 'No testimonials yet.',
  };

  const statFields = [
    { key: 'stat1' as const, label: L.stat1Label, icon: <Users  size={18} />, color: 'text-blue-600 bg-blue-50' },
    { key: 'stat2' as const, label: L.stat2Label, icon: <Award  size={18} />, color: 'text-orange-600 bg-orange-50' },
    { key: 'stat3' as const, label: L.stat3Label, icon: <BookOpen size={18} />, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? 'تنظیمات سایت' : nl ? 'Site-instellingen' : 'Site Settings'}
        subtitle={fa ? 'محتوای صفحه اصلی را از اینجا کنترل کنید.' : nl ? 'Beheer de inhoud van de startpagina.' : 'Control homepage content from here.'}
      />

      <div className="p-6 max-w-3xl space-y-6">

        {/* ── Tabs ── */}
        <div className={cn('flex gap-1 bg-gray-100 p-1 rounded-xl w-fit', isRTL ? 'flex-row-reverse' : '')}>
          {(['stats', 'testimonials', 'plans', 'currency'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'stats' ? L.statsTab : t === 'testimonials' ? L.testimonialsTab : t === 'plans' ? L.plansTab : L.currencyTab}
            </button>
          ))}
        </div>

        {/* ══════════════ Stats tab ══════════════ */}
        {tab === 'stats' && (
          <>
            <Card>
              <CardHeader>
                <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Settings size={16} className="text-primary-600" />
                  </div>
                  <CardTitle>{L.statsTab}</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-4 mt-2">
                {statFields.map(({ key, label, icon, color }) => (
                  <div key={key}>
                    <label className={cn('flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5', isRTL ? 'flex-row-reverse' : '')}>
                      <span className={cn('w-6 h-6 rounded-md flex items-center justify-center', color)}>{icon}</span>
                      {label}
                    </label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      dir="ltr"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader><CardTitle>{L.preview}</CardTitle></CardHeader>
              <div className={cn('flex flex-wrap gap-8 mt-3 p-4 rounded-xl bg-gradient-to-br from-primary-900 to-primary-700', isRTL ? 'flex-row-reverse' : '')}>
                {statFields.map(({ key, label }) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-2xl font-bold text-white">{form[key] || '—'}</span>
                    <span className="text-xs text-white/60 mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
              <Button onClick={handleStatsSave} className="flex items-center gap-2">
                {statsSaved ? <><CheckCircle size={16} />{L.savedMsg}</> : <><Save size={16} />{L.saveBtn}</>}
              </Button>
              <Button variant="outline" onClick={resetStats} className="flex items-center gap-2 text-gray-600">
                <RotateCcw size={16} />{L.resetBtn}
              </Button>
            </div>
          </>
        )}

        {/* ══════════════ Testimonials tab ══════════════ */}
        {tab === 'testimonials' && (
          <>
            {/* Existing testimonials */}
            <div className="space-y-3">
              {testimonials.length === 0 && (
                <p className={cn('text-sm text-gray-400 text-center py-8', isRTL ? 'text-right' : '')}>
                  {L.noTestimonials}
                </p>
              )}

              {testimonials.map((item, index) => (
                <div key={item.id}>
                  {editingId === item.id ? (
                    <TestimonialForm
                      initial={{ name: item.name, nameFa: item.nameFa, role: item.role, roleFa: item.roleFa, text: item.text, textFa: item.textFa, rating: item.rating }}
                      onSave={(data) => handleEdit(item.id, data)}
                      onCancel={() => setEditingId(null)}
                      isRTL={isRTL}
                      lang={lang}
                    />
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className={cn('flex items-start justify-between gap-3', isRTL ? 'flex-row-reverse' : '')}>
                        {/* Avatar + info */}
                        <div className={cn('flex items-center gap-3 flex-1 min-w-0', isRTL ? 'flex-row-reverse' : '')}>
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                            {(fa ? item.nameFa : item.name)[0] || '?'}
                          </div>
                          <div className={cn('min-w-0', isRTL ? 'text-right' : '')}>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {fa ? item.nameFa : item.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {fa ? item.roleFa : item.role}
                            </p>
                            <div className={cn('flex gap-0.5 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className={cn('flex items-center gap-1 flex-shrink-0', isRTL ? 'flex-row-reverse' : '')}>
                          <button
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                          >
                            <ChevronUp size={15} />
                          </button>
                          <button
                            onClick={() => handleMove(index, 1)}
                            disabled={index === testimonials.length - 1}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                          >
                            <ChevronDown size={15} />
                          </button>
                          <button
                            onClick={() => { setEditingId(item.id); setAddingNew(false); }}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Quote preview */}
                      <p className={cn('text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2 italic', isRTL ? 'text-right' : '')}>
                        "{fa ? item.textFa : item.text}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new testimonial */}
            {addingNew ? (
              <TestimonialForm
                initial={{ ...EMPTY_TESTIMONIAL }}
                onSave={handleAdd}
                onCancel={() => setAddingNew(false)}
                isRTL={isRTL}
                lang={lang}
              />
            ) : (
              <button
                onClick={() => { setAddingNew(true); setEditingId(null); }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all',
                  isRTL ? 'flex-row-reverse' : ''
                )}
              >
                <Plus size={16} />
                {L.addBtn}
              </button>
            )}

            {/* Reset button */}
            <div className={cn('flex', isRTL ? 'justify-end' : '')}>
              <Button variant="outline" onClick={resetTestimonials} className="flex items-center gap-2 text-gray-600">
                <RotateCcw size={16} />{L.resetTest}
              </Button>
            </div>

            <p className={cn('text-xs text-gray-400', isRTL ? 'text-right' : '')}>
              {fa
                ? '⚠️ تغییرات در مرورگر ذخیره می‌شوند و بلافاصله در صفحه اصلی اعمال می‌گردند.'
                : nl
                ? '⚠️ Wijzigingen worden in de browser opgeslagen en zijn direct zichtbaar op de startpagina.'
                : '⚠️ Changes are stored in the browser and immediately reflected on the homepage.'}
            </p>
          </>
        )}

        {/* ══════════════ Plans tab ══════════════ */}
        {tab === 'plans' && (
          <PlansEditor
            plans={plans}
            setPlans={setPlans}
            resetPlans={resetPlans}
            isRTL={isRTL}
            fa={fa}
            nl={nl}
          />
        )}

        {/* ══════════════ Currency tab ══════════════ */}
        {tab === 'currency' && (
          <>
            <Card>
              <CardHeader>
                <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <DollarSign size={16} className="text-primary-600" />
                  </div>
                  <CardTitle>{L.currencyTab}</CardTitle>
                </div>
              </CardHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL ? 'text-right' : '')}>
                    {fa ? '۱ دلار آمریکا = چند تومان؟' : nl ? '1 USD = hoeveel Toman?' : '1 USD = how many Toman?'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currencyForm.usdToToman}
                    onChange={(e) => setCurrencyForm((p) => ({ ...p, usdToToman: Number(e.target.value) }))}
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
                <div>
                  <label className={cn('block text-sm font-medium text-gray-700 mb-1.5', isRTL ? 'text-right' : '')}>
                    {fa ? '۱ یورو = چند تومان؟' : nl ? '1 EUR = hoeveel Toman?' : '1 EUR = how many Toman?'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currencyForm.eurToToman}
                    onChange={(e) => setCurrencyForm((p) => ({ ...p, eurToToman: Number(e.target.value) }))}
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
                  />
                </div>
              </div>
            </Card>

            <p className={cn('text-xs text-gray-400', isRTL ? 'text-right' : '')}>
              {fa
                ? '⚠️ این نرخ‌ها برای تبدیل قیمت‌ها (که به تومان ذخیره می‌شوند) به ریال، دلار و یورو در صفحه قیمت‌گذاری استفاده می‌شوند.'
                : nl
                ? '⚠️ Deze koersen worden gebruikt om prijzen (opgeslagen in Toman) om te rekenen naar Rial, Dollar en Euro op de prijspagina.'
                : '⚠️ These rates are used to convert prices (stored in Toman) to Rial, Dollar, and Euro on the pricing page.'}
            </p>

            <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
              <Button onClick={handleCurrencySave} className="flex items-center gap-2">
                {currencySaved ? <><CheckCircle size={16} />{L.savedMsg}</> : <><Save size={16} />{L.saveBtn}</>}
              </Button>
              <Button variant="outline" onClick={resetCurrencyRates} className="flex items-center gap-2 text-gray-600">
                <RotateCcw size={16} />{L.resetBtn}
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
