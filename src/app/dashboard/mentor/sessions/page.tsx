'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { getMentorRequests } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function MentorSessionsPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMentorRequests(user.id)
      .then(data => setSessions(data.filter((r: any) => r.status === 'accepted' || r.status === 'completed')))
      .catch(() => toast.error('Failed to load sessions.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('sessions')} subtitle="View and manage your consultation sessions." />
      <div className="p-6 space-y-4">
        {sessions.map(session => {
          const seeker = (session.seeker as any) ?? {};
          return (
            <Card key={session.id}>
              <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                <Avatar src={seeker.avatar} name={seeker.name} size="md" />
                <div className="flex-1">
                  <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                    <h3 className="font-semibold text-gray-900">{seeker.name ?? 'Job Seeker'}</h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{session.subject}</p>
                  {session.session_date && (
                    <div className={cn('flex items-center gap-1.5 text-xs text-primary-600 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                      <Calendar size={12} />
                      {session.session_date}
                    </div>
                  )}
                  {session.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <div className={cn('flex items-center gap-1 mb-1 text-xs font-semibold text-gray-500', isRTL ? 'flex-row-reverse' : '')}>
                        <FileText size={12} /> Session Notes
                      </div>
                      {session.notes}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {sessions.length === 0 && (
          <div className="text-center py-16 text-gray-400">No sessions yet.</div>
        )}
      </div>
    </div>
  );
}
