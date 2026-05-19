'use client';

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getTrainerStudents } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function TrainerStudentsPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getTrainerStudents(user.id);
        setEnrollments(data);
      } catch {
        toast.error('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const uniqueStudents = new Set(enrollments.map(e => e.job_seeker_id)).size;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress ?? 0), 0) / enrollments.length)
    : 0;

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('students')} subtitle="Students enrolled in your courses." />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">{enrollments.length}</p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{uniqueStudents}</p>
            <p className="text-sm text-gray-500">Unique Students</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-amber-600">{avgProgress}%</p>
            <p className="text-sm text-gray-500">Avg. Progress</p>
          </Card>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title="No students yet"
            description="Students will appear here once they enroll in your courses."
          />
        ) : (
          <Card>
            <CardHeader><CardTitle>Enrolled Students</CardTitle></CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className={cn('text-left py-2.5 px-3 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Student</th>
                    <th className={cn('text-left py-2.5 px-3 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Course</th>
                    <th className={cn('text-left py-2.5 px-3 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Progress</th>
                    <th className={cn('text-left py-2.5 px-3 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr, i) => {
                    const seeker = (enr.seeker as any) ?? {};
                    const course = (enr.courses as any) ?? {};
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                            <Avatar src={seeker.avatar} name={seeker.name} size="sm" />
                            <div>
                              <span className="font-medium text-gray-900">{seeker.name ?? 'Unknown'}</span>
                              {seeker.email && <p className="text-xs text-gray-400">{seeker.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">{course.title ?? '—'}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[80px]">
                              <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${enr.progress ?? 0}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{enr.progress ?? 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">
                          {enr.created_at ? new Date(enr.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
