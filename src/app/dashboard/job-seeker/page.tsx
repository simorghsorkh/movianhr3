'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Route, Package, User, TrendingUp, MessageSquare, BookOpen,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureAccess } from '@/contexts/FeatureAccessContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { FEATURES } from '@/lib/features';
import { getMyRequests, getMyEnrollments, getJobSeekerProfile } from '@/lib/supabase/dal';
import { cn, toPersianNum } from '@/lib/utils';

export default function JobSeekerDashboardPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const { hasAccess } = useFeatureAccess();
  const fa  = lang === 'fa';
  const nl  = lang === 'nl';

  const [loading, setLoading] = useState(true);
  const [requests, setRequests]       = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [jsProfile, setJsProfile]     = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([getMyRequests(user.id), getMyEnrollments(user.id), getJobSeekerProfile(user.id)])
      .then(([reqs, enrs, profile]) => { setRequests(reqs); setEnrollments(enrs); setJsProfile(profile); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const score = jsProfile?.employability_score ?? null;
  const activeFeatures = user ? FEATURES.filter((f) => hasAccess(user.id, f.key)).length : FEATURES.length;
  const ChevronEnd = isRTL ? ChevronLeft : ChevronRight;

  const navCards = [
    {
      href: '/dashboard/job-seeker/journey',
      icon: <Route size={28} />,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-100',
      title: fa ? 'مسیر من' : nl ? 'Mijn traject' : 'My Journey',
      desc:  fa ? 'اپلای‌ها، مصاحبه‌ها و تقویم جلسات' : nl ? 'Sollicitaties, interviews en agenda' : 'Applications, interviews & schedule',
      badge: loading ? null : (
        <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
          {fa ? toPersianNum(requests.length) : requests.length}
        </span>
      ),
    },
    {
      href: '/dashboard/job-seeker/services',
      icon: <Package size={28} />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-100',
      title: fa ? 'خدمات من' : nl ? 'Mijn diensten' : 'My Services',
      desc:  fa ? 'خدمات فعال در پکیج شما' : nl ? 'Actieve diensten in uw pakket' : 'Active features in your plan',
      badge: (
        <span className="text-xs font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
          {fa ? `${toPersianNum(activeFeatures)}/${toPersianNum(FEATURES.length)}` : `${activeFeatures}/${FEATURES.length}`}
        </span>
      ),
    },
    {
      href: '/dashboard/job-seeker/profile',
      icon: <User size={28} />,
      color: 'bg-violet-50 text-violet-600 border-violet-100',
      iconBg: 'bg-violet-100',
      title: fa ? 'پروفایل من' : nl ? 'Mijn profiel' : 'My Profile',
      desc:  fa ? 'اطلاعات شخصی و تکمیل پروفایل' : nl ? 'Persoonlijke info en profiel' : 'Personal info & profile completion',
      badge: null,
    },
  ];

  const quickLinks = [
    { href: '/dashboard/job-seeker/assessment', icon: <TrendingUp size={16} />, label: fa ? 'ارزیابی شغلی' : nl ? 'Beoordeling' : 'Assessment' },
    { href: '/dashboard/job-seeker/mentors',    icon: <User size={16} />,       label: fa ? 'مشاوران' : nl ? 'Mentoren' : 'Mentors' },
    { href: '/dashboard/job-seeker/courses',    icon: <BookOpen size={16} />,   label: fa ? 'دوره‌ها' : nl ? 'Cursussen' : 'Courses' },
    { href: '/dashboard/job-seeker/requests',   icon: <MessageSquare size={16} />, label: fa ? 'درخواست‌ها' : nl ? 'Verzoeken' : 'Requests' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? `سلام، ${user?.name?.split(' ')[0] ?? ''}!` : `Hi, ${user?.name?.split(' ')[0] ?? 'there'}!`}
        subtitle={fa ? 'به داشبورد شغلی خوش آمدید.' : nl ? 'Welkom bij uw loopbaandashboard.' : 'Welcome to your career dashboard.'}
      />

      <div className="p-5 max-w-2xl mx-auto space-y-6">

        {/* ── Employability score strip ── */}
        {!loading && score && (
          <div className={cn('flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-2xl px-4 py-3', isRTL ? 'flex-row-reverse' : '')}>
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
              <p className="text-xs text-primary-500 font-medium">
                {fa ? 'امتیاز استخدام‌پذیری شما' : nl ? 'Uw inzetbaarheidsscore' : 'Your employability score'}
              </p>
              <p className="text-sm font-bold text-primary-700">
                {fa ? `${toPersianNum(score)} از ۱۰۰` : `${score} / 100`}
              </p>
            </div>
            <Link href="/dashboard/job-seeker/assessment" className="text-xs text-primary-600 hover:underline font-medium flex-shrink-0">
              {fa ? 'جزئیات' : nl ? 'Details' : 'Details'}
            </Link>
          </div>
        )}

        {/* ── Main navigation cards ── */}
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
            : navCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={cn(
                  'flex items-center gap-4 bg-white border-2 rounded-2xl px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                  card.color,
                  isRTL ? 'flex-row-reverse' : ''
                )}
              >
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', card.iconBg)}>
                  {card.icon}
                </div>
                <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                  <div className={cn('flex items-center gap-2 mb-0.5', isRTL ? 'flex-row-reverse' : '')}>
                    <p className="text-base font-bold text-gray-900">{card.title}</p>
                    {card.badge}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{card.desc}</p>
                </div>
                <ChevronEnd size={18} className="flex-shrink-0 text-gray-300" />
              </Link>
            ))}
        </div>

        {/* ── Quick links row ── */}
        <div>
          <p className={cn('text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3', isRTL ? 'text-right' : '')}>
            {fa ? 'دسترسی سریع' : nl ? 'Snelle toegang' : 'Quick access'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors',
                  isRTL ? 'flex-row-reverse' : ''
                )}
              >
                <span className="text-gray-400">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
