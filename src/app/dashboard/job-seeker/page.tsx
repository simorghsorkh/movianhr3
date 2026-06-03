'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, FileText, Map, Users, BookOpen,
  MessageSquare, User, ClipboardList, Lock, CheckCircle,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureAccess } from '@/contexts/FeatureAccessContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { FEATURES } from '@/lib/features';
import { getMyRequests, getMyEnrollments, getJobSeekerProfile } from '@/lib/supabase/dal';
import { cn, toPersianNum } from '@/lib/utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  assessment:  <ClipboardList size={28} />,
  'cv-builder': <FileText size={28} />,
  roadmap:     <Map size={28} />,
  mentors:     <Users size={28} />,
  courses:     <BookOpen size={28} />,
  requests:    <MessageSquare size={28} />,
  profile:     <User size={28} />,
};

export default function JobSeekerDashboardPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const { hasAccess } = useFeatureAccess();
  const fa = lang === 'fa';

  const [loading, setLoading] = useState(true);
  const [requests, setRequests]     = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [jsProfile, setJsProfile]   = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMyRequests(user.id),
      getMyEnrollments(user.id),
      getJobSeekerProfile(user.id),
    ])
      .then(([reqs, enrs, profile]) => {
        setRequests(reqs);
        setEnrollments(enrs);
        setJsProfile(profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const score = jsProfile?.employability_score ?? null;

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? `خوش آمدید، ${user?.name?.split(' ')[0] ?? ''}!` : `Welcome, ${user?.name?.split(' ')[0] ?? 'there'}!`}
        subtitle={fa ? 'به داشبورد شغلی خود دسترسی دارید.' : "Access your career tools below."}
      />

      <div className="p-6 space-y-8">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          ) : (
            <>
              <StatCard
                title={fa ? 'امتیاز استخدام' : 'Employability'}
                value={score ? (fa ? `${toPersianNum(score)}/۱۰۰` : `${score}/100`) : (fa ? 'انجام نشده' : 'Not taken')}
                icon={<TrendingUp size={20} />}
                color="blue"
              />
              <StatCard
                title={fa ? 'تکمیل پروفایل' : 'Profile'}
                value={fa ? `${toPersianNum(jsProfile ? 85 : 40)}٪` : `${jsProfile ? 85 : 40}%`}
                icon={<CheckCircle size={20} />}
                color="green"
              />
              <StatCard
                title={fa ? 'درخواست‌ها' : 'Requests'}
                value={fa ? toPersianNum(requests.length) : String(requests.length)}
                icon={<MessageSquare size={20} />}
                color="amber"
              />
              <StatCard
                title={fa ? 'دوره‌ها' : 'Courses'}
                value={fa ? toPersianNum(enrollments.length) : String(enrollments.length)}
                icon={<BookOpen size={20} />}
                color="purple"
              />
            </>
          )}
        </div>

        {/* ── Feature Grid ── */}
        <div>
          <h2 className={cn('text-base font-semibold text-gray-700 mb-4', isRTL ? 'text-right' : '')}>
            {fa ? 'ابزارهای شما' : 'Your Tools'}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature) => {
              const accessible = user ? hasAccess(user.id, feature.key) : true;
              const label = fa ? feature.labelFa : feature.labelEn;
              const desc  = fa ? feature.descFa  : feature.descEn;

              const card = (
                <div
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-center min-h-[140px]',
                    feature.border,
                    accessible
                      ? `${feature.color} hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-white hover:bg-opacity-60`
                      : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-60'
                  )}
                >
                  {/* Lock overlay for restricted features */}
                  {!accessible && (
                    <div className="absolute top-2 end-2">
                      <Lock size={14} className="text-gray-400" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center',
                    accessible ? feature.color : 'bg-gray-100 text-gray-300'
                  )}>
                    {ICON_MAP[feature.key]}
                  </div>

                  {/* Label */}
                  <div>
                    <p className={cn('text-sm font-semibold', accessible ? 'text-gray-900' : 'text-gray-400')}>
                      {label}
                    </p>
                    <p className={cn('text-xs mt-0.5', accessible ? 'text-gray-500' : 'text-gray-300')}>
                      {accessible ? desc : (fa ? 'دسترسی محدود شده' : 'Access restricted')}
                    </p>
                  </div>
                </div>
              );

              return accessible ? (
                <Link key={feature.key} href={feature.href}>
                  {card}
                </Link>
              ) : (
                <div key={feature.key}>{card}</div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
