'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Archive, Globe, BookOpen } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { getTrainerCourses, createCourse, updateCourse } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function TrainerCoursesPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getTrainerCourses(user.id);
        setCourses(data);
      } catch {
        toast.error('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const saveCourse = async () => {
    if (!user || !editing.title) return;
    setSaving(true);
    try {
      if (editing.id) {
        // Update existing
        await updateCourse(editing.id, {
          title: editing.title,
          description: editing.description,
          category: editing.category,
          duration: editing.duration,
          level: editing.level ?? 'beginner',
          price: editing.price ? Number(editing.price) : 0,
        });
        setCourses(prev => prev.map(c => c.id === editing.id ? { ...c, ...editing } : c));
        toast.success('Course updated successfully!');
      } else {
        // Create new
        const saved = await createCourse({
          trainer_id: user.id,
          title: editing.title,
          description: editing.description ?? '',
          category: editing.category ?? 'General',
          duration: editing.duration ?? '',
          level: editing.level ?? 'beginner',
          price: editing.price ? Number(editing.price) : 0,
          status: 'draft',
          approval_status: 'pending',
          enrollments_count: 0,
        });
        setCourses(prev => [saved, ...prev]);
        toast.success('Course created! Submitted for admin review.');
      }
      setModalOpen(false);
      setEditing({});
    } catch {
      toast.error('Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCourse(id, { status });
      setCourses(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (status === 'published') toast.success('Course published and visible to learners!');
      else if (status === 'archived') toast.info('Course archived.');
      else toast.info('Course set to draft.');
    } catch {
      toast.error('Failed to update course status.');
    }
  };

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
    </div>
  );

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
          {courses.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              <p>No courses yet. Create your first course!</p>
            </div>
          )}
          {courses.map((course) => (
            <Card key={course.id}>
              <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-24 rounded-xl flex-shrink-0 object-cover" style={{ height: '72px' }} />
                ) : (
                  <div className="w-24 h-18 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0" style={{ height: '72px' }}>
                    <BookOpen size={24} className="text-primary-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{course.category} · {course.duration} · {course.level}</p>
                    </div>
                    <div className={cn('flex items-center gap-2 flex-shrink-0', isRTL ? 'flex-row-reverse' : '')}>
                      <StatusBadge status={course.status} />
                      <Badge variant={course.approval_status === 'approved' ? 'success' : 'warning'}>
                        {course.approval_status}
                      </Badge>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-4 text-sm text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                    <span>{course.enrollments_count ?? 0} students</span>
                    <span>{course.price ? course.price.toLocaleString('fa-IR') : '0'} تومان</span>
                  </div>
                  <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(course); setModalOpen(true); }}>
                      <Edit3 size={13} /> {t('edit')}
                    </Button>
                    {course.status === 'draft' && course.approval_status === 'approved' && (
                      <Button size="sm" variant="secondary" onClick={() => handleStatusChange(course.id, 'published')}>
                        <Globe size={13} /> {t('publishCourse')}
                      </Button>
                    )}
                    {course.status === 'published' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(course.id, 'archived')}>
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
            <Button onClick={saveCourse} loading={saving} disabled={!editing.title}>{t('save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Course Title *"
            value={editing.title ?? ''}
            onChange={e => setEditing({ ...editing, title: e.target.value })}
          />
          <Textarea
            label="Description"
            value={editing.description ?? ''}
            onChange={e => setEditing({ ...editing, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t('courseLevel')}
              value={editing.level ?? 'beginner'}
              onChange={e => setEditing({ ...editing, level: e.target.value })}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
            />
            <Input
              label={t('courseCategory')}
              value={editing.category ?? ''}
              onChange={e => setEditing({ ...editing, category: e.target.value })}
            />
            <Input
              label={t('courseDurationLabel')}
              value={editing.duration ?? ''}
              onChange={e => setEditing({ ...editing, duration: e.target.value })}
              placeholder="e.g. 20 hours"
            />
            <Input
              label="Price (تومان)"
              type="number"
              value={String(editing.price ?? '')}
              onChange={e => setEditing({ ...editing, price: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
