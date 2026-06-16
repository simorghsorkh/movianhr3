'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { getMyRequests } from '@/lib/supabase/dal';
import { cn, toPersianNum } from '@/lib/utils';

type Tab = 'applications' | 'interviews' | 'calendar';

export default function JourneyPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const [tab, setTab]           = useState<Tab>('applications');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyRequests(user.id)
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  /* Derived lists */
  const interviews = requests.filter(
    (r) => r.status === 'accepted' || r.session_date
  );
  const upcoming = requests
    .filter((r) => r.session_date && new Date(r.session_date) >= new Date())
    .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
  const past = requests
    .filter((r) => r.session_date && new Date(r.session_date) < new Date())
    .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());

  /* Counts */
  const counts: Record<Tab, number> = {
    applications: requests.length,
    interviews:   interviews.length,
    calendar:     upcoming.length,
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'applications', label: fa ? 'اپلای‌ها' : nl ? 'Sollicitaties' : 'Applications', icon: <MessageSquare size={15} /> },
    { key: 'interviews',   label: fa ? 'مصاحبه‌ها' : nl ? 'Interviews'     : 'Interviews',   icon: <Users size={15} /> },
    { key: 'calendar',     label: fa ? 'تقویم'     : nl ? 'Agenda'          : 'Calendar',     icon: <Calendar size={15} /> },
  ];

  const statusIcon = (status: string) => {
    if (status === 'accepted' || status === 'completed') return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'rejected') return <XCircle size={14} className="text-red-400" />;
    return <AlertCircle size={14} className="text-amber-400" />;
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    if (fa) return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric', year: 'numeric' });
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const EmptyMsg = ({ msg }: { msg: string }) => (
    <div className="text-center py-12 text-gray-400">
      <p className="text-sm">{msg}</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? 'مسیر من' : nl ? 'Mijn traject' : 'My Journey'}
        subtitle={
          fa
            ? `${toPersianNum(requests.length)} اپلای · ${toPersianNum(interviews.length)} مصاحبه · ${toPersianNum(upcoming.length)} جلسه آینده`
            : nl
            ? `${requests.length} sollicitaties · ${interviews.length} interviews · ${upcoming.length} aankomende sessies`
            : `${requests.length} applications · ${interviews.length} interviews · ${upcoming.length} upcoming sessions`
        }
      />

      <div className="p-5 max-w-2xl mx-auto space-y-5">

        {/* Summary strip */}
        {!loading && (
          <div className={cn('grid grid-cols-3 gap-3', isRTL ? '' : '')}>
            {[
              { label: fa ? 'اپلای' : nl ? 'Sollicitaties' : 'Applications', value: requests.length, color: 'bg-blue-50 text-blue-700 border-blue-100' },
              { label: fa ? 'مصاحبه' : nl ? 'Interviews' : 'Interviews',    value: interviews.length, color: 'bg-violet-50 text-violet-700 border-violet-100' },
              { label: fa ? 'آینده' : nl ? 'Aankomend' : 'Upcoming',        value: upcoming.length,  color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            ].map((s) => (
              <div key={s.label} className={cn('rounded-2xl border-2 px-3 py-3 text-center', s.color)}>
                <p className="text-2xl font-bold">{fa ? toPersianNum(s.value) : s.value}</p>
                <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div className={cn('flex gap-1 bg-gray-100 p-1 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.key
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t.icon}
              <span>{t.label}</span>
              {counts[t.key] > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none',
                  tab === t.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'
                )}>
                  {fa ? toPersianNum(counts[t.key]) : counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {/* Applications */}
            {tab === 'applications' && (
              <div className="space-y-3">
                {requests.length === 0
                  ? <EmptyMsg msg={fa ? 'هنوز اپلایی ثبت نشده.' : nl ? 'Nog geen sollicitaties.' : 'No applications yet.'} />
                  : requests.map((req) => {
                      const mentor = req.mentor ?? {};
                      return (
                        <Card key={req.id} className="p-0">
                          <div className={cn('flex items-start gap-3 p-4', isRTL ? 'flex-row-reverse' : '')}>
                            <div className="flex-shrink-0 mt-0.5">{statusIcon(req.status)}</div>
                            <div className="flex-1 min-w-0">
                              <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                                <div className={isRTL ? 'text-right' : ''}>
                                  <p className="text-sm font-semibold text-gray-900 truncate">{req.subject}</p>
                                  <p className="text-xs text-gray-500">{mentor.name ?? (fa ? 'مشاور' : 'Mentor')}</p>
                                </div>
                                <StatusBadge status={req.status} />
                              </div>
                              <p className={cn('text-xs text-gray-400 mt-1.5', isRTL ? 'text-right' : '')}>
                                <Clock size={10} className="inline mr-1" />
                                {formatDate(req.created_at)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                <div className={cn('text-center pt-1', isRTL ? '' : '')}>
                  <Link href="/dashboard/job-seeker/requests" className="text-xs text-primary-600 hover:underline">
                    {fa ? 'مشاهده همه درخواست‌ها ←' : nl ? 'Bekijk alle verzoeken →' : 'View all requests →'}
                  </Link>
                </div>
              </div>
            )}

            {/* Interviews */}
            {tab === 'interviews' && (
              <div className="space-y-3">
                {interviews.length === 0
                  ? <EmptyMsg msg={fa ? 'هنوز مصاحبه‌ای ثبت نشده.' : nl ? 'Nog geen interviews.' : 'No interviews yet.'} />
                  : interviews.map((req) => {
                      const mentor = req.mentor ?? {};
                      return (
                        <Card key={req.id} className="p-0">
                          <div className={cn('flex items-center gap-3 p-4', isRTL ? 'flex-row-reverse' : '')}>
                            <Avatar src={mentor.avatar} name={mentor.name} size="sm" />
                            <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                              <p className="text-sm font-semibold text-gray-900 truncate">{req.subject}</p>
                              <p className="text-xs text-gray-500">{mentor.name ?? (fa ? 'مشاور' : 'Mentor')}</p>
                            </div>
                            <div className={cn('text-right flex-shrink-0', isRTL ? 'text-left' : '')}>
                              <StatusBadge status={req.status} />
                              {req.session_date && (
                                <p className="text-[10px] text-gray-400 mt-1">{formatDate(req.session_date)}</p>
                              )}
                            </div>
                          </div>
                          {req.notes && (
                            <div className="mx-4 mb-3 p-2.5 bg-blue-50 rounded-lg text-xs text-blue-700">
                              {req.notes}
                            </div>
                          )}
                        </Card>
                      );
                    })}
              </div>
            )}

            {/* Calendar */}
            {tab === 'calendar' && (
              <div className="space-y-4">
                {upcoming.length > 0 && (
                  <div>
                    <p className={cn('text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2', isRTL ? 'text-right' : '')}>
                      {fa ? 'جلسات آینده' : nl ? 'Aankomende sessies' : 'Upcoming sessions'}
                    </p>
                    <div className="space-y-2">
                      {upcoming.map((req) => {
                        const mentor = req.mentor ?? {};
                        const date = new Date(req.session_date);
                        return (
                          <div
                            key={req.id}
                            className={cn('flex items-center gap-3 bg-white border-2 border-primary-100 rounded-xl px-4 py-3', isRTL ? 'flex-row-reverse' : '')}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 flex flex-col items-center justify-center">
                              <span className="text-[10px] text-primary-400 font-medium leading-tight">
                                {date.toLocaleDateString(fa ? 'fa-IR' : 'en-GB', { month: 'short' })}
                              </span>
                              <span className="text-sm font-bold text-primary-700 leading-tight">
                                {fa ? toPersianNum(date.getDate()) : date.getDate()}
                              </span>
                            </div>
                            <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                              <p className="text-sm font-semibold text-gray-900 truncate">{req.subject}</p>
                              <p className="text-xs text-gray-500">{mentor.name ?? (fa ? 'مشاور' : 'Mentor')}</p>
                            </div>
                            <Calendar size={14} className="text-primary-400 flex-shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div>
                    <p className={cn('text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2', isRTL ? 'text-right' : '')}>
                      {fa ? 'جلسات گذشته' : nl ? 'Afgelopen sessies' : 'Past sessions'}
                    </p>
                    <div className="space-y-2">
                      {past.map((req) => {
                        const mentor = req.mentor ?? {};
                        const date = new Date(req.session_date);
                        return (
                          <div
                            key={req.id}
                            className={cn('flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 opacity-70', isRTL ? 'flex-row-reverse' : '')}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                              <span className="text-[10px] text-gray-400 font-medium leading-tight">
                                {date.toLocaleDateString(fa ? 'fa-IR' : 'en-GB', { month: 'short' })}
                              </span>
                              <span className="text-sm font-bold text-gray-500 leading-tight">
                                {fa ? toPersianNum(date.getDate()) : date.getDate()}
                              </span>
                            </div>
                            <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                              <p className="text-sm font-medium text-gray-500 truncate">{req.subject}</p>
                              <p className="text-xs text-gray-400">{mentor.name ?? (fa ? 'مشاور' : 'Mentor')}</p>
                            </div>
                            <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {upcoming.length === 0 && past.length === 0 && (
                  <EmptyMsg msg={fa ? 'هنوز جلسه‌ای زمان‌بندی نشده.' : nl ? 'Nog geen sessies gepland.' : 'No sessions scheduled yet.'} />
                )}

                <div className="text-center pt-1">
                  <Link href="/dashboard/job-seeker/mentors" className="text-xs text-primary-600 hover:underline">
                    {fa ? 'یافتن مشاور برای رزرو جلسه ←' : nl ? 'Vind een mentor om te boeken →' : 'Find a mentor to book a session →'}
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
