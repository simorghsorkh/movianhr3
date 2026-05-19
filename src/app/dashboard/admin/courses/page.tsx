'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function AdminCoursesPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const sb = createClient();
        const { data } = await sb
          .from('courses')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false });
        setCourses(data ?? []);
      } catch {
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = courses.filter(c => {
    const trainerName = (c.profiles as any)?.name ?? '';
    const matchStatus = statusFilter === 'all' || c.status === statusFilter || c.approval_status === statusFilter;
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || trainerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('courses')} subtitle={`${courses.length} total courses on the platform.`} />
      <div className="p-6 space-y-5">
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <div className="flex-1">
            <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
          </div>
          <div className={cn('flex gap-2 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'published', 'draft', 'archived', 'pending', 'approved'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Course</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Trainer</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Level</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Students</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Status</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(course => (
                    <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-10 h-8 object-cover rounded-lg" />
                          ) : (
                            <div className="w-10 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                              <BookOpen size={14} className="text-primary-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900 max-w-[200px] truncate">{course.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{(course.profiles as any)?.name ?? '—'}</td>
                      <td className="py-3 px-4"><Badge variant="default">{course.level}</Badge></td>
                      <td className="py-3 px-4 text-gray-600">{course.enrollments_count ?? 0}</td>
                      <td className="py-3 px-4"><StatusBadge status={course.status} /></td>
                      <td className="py-3 px-4"><StatusBadge status={course.approval_status} /></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-gray-400">No courses found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              {filtered.length} courses shown
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
