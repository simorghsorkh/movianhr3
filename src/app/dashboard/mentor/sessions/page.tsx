'use client';

import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { demoRequests } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function MentorSessionsPage() {
  const { t, isRTL } = useLang();
  const sessions = demoRequests.filter(r => r.status === 'accepted' || r.status === 'completed');

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('sessions')} subtitle="View and manage your consultation sessions." />
      <div className="p-6 space-y-4">
        {sessions.map(session => (
          <Card key={session.id}>
            <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
              <Avatar name={session.jobSeekerName} size="md" />
              <div className="flex-1">
                <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                  <h3 className="font-semibold text-gray-900">{session.jobSeekerName}</h3>
                  <StatusBadge status={session.status} />
                </div>
                <p className="text-sm text-gray-700 mt-0.5">{session.subject}</p>
                {session.sessionDate && (
                  <div className={cn('flex items-center gap-1.5 text-xs text-primary-600 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                    <Calendar size={12} />
                    {session.sessionDate}
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
        ))}
        {sessions.length === 0 && (
          <div className="text-center py-16 text-gray-400">No sessions yet.</div>
        )}
      </div>
    </div>
  );
}
