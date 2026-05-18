'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { demoCourses } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function AdminCoursesPage() {
  const { t, lang, isRTL } = useLang();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = demoCourses.filter(c => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter || c.approvalStatus === statusFilter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.trainerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('courses')} subtitle={`${demoCourses.length} total courses on the platform.`} />
      <div className="p-6 space-y-5">
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <div className="flex-1">
            <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'published', 'draft', 'pending', 'approved'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                {s}
              </button>
            ))}
          </div>
        </div>

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
                        <img src={course.thumbnail} alt="" className="w-10 h-8 object-cover rounded-lg" />
                        <span className="font-medium text-gray-900 max-w-[200px] truncate">{lang === 'fa' ? course.titleFa : course.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{course.trainerName}</td>
                    <td className="py-3 px-4"><Badge variant="default">{course.level}</Badge></td>
                    <td className="py-3 px-4 text-gray-600">{course.enrollments}</td>
                    <td className="py-3 px-4"><StatusBadge status={course.status} /></td>
                    <td className="py-3 px-4"><StatusBadge status={course.approvalStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
