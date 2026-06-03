'use client';

import React, { useState } from 'react';
import {
  Linkedin, Sparkles, CheckCircle, AlertCircle, ArrowRight,
  User, Briefcase, Star, FileText, ChevronDown, ChevronUp, Copy, Check,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

/* ── Types ── */
interface Section {
  key: string;
  labelFa: string;
  labelEn: string;
  score: number;       // 0–100
  issues: string[];
  suggestions: string[];
}

interface Analysis {
  overallScore: number;
  sections: Section[];
  rewrittenHeadline: string;
  rewrittenSummary: string;
}

/* ── Demo analysis (returned instantly in demo mode) ── */
const DEMO_ANALYSIS: Analysis = {
  overallScore: 62,
  sections: [
    {
      key: 'headline',
      labelFa: 'عنوان حرفه‌ای',
      labelEn: 'Headline',
      score: 55,
      issues: ['عنوان بسیار کوتاه است', 'کلمات کلیدی صنعت وجود ندارد'],
      suggestions: ['از کلمات کلیدی مرتبط با شغل استفاده کنید', 'تخصص اصلی خود را در عنوان ذکر کنید', 'حداکثر ۱۲۰ کاراکتر مجاز است — از همه آن استفاده کنید'],
    },
    {
      key: 'summary',
      labelFa: 'خلاصه (About)',
      labelEn: 'Summary (About)',
      score: 48,
      issues: ['خلاصه خیلی کوتاه است (کمتر از ۱۰۰ کلمه)', 'هیچ دستاورد قابل اندازه‌گیری ذکر نشده'],
      suggestions: ['حداقل ۲۰۰ کلمه بنویسید', 'دستاوردها را با عدد و ارقام بیان کنید', 'یک CTA (دعوت به اقدام) در پایان اضافه کنید'],
    },
    {
      key: 'experience',
      labelFa: 'تجربه کاری',
      labelEn: 'Work Experience',
      score: 70,
      issues: ['توضیحات شغلی به صورت وظیفه نوشته شده، نه دستاورد'],
      suggestions: ['از فعل‌های قوی شروع کنید (راه‌اندازی کردم، افزایش دادم، کاهش دادم)', 'درصد و اعداد را به توضیحات اضافه کنید'],
    },
    {
      key: 'skills',
      labelFa: 'مهارت‌ها',
      labelEn: 'Skills',
      score: 80,
      issues: [],
      suggestions: ['مهارت‌های پرتقاضا در صنعت خود را اضافه کنید', 'از endorsement های همکاران درخواست کنید'],
    },
    {
      key: 'photo',
      labelFa: 'تصویر پروفایل',
      labelEn: 'Profile Photo',
      score: 40,
      issues: ['تصویر پروفایل حرفه‌ای ندارید یا کیفیت پایین است'],
      suggestions: ['از یک عکس حرفه‌ای با پس‌زمینه ساده استفاده کنید', 'چهره باید ۶۰٪ تصویر را اشغال کند'],
    },
  ],
  rewrittenHeadline: 'Senior Frontend Developer | React & TypeScript Expert | Building Scalable Web Applications',
  rewrittenSummary: 'توسعه‌دهنده ارشد فرانت‌اند با بیش از ۵ سال تجربه در ساخت اپلیکیشن‌های وب مقیاس‌پذیر با React و TypeScript. در پروژه‌های اخیر، زمان بارگذاری را ۴۰٪ کاهش و نرخ تبدیل را ۲۵٪ افزایش داده‌ام.\n\nتخصص‌های اصلی: React.js، Next.js، TypeScript، RESTful APIs، Agile/Scrum\n\nبه دنبال فرصت‌هایی هستم که بتوانم تجربه خود را در تیم‌های نوآور به کار ببندم. برای همکاری و مشورت با من در ارتباط باشید.',
};

/* ── Score Color ── */
function scoreColor(s: number) {
  if (s >= 75) return 'text-green-600';
  if (s >= 50) return 'text-amber-500';
  return 'text-red-500';
}
function scoreBg(s: number) {
  if (s >= 75) return 'bg-green-50 border-green-200';
  if (s >= 50) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

/* ── Score Ring ── */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626';
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x={size / 2} y={size / 2} dominantBaseline="central" textAnchor="middle"
        className="rotate-90" style={{ fontSize: size * 0.22, fontWeight: 700, fill: color, transform: `rotate(90deg) translate(0px, -${size}px)` }}>
      </text>
    </svg>
  );
}

