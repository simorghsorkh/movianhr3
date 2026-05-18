'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { demoCourses } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function TrainerDashboardPage() {
  const { t, lang, isRTL } = useLang();
  const { user } = useAuth();
  const myCourses = demoCourses.filter(c => c.trainerId === 'trainer-1');
  const published = myCourses.filter(c => c.status === 'published');
  const totalStudents = myCourses.reduce((sum, c) => sum + c.enrollments, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={`${t('welcome')}, ${user?.name?.split(' ')[0]}!`} subtitle="Manage your courses and students." />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('myCourses')} value={String(myCourses.length)} icon={<BookOpen size={20} />} color="purple" />
          <StatCard title={t('totalStudents')} value={String(totalStudents)} icon={<Users size={20} />} color="blue" change={{ value: 15, label: 'this month' }} />
          <StatCard title="Published" value={String(published.length)} icon={<TrendingUp size={20} />} color="green" />
          <StatCard title="Avg. Rating" value="4.8 ★" icon={<Star size={20} />} color="amber" />
        </div>

        <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
          <h2 className="text-lg font-semibold text-gray-900">{t('myCourses')}</h2>
          <Link href="/dashboard/trainer/courses">
            <Button size="sm"><BookOpen size={15} /> {t('createCourse')}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myCourses.map(course => (
            <Card key={course.id} className="flex flex-col">
              <div className={cn('flex items-start gap-3 mb-3', isRTL ? 'flex-row-reverse' : '')}>
                <img src={course.thumbnail} alt={course.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{lang === 'fa' ? course.titleFa : course.title}</h3>
                  <div className={cn('flex items-center gap-2 mt-1.5', isRTL ? 'flex-row-reverse' : '')}>
                    <StatusBadge status={course.status} />
                    <Badge variant={course.approvalStatus === 'approved' ? 'success' : 'warning'}>{course.approvalStatus}</Badge>
                  </div>
                </div>
              </div>
              <div className={cn('flex items-center justify-between text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                <span>{course.enrollments} students</span>
                {course.rating && <span className="flex items-center gap-1">★ {course.rating}</span>}
                <span>{course.duration}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
