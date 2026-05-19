'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getTrainerCourses } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function TrainerDashboardPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getTrainerCourses(user.id)
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const published = courses.filter(c => c.status === 'published');
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollments_count ?? 0), 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={`${t('welcome')}, ${user?.name?.split(' ')[0]}!`} subtitle="Manage your courses and students." />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('myCourses')} value={String(courses.length)} icon={<BookOpen size={20} />} color="purple" />
          <StatCard title={t('totalStudents')} value={String(totalStudents)} icon={<Users size={20} />} color="blue" />
          <StatCard title="Published" value={String(published.length)} icon={<TrendingUp size={20} />} color="green" />
          <StatCard title="Avg. Rating" value="—" icon={<Star size={20} />} color="amber" />
        </div>

        <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
          <h2 className="text-lg font-semibold text-gray-900">{t('myCourses')}</h2>
          <Link href="/dashboard/trainer/courses">
            <Button size="sm"><BookOpen size={15} /> {t('createCourse')}</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>No courses yet. Create your first course!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map(course => (
              <Card key={course.id} className="flex flex-col">
                <div className={cn('flex items-start gap-3 mb-3', isRTL ? 'flex-row-reverse' : '')}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-16 bg-primary-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <BookOpen size={20} className="text-primary-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{course.title}</h3>
                    <div className={cn('flex items-center gap-2 mt-1.5', isRTL ? 'flex-row-reverse' : '')}>
                      <StatusBadge status={course.status} />
                      <Badge variant={course.approval_status === 'approved' ? 'success' : 'warning'}>
                        {course.approval_status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={cn('flex items-center justify-between text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <span>{course.enrollments_count ?? 0} students</span>
                  {course.duration && <span>{course.duration}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
