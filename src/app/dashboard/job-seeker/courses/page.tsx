'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Users, BookOpen } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { getPublishedCourses, enrollInCourse, getMyEnrollments } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

const levelColors = { beginner: 'success', intermediate: 'warning', advanced: 'danger' } as const;

export default function CoursesPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string>('all');
  const [enrollModal, setEnrollModal] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [allCourses, myEnrollments] = await Promise.all([
          getPublishedCourses(),
          getMyEnrollments(user.id),
        ]);
        setCourses(allCourses);
        setEnrolledIds(myEnrollments.map((e: any) => e.course_id));
      } catch {
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const filtered = courses.filter(c => {
    const matchLevel = level === 'all' || c.level === level;
    const trainerName = (c.profiles as any)?.name ?? '';
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      trainerName.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    setEnrolling(true);
    try {
      await enrollInCourse(courseId, user.id);
      setEnrolledIds(prev => [...prev, courseId]);
      setEnrollModal(null);
      const course = courses.find(c => c.id === courseId);
      toast.success(`Enrolled in "${course?.title}"! Start learning now.`);
    } catch (err: any) {
      if (err?.code === '23505') {
        toast.warning('You are already enrolled in this course.');
        setEnrolledIds(prev => [...prev, courseId]);
      } else {
        toast.error('Failed to enroll. Please try again.');
      }
      setEnrollModal(null);
    } finally {
      setEnrolling(false);
    }
  };

  const enrolledCourses = courses.filter(c => enrolledIds.includes(c.id));

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('discoverCourses')} subtitle="Browse curated courses to boost your employability." />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'sm:flex-row-reverse' : '')}>
          <div className="flex-1">
            <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'beginner', 'intermediate', 'advanced'].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn('px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors', level === l ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
              >
                {l === 'all' ? t('all') : l}
              </button>
            ))}
          </div>
        </div>

        {/* My Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">My Enrolled Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map(course => (
                <Card key={course.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-500">{(course.profiles as any)?.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <Card key={course.id} className="flex flex-col p-0 overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <BookOpen size={32} className="text-primary-400" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className={cn('flex items-center justify-between mb-2', isRTL ? 'flex-row-reverse' : '')}>
                  <Badge variant={levelColors[course.level as keyof typeof levelColors] ?? 'default'}>{course.level}</Badge>
                  {course.rating && (
                    <div className={cn('flex items-center gap-1 text-xs text-gray-500', isRTL ? 'flex-row-reverse' : '')}>
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {course.rating}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{(course.profiles as any)?.name}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{course.description}</p>
                <div className={cn('flex items-center gap-3 text-xs text-gray-400 mb-3', isRTL ? 'flex-row-reverse' : '')}>
                  {course.duration && <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>}
                  <span className="flex items-center gap-1"><Users size={12} /> {course.enrollments_count ?? 0}</span>
                </div>
                <div className={cn('flex items-center justify-between mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <span className="text-base font-bold text-gray-900">
                    {course.price ? course.price.toLocaleString('fa-IR') : 'Free'}
                    {course.price ? <span className="text-xs font-normal text-gray-500 ms-1">تومان</span> : ''}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setEnrollModal(course.id)}
                    disabled={enrolledIds.includes(course.id)}
                    variant={enrolledIds.includes(course.id) ? 'secondary' : 'primary'}
                  >
                    {enrolledIds.includes(course.id) ? '✓ Enrolled' : t('enroll')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>{courses.length === 0 ? 'No courses available yet.' : 'No courses match your search.'}</p>
          </div>
        )}
      </div>

      {/* Enroll Confirmation Modal */}
      <Modal
        isOpen={!!enrollModal}
        onClose={() => setEnrollModal(null)}
        title="Enroll in Course"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setEnrollModal(null)}>Cancel</Button>
            <Button onClick={() => enrollModal && handleEnroll(enrollModal)} loading={enrolling}>Confirm Enrollment</Button>
          </>
        }
      >
        <p className="text-gray-600">
          You're about to enroll in <strong>{courses.find(c => c.id === enrollModal)?.title}</strong>.
          You'll get full access to all course materials.
        </p>
      </Modal>
    </div>
  );
}
