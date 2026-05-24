'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, Award, Briefcase, Zap, Clock, Plus, Trash2 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { getRoadmapItems, toggleRoadmapItem, addRoadmapItem, deleteRoadmapItem } from '@/lib/supabase/dal';
import { toPersianNum, cn } from '@/lib/utils';

const categoryIcon = (cat: string) => {
  const icons: Record<string, React.ReactNode> = {
    skill: <Zap size={16} />,
    course: <BookOpen size={16} />,
    experience: <Briefcase size={16} />,
    certification: <Award size={16} />,
  };
  return icons[cat] ?? <Zap size={16} />;
};

const categoryLabel = (cat: string, fa: boolean) => {
  const map: Record<string, [string, string]> = {
    skill:         ['مهارت',   'Skill'],
    course:        ['دوره',    'Course'],
    experience:    ['تجربه',   'Experience'],
    certification: ['گواهی‌نامه', 'Certification'],
  };
  return fa ? (map[cat]?.[0] ?? cat) : (map[cat]?.[1] ?? cat);
};

const priorityLabel = (p: string, fa: boolean) => {
  const map: Record<string, [string, string]> = {
    high:   ['بالا',   'High'],
    medium: ['متوسط',  'Medium'],
    low:    ['پایین',  'Low'],
  };
  return fa ? (map[p]?.[0] ?? p) : (map[p]?.[1] ?? p);
};

const priorityVariant = (p: string): 'danger' | 'warning' | 'default' =>
  p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'default';

const EMPTY_FORM = { title: '', description: '', category: 'skill', priority: 'medium', estimated_time: '' };

