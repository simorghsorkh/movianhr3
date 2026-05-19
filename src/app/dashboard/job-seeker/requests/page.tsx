'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMyRequests } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function RequestsPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getMyRequests(user.id);
        setRequests(data);
      } catch {
        toast.error('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('myRequests')} subtitle="Track your consultation requests with mentors." />

      <div className="p-6 space-y-4">
        {requests.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={32} />}
            title="No requests yet"
            description="Send a consultation request to a mentor to get started."
            action={{ label: t('findMentors'), onClick: () => window.location.href = '/dashboard/job-seeker/mentors' }}
          />
        ) : (
          requests.map((req) => {
            const mentor = (req.mentor as any) ?? {};
            return (
              <Card key={req.id}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={mentor.avatar} name={mentor.name} size="md" />
                  <div className="flex-1">
                    <div className={cn('flex items-start justify-between gap-2 mb-1', isRTL ? 'flex-row-reverse' : '')}>
                      <div>
                        <h3 className="font-semibold text-gray-900">{req.subject}</h3>
                        <p className="text-sm text-gray-500">with {mentor.name ?? 'Mentor'}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{req.message}</p>
                    <div className={cn('flex flex-wrap items-center gap-4 text-xs text-gray-400', isRTL ? 'flex-row-reverse' : '')}>
                      <span className={cn('flex items-center gap-1', isRTL ? 'flex-row-reverse' : '')}>
                        <MessageSquare size={12} /> {new Date(req.created_at).toLocaleDateString()}
                      </span>
                      {req.session_date && (
                        <span className={cn('flex items-center gap-1', isRTL ? 'flex-row-reverse' : '')}>
                          <Calendar size={12} /> Session: {req.session_date}
                        </span>
                      )}
                    </div>
                    {req.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <span className="font-medium">Mentor note: </span>{req.notes}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
