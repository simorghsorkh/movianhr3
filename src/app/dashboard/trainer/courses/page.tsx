'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Archive, Globe, Trash2 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { demoCourses } from '@/lib/demoData';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Course, CourseStatus } from '@/lib/types';

export default function TrainerCoursesPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>(demoCourses.filter(c => c.trainerId === 'trainer-1'));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Course>>({});

  const saveCourse = () => {
    const isEdit = !!editing.id;
    if (isEdit) {
      setCourses(courses.map(c => c.id === editing.id ? { ...c, ...editing } as Course : c));
      toast.success('Course updated successfully!');
    } else {
      const newCourse: Course = {
        id: generateId(),
        trainerId: 'trainer-1',
        trainerName: 'Kamran Nasiri',
        title: editing.title ?? 'Untitled Course',
        titleFa: editing.titleFa ?? '',
        description: editing.description ?? '',
        descriptionFa: '',
        category: editing.category ?? 'General',
        duration: editing.duration ?? '0 hours',
        level: editing.level ?? 'beginner',
        price: editing.price ?? 0,
        status: 'draft',
        enrollments: 0,
        createdAt: new Date().toISOString().split('T')[0],
        approvalStatus: 'pending',
        thumbnail: `https://picsum.photos/seed/${Math.random()}/400/250`,
      };
      setCourses([...courses, newCourse]);
      toast.success('Course created! Submitted for admin review.');
    }
    setModalOpen(false);
    setEditing({});
  };

  const updateStatus = (id: string, status: CourseStatus) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status } : c));
    if (status === 'published') toast.success('Course published and visible to learners!');
    else if (status === 'archived') toast.info('Course archived.');
    else toast.info('Course set to draft.');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('myCourses')} />

      <div className="p-6 space-y-5">
        <div className={cn('flex justify-end', isRTL ? 'justify-start' : '')}>
          <Button onClick={() => { setEditing({}); setModalOpen(true); }}>
            <Plus size={16} /> {t('createCourse')}
          </Button>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                <img src={course.thumbnail} alt={course.title} className="w-24 h-18 object-cover rounded-xl flex-shrink-0" style={{height: '72px'}} />
                <div className="flex-1 min-w-0">
                  <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lang === 'fa' ? course.titleFa : course.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{course.category} · {course.duration} · {course.level}</p>
                    </div>
                    <div className={cn('flex items-center gap-2 flex-shrink-0', isRTL ? 'flex-row-reverse' : '')}>
                      <StatusBadge status={course.status} />
                      <Badge variant={course.approvalStatus === 'approved' ? 'success' : 'warning'}>
                        {course.approvalStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-4 text-sm text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                    <span>{course.enrollments} students</span>
                    <span>{course.price.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(course); setModalOpen(true); }}>
                      <Edit3 size={13} /> {t('edit')}
                    </Button>
                    {course.status === 'draft' && (
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(course.id, 'published')}>
                        <Globe size={13} /> {t('publishCourse')}
                      </Button>
                    )}
                    {course.status === 'published' && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(course.id, 'archived')}>
                        <Archive size={13} /> {t('archiveCourse')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing.id ? 'Edit Course' : t('createCourse')}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>{t('cancel')}</Button>
            <Button onClick={saveCourse}>{t('save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Course Title (English)" value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})} />
          <Input label="Course Title (Persian)" value={editing.titleFa ?? ''} onChange={e => setEditing({...editing, titleFa: e.target.value})} />
          <Textarea label="Description" value={editing.description ?? ''} onChange={e => setEditing({...editing, description: e.target.value})} rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('courseLevel')}
              value={editing.level ?? 'beginner'}
              onChange={e => setEditing({...editing, level: e.target.value as any})}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
            <Input label={t('courseCategory')} value={editing.category ?? ''} onChange={e => setEditing({...editing, category: e.target.value})} />
            <Input label={t('courseDurationLabel')} value={editing.duration ?? ''} onChange={e => setEditing({...editing, duration: e.target.value})} placeholder="e.g. 20 hours" />
            <Input label="Price (تومان)" type="number" value={String(editing.price ?? '')} onChange={e => setEditing({...editing, price: Number(e.target.value)})} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
