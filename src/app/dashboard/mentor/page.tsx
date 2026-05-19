'use client';

import React, { useState, useEffect } from 'react';
import { Users, Star, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getMentorRequests, updateRequestStatus } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

export default function MentorDashboardPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMentorRequests(user.id)
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const pending = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');
  const completed = requests.filter(r => r.status === 'completed');

  const handleStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await updateRequestStatus(id, status);
      toast.success(status === 'accepted' ? 'Request accepted!' : 'Request rejected.');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={`${t('welcome')}, ${user?.name?.split(' ')[0]}!`} subtitle="Manage your consultations and sessions." />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('totalSessions')} value={String(completed.length)} icon={<Calendar size={20} />} color="blue" />
          <StatCard title={t('averageRating')} value="—" icon={<Star size={20} />} color="amber" />
          <StatCard title={t('pendingRequests')} value={String(pending.length)} icon={<MessageSquare size={20} />} color="red" />
          <StatCard title="Active Sessions" value={String(accepted.length)} icon={<TrendingUp size={20} />} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>{t('consultationRequests')}</CardTitle>
              <Link href="/dashboard/mentor/requests" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            {loading ? (
              <div className="space-y-3">{Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 3).map(req => {
                  const seeker = (req.seeker as any) ?? {};
                  return (
                    <div key={req.id} className={cn('p-3 bg-gray-50 rounded-xl', isRTL ? 'text-right' : '')}>
                      <div className={cn('flex items-center justify-between mb-2', isRTL ? 'flex-row-reverse' : '')}>
                        <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                          <Avatar src={seeker.avatar} name={seeker.name} size="sm" />
                          <span className="text-sm font-medium text-gray-900">{seeker.name ?? 'Job Seeker'}</span>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{req.subject}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{req.message}</p>
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="primary" onClick={() => handleStatus(req.id, 'accepted')}>{t('accept')}</Button>
                        <Button size="sm" variant="danger" onClick={() => handleStatus(req.id, 'rejected')}>{t('reject')}</Button>
                      </div>
                    </div>
                  );
                })}
                {pending.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No pending requests.</p>}
              </div>
            )}
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <Link href="/dashboard/mentor/requests" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            {loading ? (
              <div className="space-y-3">{Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : (
              <div className="space-y-3">
                {accepted.slice(0, 4).map(req => {
                  const seeker = (req.seeker as any) ?? {};
                  return (
                    <div key={req.id} className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                      <Avatar src={seeker.avatar} name={seeker.name} size="md" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{seeker.name ?? 'Job Seeker'}</p>
                        <p className="text-xs text-gray-500">{req.subject}</p>
                      </div>
                    </div>
                  );
                })}
                {accepted.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No active sessions.</p>}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