/* ── Copy Button ── */
function CopyButton({ text, fa }: { text: string; fa: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title={fa ? 'کپی' : 'Copy'}>
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}

/* ══════════════════════════════════════════ */
export default function LinkedInOptimizerPage() {
  const { lang, isRTL } = useLang();
  const fa = lang === 'fa';

  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const [profileUrl, setProfileUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('headline');

  const canAnalyze = profileUrl.trim() || (headline.trim() && summary.trim());

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setStep('analyzing');
    // Simulate API delay (replace with real Claude API call)
    await new Promise(r => setTimeout(r, 2200));
    setAnalysis(DEMO_ANALYSIS);
    setStep('result');
  };

  const handleReset = () => {
    setStep('input');
    setAnalysis(null);
    setHeadline('');
    setSummary('');
    setProfileUrl('');
    setOpenSection('headline');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? 'بهینه‌سازی لینکدین' : 'LinkedIn Optimizer'}
        subtitle={fa
          ? 'پروفایل لینکدین خود را با هوش مصنوعی تحلیل و بهبود دهید.'
          : 'Analyze and improve your LinkedIn profile with AI.'}
      />

      <div className="p-6 space-y-6 max-w-4xl">

        {/* ── Step: Input ── */}
        {step === 'input' && (
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                    <Linkedin size={20} className="text-sky-600" />
                    {fa ? 'اطلاعات پروفایل لینکدین' : 'LinkedIn Profile Info'}
                  </div>
                </CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <Input
                  label={fa ? 'آدرس پروفایل لینکدین (اختیاری)' : 'LinkedIn Profile URL (optional)'}
                  placeholder="https://linkedin.com/in/yourname"
                  value={profileUrl}
                  onChange={e => setProfileUrl(e.target.value)}
                  leftIcon={<Linkedin size={16} />}
                />

                <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">{fa ? 'یا محتوا را مستقیم وارد کنید' : 'or paste content directly'}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <Input
                  label={fa ? 'عنوان حرفه‌ای (Headline)' : 'Professional Headline'}
                  placeholder={fa ? 'مثال: توسعه‌دهنده ارشد React | ۵+ سال تجربه' : 'e.g. Senior React Developer | 5+ years experience'}
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  leftIcon={<User size={16} />}
                />

                <Textarea
                  label={fa ? 'خلاصه پروفایل (About)' : 'Profile Summary (About)'}
                  placeholder={fa ? 'متن بخش About لینکدین خود را اینجا بنویسید...' : 'Paste your LinkedIn About section here...'}
                  rows={5}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                />

                <Textarea
                  label={fa ? 'آخرین تجربه کاری (اختیاری)' : 'Most Recent Work Experience (optional)'}
                  placeholder={fa ? 'توضیحات آخرین موقعیت شغلی خود را وارد کنید...' : 'Paste your most recent job description...'}
                  rows={3}
                />
              </div>

              <div className={cn('mt-5 flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="gap-2"
                >
                  <Sparkles size={16} />
                  {fa ? 'تحلیل با هوش مصنوعی' : 'Analyze with AI'}
                </Button>
                <p className="text-xs text-gray-400 self-center">
                  {fa ? 'تحلیل ۱۵–۳۰ ثانیه طول می‌کشد' : 'Analysis takes 15–30 seconds'}
                </p>
              </div>
            </Card>

            {/* Tips */}
            <Card className="bg-sky-50 border-sky-100">
              <div className={cn('flex items-start gap-3', isRTL ? 'flex-row-reverse' : '')}>
                <Linkedin size={20} className="text-sky-600 mt-0.5 flex-shrink-0" />
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-sm font-semibold text-sky-900 mb-2">
                    {fa ? 'چه چیزی بررسی می‌شود؟' : 'What gets analyzed?'}
                  </p>
                  <ul className="text-xs text-sky-800 space-y-1">
                    {[
                      fa ? '✦ عنوان حرفه‌ای و کلمات کلیدی' : '✦ Headline & keywords',
                      fa ? '✦ خلاصه و قدرت جذب کارفرما' : '✦ Summary & employer appeal',
                      fa ? '✦ تجربه کاری و دستاوردها' : '✦ Work experience & achievements',
                      fa ? '✦ مهارت‌ها و endorsement ها' : '✦ Skills & endorsements',
                      fa ? '✦ تصویر پروفایل و banner' : '✦ Profile photo & banner',
                    ].map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Step: Analyzing ── */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center">
                <Linkedin size={36} className="text-sky-600" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-sky-600 border-t-transparent animate-spin" />
            </div>
            <div className={cn('text-center', isRTL ? 'text-right' : '')}>
              <p className="text-lg font-semibold text-gray-900">
                {fa ? 'در حال تحلیل پروفایل...' : 'Analyzing your profile...'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {fa ? 'هوش مصنوعی پروفایل شما را بررسی می‌کند' : 'AI is reviewing your LinkedIn profile'}
              </p>
            </div>
          </div>
        )}

        {/* ── Step: Result ── */}
        {step === 'result' && analysis && (
          <div className="space-y-6">

            {/* Overall score */}
            <Card>
              <div className={cn('flex items-center gap-6', isRTL ? 'flex-row-reverse' : '')}>
                {/* Ring */}
                <div className="relative flex-shrink-0">
                  <ScoreRing score={analysis.overallScore} size={90} />
                  <span className={cn(
                    'absolute inset-0 flex items-center justify-center text-xl font-bold',
                    scoreColor(analysis.overallScore)
                  )}>
                    {analysis.overallScore}
                  </span>
                </div>
                <div className={cn('flex-1', isRTL ? 'text-right' : '')}>
                  <h2 className="text-lg font-bold text-gray-900">
                    {fa ? 'امتیاز کلی پروفایل' : 'Overall Profile Score'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {analysis.overallScore >= 75
                      ? (fa ? 'پروفایل شما قوی است. چند بهبود جزئی آن را عالی می‌کند.' : 'Strong profile — a few tweaks will make it excellent.')
                      : analysis.overallScore >= 50
                        ? (fa ? 'پروفایل متوسط — با پیشنهادهای زیر آن را تقویت کنید.' : 'Average profile — apply the suggestions below to stand out.')
                        : (fa ? 'پروفایل نیاز به بهبود جدی دارد. پیشنهادها را دنبال کنید.' : 'Profile needs significant improvement. Follow the suggestions.')}
                  </p>
                  <div className={cn('flex flex-wrap gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                    {analysis.sections.map(s => (
                      <Badge key={s.key} variant={s.score >= 75 ? 'success' : s.score >= 50 ? 'warning' : 'danger'}>
                        {fa ? s.labelFa : s.labelEn}: {s.score}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Section-by-section */}
            <Card className="p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className={cn('text-sm font-semibold text-gray-900', isRTL ? 'text-right' : '')}>
                  {fa ? 'تحلیل بخش به بخش' : 'Section-by-section Analysis'}
                </h3>
              </div>

              <div className="divide-y divide-gray-50">
                {analysis.sections.map(section => {
                  const isOpen = openSection === section.key;
                  return (
                    <div key={section.key}>
                      <button
                        className={cn(
                          'w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors',
                          isRTL ? 'flex-row-reverse' : ''
                        )}
                        onClick={() => setOpenSection(isOpen ? null : section.key)}
                      >
                        {/* Score badge */}
                        <span className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border',
                          scoreBg(section.score)
                        )}>
                          {section.score}
                        </span>
                        <span className={cn('flex-1 text-sm font-medium text-gray-900', isRTL ? 'text-right' : '')}>
                          {fa ? section.labelFa : section.labelEn}
                        </span>
                        {/* Progress bar */}
                        <div className="hidden sm:flex flex-1 max-w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', section.score >= 75 ? 'bg-green-500' : section.score >= 50 ? 'bg-amber-400' : 'bg-red-400')}
                            style={{ width: `${section.score}%` }}
                          />
                        </div>
                        {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className={cn('px-5 pb-5 space-y-4', isRTL ? 'text-right' : '')}>
                          {section.issues.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                                {fa ? 'مشکلات' : 'Issues'}
                              </p>
                              {section.issues.map((issue, i) => (
                                <div key={i} className={cn('flex items-start gap-2', isRTL ? 'flex-row-reverse' : '')}>
                                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-gray-700">{issue}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                              {fa ? 'پیشنهادها' : 'Suggestions'}
                            </p>
                            {section.suggestions.map((sug, i) => (
                              <div key={i} className={cn('flex items-start gap-2', isRTL ? 'flex-row-reverse' : '')}>
                                <ArrowRight size={14} className={cn('text-green-500 mt-0.5 flex-shrink-0', isRTL ? 'rotate-180' : '')} />
                                <p className="text-sm text-gray-700">{sug}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* AI Rewritten content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Headline */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                    <Sparkles size={16} className="text-sky-500" />
                    {fa ? 'عنوان پیشنهادی AI' : 'AI-Suggested Headline'}
                  </CardTitle>
                  <CopyButton text={analysis.rewrittenHeadline} fa={fa} />
                </CardHeader>
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                  <p className={cn('text-sm text-sky-900 font-medium leading-relaxed', isRTL ? 'text-right' : '')}>
                    {analysis.rewrittenHeadline}
                  </p>
                </div>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                    <Sparkles size={16} className="text-sky-500" />
                    {fa ? 'خلاصه پیشنهادی AI' : 'AI-Suggested Summary'}
                  </CardTitle>
                  <CopyButton text={analysis.rewrittenSummary} fa={fa} />
                </CardHeader>
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <p className={cn('text-sm text-sky-900 leading-relaxed whitespace-pre-line', isRTL ? 'text-right' : '')}>
                    {analysis.rewrittenSummary}
                  </p>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
              <Button onClick={handleReset} variant="outline">
                {fa ? 'تحلیل مجدد' : 'Analyze Again'}
              </Button>
              <Button variant="primary" onClick={() => window.open('https://linkedin.com', '_blank')}>
                <Linkedin size={16} />
                {fa ? 'باز کردن لینکدین' : 'Open LinkedIn'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