export default function RoadmapPage() {
  const { t, lang, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();
  const fa = lang === 'fa';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getRoadmapItems(user.id);
        setItems(data);
      } catch {
        toast.error(fa ? 'بارگذاری نقشه راه ناموفق بود.' : 'Failed to load roadmap.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id);
    const willComplete = !item?.completed;
    setItems(prev => prev.map(i => i.id === id ? { ...i, completed: willComplete } : i));
    try {
      await toggleRoadmapItem(id, willComplete);
      if (willComplete) toast.success(`"${item?.title}" ${fa ? 'تکمیل شد! 🎉' : 'marked as complete! 🎉'}`);
      else toast.info(`"${item?.title}" ${fa ? 'در انتظار تنظیم شد.' : 'marked as pending.'}`);
    } catch {
      setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !willComplete } : i));
      toast.error(fa ? 'بروزرسانی آیتم ناموفق بود.' : 'Failed to update item.');
    }
  };

  const handleAdd = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    try {
      const saved = await addRoadmapItem({
        profile_id: user.id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        priority: form.priority,
        estimated_time: form.estimated_time.trim() || null,
        completed: false,
        sort_order: items.length,
      });
      setItems(prev => [...prev, saved]);
      setModalOpen(false);
      setForm({ ...EMPTY_FORM });
      toast.success(fa ? 'مایلستون به نقشه راه شما اضافه شد!' : 'Milestone added to your roadmap!');
    } catch {
      toast.error(fa ? 'افزودن مایلستون ناموفق بود.' : 'Failed to add milestone.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    try {
      await deleteRoadmapItem(id);
      toast.info(`"${item?.title}" ${fa ? 'حذف شد.' : 'removed.'}`);
    } catch {
      setItems(prev => [...prev, item]);
      toast.error(fa ? 'حذف مایلستون ناموفق بود.' : 'Failed to remove milestone.');
    }
  };

  const completed = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  const filtered = items.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const filterLabels = {
    all:       fa ? 'همه'       : t('all'),
    pending:   fa ? 'در انتظار' : 'Pending',
    completed: fa ? 'تکمیل‌شده' : 'Completed',
  };

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('roadmapTitle')} subtitle={t('roadmapSubtitle')} />

      <div className="p-6 space-y-6">

        {/* Progress overview */}
        {items.length > 0 && (
          <Card>
            <div className={cn('flex items-center justify-between mb-4', isRTL ? 'flex-row-reverse' : '')}>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="font-semibold text-gray-900">{fa ? 'پیشرفت کلی' : 'Overall Progress'}</h3>
                <p className="text-sm text-gray-500">
                  {fa
                    ? `${toPersianNum(completed)} از ${toPersianNum(items.length)} مایلستون تکمیل شده`
                    : `${completed} of ${items.length} milestones completed`}
                </p>
              </div>
              <span className="text-2xl font-bold text-primary-600">
                {fa ? `${toPersianNum(progress)}٪` : `${progress}%`}
              </span>
            </div>
            <Progress value={progress} color="primary" size="lg" />
            <div className={cn('flex gap-4 mt-4 text-sm', isRTL ? 'flex-row-reverse' : '')}>
              <div className="flex items-center gap-1.5 text-gray-600">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                {fa
                  ? `${toPersianNum(items.filter(i => i.priority === 'high' && !i.completed).length)} اولویت بالای باقی‌مانده`
                  : `${items.filter(i => i.priority === 'high' && !i.completed).length} high priority remaining`}
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                {fa ? `${toPersianNum(completed)} تکمیل‌شده` : `${completed} completed`}
              </div>
            </div>
          </Card>
        )}

        {/* Toolbar */}
        <div className={cn('flex items-center justify-between gap-4 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={15} /> {fa ? 'افزودن مایلستون' : 'Add Milestone'}
          </Button>
        </div>

        {/* Roadmap items */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-primary-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {fa ? 'نقشه راه شما خالی است' : 'Your roadmap is empty'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {fa
                  ? 'مایلستون‌های شغلی خود را اضافه کنید — مهارت‌هایی که باید بیاموزید، دوره‌هایی که باید تکمیل کنید، گواهی‌نامه‌هایی که باید کسب کنید.'
                  : 'Add your career milestones — skills to learn, courses to complete, certifications to earn.'}
              </p>
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={16} /> {fa ? 'افزودن اولین مایلستون' : 'Add First Milestone'}
              </Button>
            </Card>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {filter === 'completed'
                  ? (fa ? 'هنوز مایلستونی تکمیل نشده.' : 'No completed milestones yet.')
                  : (fa ? 'همه مایلستون‌ها تکمیل شدند! 🎉' : 'All milestones completed! 🎉')}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <Card key={item.id} className={cn('transition-all', item.completed && 'opacity-60')}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className={cn('mt-0.5 flex-shrink-0 transition-colors', item.completed ? 'text-green-500' : 'text-gray-300 hover:text-primary-500')}
                    title={item.completed ? (fa ? 'علامت‌گذاری به عنوان در انتظار' : 'Mark as pending') : (fa ? 'علامت‌گذاری به عنوان تکمیل‌شده' : 'Mark as complete')}
                  >
                    {item.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className={cn('flex flex-wrap items-center gap-2 mb-1.5', isRTL ? 'flex-row-reverse' : '')}>
                      <h3 className={cn('font-semibold text-gray-900', item.completed && 'line-through text-gray-400')}>
                        {item.title}
                      </h3>
                      {item.priority && (
                        <Badge variant={priorityVariant(item.priority)}>
                          {priorityLabel(item.priority, fa)}
                        </Badge>
                      )}
                      {item.category && (
                        <Badge variant="default" className="flex items-center gap-1">
                          {categoryIcon(item.category)} {categoryLabel(item.category, fa)}
                        </Badge>
                      )}
                    </div>
                    {item.description && <p className={cn('text-sm text-gray-600 mb-2', isRTL ? 'text-right' : '')}>{item.description}</p>}
                    {item.estimated_time && (
                      <div className={cn('flex items-center gap-1 text-xs text-gray-400', isRTL ? 'flex-row-reverse' : '')}>
                        <Clock size={12} /> {fa ? 'زمان تخمینی:' : 'Est.'} {item.estimated_time}
                      </div>
                    )}
                  </div>

                  <div className={cn('flex items-center gap-2 flex-shrink-0', isRTL ? 'flex-row-reverse' : '')}>
                    {!item.completed && (
                      <Button size="sm" variant="outline" onClick={() => toggleComplete(item.id)}>
                        {t('markComplete')}
                      </Button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title={fa ? 'حذف مایلستون' : 'Remove milestone'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setForm({ ...EMPTY_FORM }); }}
        title={fa ? 'افزودن مایلستون' : 'Add Milestone'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => { setModalOpen(false); setForm({ ...EMPTY_FORM }); }}>{t('cancel')}</Button>
            <Button onClick={handleAdd} loading={saving} disabled={!form.title.trim()}>
              <Plus size={15} /> {fa ? 'افزودن مایلستون' : 'Add Milestone'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={fa ? 'عنوان *' : 'Title *'}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder={fa ? 'مثال: یادگیری React، دریافت گواهی AWS...' : 'e.g. Learn React, Get AWS certification...'}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Textarea
            label={fa ? 'توضیحات' : 'Description'}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
            placeholder={fa ? 'این مایلستون شامل چه چیزی می‌شود...' : 'Describe what this milestone involves...'}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={fa ? 'دسته‌بندی' : 'Category'}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              options={[
                { value: 'skill',         label: fa ? '⚡ مهارت'       : '⚡ Skill' },
                { value: 'course',        label: fa ? '📚 دوره'         : '📚 Course' },
                { value: 'certification', label: fa ? '🏆 گواهی‌نامه'  : '🏆 Certification' },
                { value: 'experience',    label: fa ? '💼 تجربه'        : '💼 Experience' },
              ]}
            />
            <Select
              label={fa ? 'اولویت' : 'Priority'}
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              options={[
                { value: 'high',   label: fa ? '🔴 بالا'   : '🔴 High' },
                { value: 'medium', label: fa ? '🟡 متوسط'  : '🟡 Medium' },
                { value: 'low',    label: fa ? '🟢 پایین'  : '🟢 Low' },
              ]}
            />
          </div>
          <Input
            label={fa ? 'زمان تخمینی' : 'Estimated Time'}
            value={form.estimated_time}
            onChange={e => setForm(f => ({ ...f, estimated_time: e.target.value }))}
            placeholder={fa ? 'مثال: ۲ هفته، ۳ ماه...' : 'e.g. 2 weeks, 3 months...'}
          />
        </div>
      </Modal>
    </div>
  );
}
