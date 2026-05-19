'use client';

import React, { useState } from 'react';
import { Search, Star, Clock, Users, BookOpen } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { demoCourses } from '@/lib/demoData';
import { cn } from '@/lib/utils';

const levelColors = { beginner: 'success', intermediate: 'warning', advanced: 'danger' } as const;

export default function CoursesPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string>('all');
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [enrollModal, setEnrollModal] = useState<string | null>(null);

  const published = demoCourses.filter(c => c.status === 'published' && c.approvalStatus === 'approved');
  const filtered = published.filter(c => {
    const matchLevel = level === 'all' || c.level === level;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.trainerName.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const handleEnroll = (courseId: string) => {
    const course = published.find(c => c.id === courseId);
    setEnrolled([...enrolled, courseId]);
    setEnrollModal(null);
    toast.success(`Enrolled in "${course?.title}"! Start learning now.`);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('discoverCourses')} subtitle="Browse curated courses to boost your employability." />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'flex-row-reverse' : '')}>
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

        {/* Enrolled courses */}
        {enrolled.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">My Enrolled Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {published.filter(c => enrolled.includes(c.id)).map(course => (
                <Card key={course.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{lang === 'fa' ? course.titleFa : course.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1.5 w-24 bg-gray-100 rounded-full"><div className="h-1.5 w-8 bg-primary-500 rounded-full" /></div>
                      <span className="text-xs text-gray-400">33% complete</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <Card key={course.id} className="flex flex-col p-0 overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4 flex flex-col flex-1">
                <div className={cn('flex items-center justify-between mb-2', isRTL ? 'flex-row-reverse' : '')}>
                  <Badge variant={levelColors[course.level]}>{course.level}</Badge>
                  {course.rating && (
                    <div className={cn('flex items-center gap-1 text-xs text-gray-500', isRTL ? 'flex-row-reverse' : '')}>
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {course.rating}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {lang === 'fa' ? course.titleFa : course.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{course.trainerName}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                  {lang === 'fa' ? course.descriptionFa : course.description}
                </p>
                <div className={cn('flex items-center gap-3 text-xs text-gray-400 mb-3', isRTL ? 'flex-row-reverse' : '')}>
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {course.enrollments}</span>
                </div>
                <div className={cn('flex items-center justify-between mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <span className="text-base font-bold text-gray-900">{course.price.toLocaleString('fa-IR')} <span className="text-xs font-normal text-gray-500">تومان</span></span>
                  <Button
                    size="sm"
                    onClick={() => setEnrollModal(course.id)}
                    disabled={enrolled.includes(course.id)}
                    variant={enrolled.includes(course.id) ? 'secondary' : 'primary'}
                  >
                    {enrolled.includes(course.id) ? '✓ Enrolled' : t('enroll')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Enroll confirmation */}
      <Modal
        isOpen={!!enrollModal}
        onClose={() => setEnrollModal(null)}
        title="Enroll in Course"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setEnrollModal(null)}>Cancel</Button>
            <Button onClick={() => enrollModal && handleEnroll(enrollModal)}>Confirm Enrollment</Button>
          </>
        }
      >
        <p className="text-gray-600">
          You're about to enroll in <strong>{demoCourses.find(c => c.id === enrollModal)?.title}</strong>.
          In the full version, this would process payment and give you access to all course materials.
        </p>
      </Modal>
    </div>
  );
}
