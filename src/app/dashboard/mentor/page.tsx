'use client';

import React from 'react';
import { Users, Star, MessageSquare, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { demoRequests, demoMentors } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MentorDashboardPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const pendingRequests = demoRequests.filter(r => r.status === 'pending');
  const acceptedRequests = demoRequests.filter(r => r.status === 'accepted');

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={`${t('welcome')}, ${user?.name?.split(' ')[0]}!`} subtitle="Manage your consultations and sessions." />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('totalSessions')} value="248" icon={<Calendar size={20} />} color="blue" change={{ value: 12, label: 'this month' }} />
          <StatCard title={t('averageRating')} value="4.9 ★" icon={<Star size={20} />} color="amber" />
          <StatCard title={t('pendingRequests')} value={String(pendingRequests.length)} icon={<MessageSquare size={20} />} color="red" />
          <StatCard title={t('earnings')} value="₺ 37,200" icon={<TrendingUp size={20} />} color="green" change={{ value: 8, label: 'vs last month' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending requests */}
          <Card>
            <CardHeader>
              <CardTitle>{t('consultationRequests')}</CardTitle>
              <Link href="/dashboard/mentor/requests" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(req => (
                <div key={req.id} className={cn('p-3 bg-gray-50 rounded-xl', isRTL ? 'text-right' : '')}>
                  <div className={cn('flex items-center justify-between mb-2', isRTL ? 'flex-row-reverse' : '')}>
                    <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                      <Avatar name={req.jobSeekerName} size="sm" />
                      <span className="text-sm font-medium text-gray-900">{req.jobSeekerName}</span>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{req.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{req.message}</p>
                  <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                    <Button size="sm" variant="primary">{t('accept')}</Button>
                    <Button size="sm" variant="danger">{t('reject')}</Button>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No pending requests.</p>}
            </div>
          </Card>

          {/* Upcoming sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <Link href="/dashboard/mentor/sessions" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            <div className="space-y-3">
              {acceptedRequests.map(req => (
                <div key={req.id} className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar name={req.jobSeekerName} size="md" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{req.jobSeekerName}</p>
                    <p className="text-xs text-gray-500">{req.subject}</p>
                    {req.sessionDate && <p className="text-xs text-primary-600 mt-0.5">📅 {req.sessionDate}</p>}
                  </div>
                  <Button size="sm" variant="outline">Notes</Button>
                </div>
              ))}
              {acceptedRequests.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No upcoming sessions.</p>}
            </div>
          </Card>
        </div>

        {/* Monthly earnings chart placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings Overview</CardTitle>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </CardHeader>
          <div className="flex items-end justify-between gap-2 h-32 mt-2">
            {[40, 65, 55, 80, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-100 rounded-t-md" style={{ height: `${h}%` }}>
                  <div className="w-full bg-primary-500 rounded-t-md h-full opacity-70" />
                </div>
                <span className="text-xs text-gray-400">{['N', 'D', 'J', 'F', 'M', 'A'][i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
