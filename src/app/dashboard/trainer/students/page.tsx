'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { demoJobSeekers, demoCourses } from '@/lib/demoData';
import { cn } from '@/lib/utils';

const mockStudentEnrollments = [
  { student: demoJobSeekers[0], course: demoCourses[0], progress: 65, enrolledAt: '2024-02-15' },
  { student: demoJobSeekers[1], course: demoCourses[0], progress: 32, enrolledAt: '2024-03-01' },
  { student: demoJobSeekers[0], course: demoCourses[2], progress: 90, enrolledAt: '2024-01-20' },
];

export default function TrainerStudentsPage() {
  const { t, lang, isRTL } = useLang();

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('students')} subtitle="Students enrolled in your courses." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">{mockStudentEnrollments.length}</p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-gray-500">Unique Students</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-amber-600">62%</p>
            <p className="text-sm text-gray-500">Avg. Completion</p>
          </Card>
        </div>

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
                {mockStudentEnrollments.map((enr, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                        <Avatar src={enr.student.avatar} name={enr.student.name} size="sm" />
                        <span className="font-medium text-gray-900">{enr.student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">{lang === 'fa' ? enr.course.titleFa : enr.course.title}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[80px]">
                          <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${enr.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{enr.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-xs">{enr.enrolledAt}</td>
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
