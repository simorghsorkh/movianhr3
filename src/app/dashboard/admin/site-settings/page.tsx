'use client';

import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Save, Users, Award, BookOpen, CheckCircle } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useSiteStats, DEFAULT_STATS, type SiteStats } from '@/contexts/SiteStatsContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function SiteSettingsPage() {
  const { isRTL, lang } = useLang();
  const { stats, setStats, resetStats } = useSiteStats();

  const [form, setForm] = useState<SiteStats>(stats);
  const [saved, setSaved] = useState(false);

  // Sync form when stats change externally
  useEffect(() => {
    setForm(stats);
  }, [stats]);

  const handleSave = () => {
    setStats(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetStats();
    setForm(DEFAULT_STATS);
  };

  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const labels = {
    title: fa ? 'تنظیمات سایت' : nl ? 'Site-instellingen' : 'Site Settings',
    subtitle: fa
      ? 'آمار و اعداد صفحه اصلی را از اینجا کنترل کنید.'
      : nl
      ? 'Beheer de statistieken op de startpagina hier.'
      : 'Control the homepage statistics from here.',
    heroStats: fa ? 'آمار صفحه اصلی' : nl ? 'Startpagina statistieken' : 'Homepage Statistics',
    heroStatsDesc: fa
      ? 'این مقادیر در بخش هیرو صفحه اصلی نمایش داده می‌شوند.'
      : nl
      ? 'Deze waarden worden getoond in de hero-sectie van de startpagina.'
      : 'These values are displayed in the hero section of the homepage.',
    stat1Label: fa ? 'کارجویان' : nl ? 'Werkzoekenden' : 'Job Seekers',
    stat1Placeholder: fa ? 'مثال: 1,500+' : nl ? 'Bijv. 1.500+' : 'e.g. 1,500+',
    stat2Label: fa ? 'منتورهای متخصص' : nl ? 'Expert mentors' : 'Expert Mentors',
    stat2Placeholder: fa ? 'مثال: 180+' : nl ? 'Bijv. 180+' : 'e.g. 180+',
    stat3Label: fa ? 'دوره‌ها' : nl ? 'Cursussen' : 'Courses',
    stat3Placeholder: fa ? 'مثال: 90+' : nl ? 'Bijv. 90+' : 'e.g. 90+',
    preview: fa ? 'پیش‌نمایش' : nl ? 'Voorbeeld' : 'Preview',
    previewDesc: fa
      ? 'این آمار در صفحه اصلی نمایش داده خواهد شد:'
      : nl
      ? 'Deze statistieken worden getoond op de startpagina:'
      : 'These stats will appear on the homepage:',
    saveBtn: fa ? 'ذخیره تغییرات' : nl ? 'Wijzigingen opslaan' : 'Save Changes',
    resetBtn: fa ? 'بازگشت به پیش‌فرض' : nl ? 'Terugzetten naar standaard' : 'Reset to Default',
    savedMsg: fa ? '✓ با موفقیت ذخیره شد' : nl ? '✓ Opgeslagen' : '✓ Saved successfully',
  };

  const statFields: { key: keyof SiteStats; label: string; placeholder: string; icon: React.ReactNode; color: string }[] = [
    { key: 'stat1', label: labels.stat1Label, placeholder: labels.stat1Placeholder, icon: <Users size={18} />, color: 'text-blue-600 bg-blue-50' },
    { key: 'stat2', label: labels.stat2Label, placeholder: labels.stat2Placeholder, icon: <Award size={18} />, color: 'text-orange-600 bg-orange-50' },
    { key: 'stat3', label: labels.stat3Label, placeholder: labels.stat3Placeholder, icon: <BookOpen size={18} />, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={labels.title} subtitle={labels.subtitle} />

      <div className="p-6 space-y-6 max-w-3xl">

        {/* Hero stats editor */}
        <Card>
          <CardHeader>
            <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <Settings size={16} className="text-primary-600" />
              </div>
              <div>
                <CardTitle>{labels.heroStats}</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">{labels.heroStatsDesc}</p>
              </div>
            </div>
          </CardHeader>

          <div className="space-y-4 mt-2">
            {statFields.map(({ key, label, placeholder, icon, color }) => (
              <div key={key}>
                <label className={cn('flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5', isRTL ? 'flex-row-reverse' : '')}>
                  <span className={cn('w-6 h-6 rounded-md flex items-center justify-center', color)}>
                    {icon}
                  </span>
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  dir="ltr"
                  className={cn(
                    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all',
                    isRTL ? 'text-right' : 'text-left'
                  )}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{labels.preview}</CardTitle>
            <p className="text-xs text-gray-500">{labels.previewDesc}</p>
          </CardHeader>
          <div className={cn('flex flex-wrap gap-8 mt-3 p-4 rounded-xl bg-gradient-to-br from-primary-900 to-primary-700', isRTL ? 'flex-row-reverse' : '')}>
            {statFields.map(({ key, label }) => (
              <div key={key} className="flex flex-col">
                <span className="text-2xl font-bold text-white">{form[key] || '—'}</span>
                <span className="text-xs text-white/60 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Action buttons */}
        <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <Button onClick={handleSave} className="flex items-center gap-2">
            {saved ? (
              <>
                <CheckCircle size={16} />
                {labels.savedMsg}
              </>
            ) : (
              <>
                <Save size={16} />
                {labels.saveBtn}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 text-gray-600">
            <RotateCcw size={16} />
            {labels.resetBtn}
          </Button>
        </div>

        {/* Info note */}
        <p className={cn('text-xs text-gray-400', isRTL ? 'text-right' : '')}>
          {fa
            ? '⚠️ تغییرات در مرورگر ذخیره می‌شوند. در آینده این آمار به صورت real-time از پایگاه داده خوانده خواهد شد.'
            : nl
            ? '⚠️ Wijzigingen worden opgeslagen in de browser. In de toekomst worden deze statistieken real-time uit de database geladen.'
            : '⚠️ Changes are stored in the browser. In a future update, these stats will be pulled in real-time from the database.'}
        </p>
      </div>
    </div>
  );
}
