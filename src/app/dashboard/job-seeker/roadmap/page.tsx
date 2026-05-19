'use client';

import React, { useState } from 'react';
import { CheckCircle, Circle, BookOpen, Award, Briefcase, Zap, Clock } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { demoRoadmap } from '@/lib/demoData';
import { useToast } from '@/contexts/ToastContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import type { RoadmapItem } from '@/lib/types';

const categoryIcon = (cat: RoadmapItem['category']) => {
  const icons = { skill: <Zap size={16} />, course: <BookOpen size={16} />, experience: <Briefcase size={16} />, certification: <Award size={16} /> };
  return icons[cat];
};

const priorityVariant = (p: RoadmapItem['priority']): 'danger' | 'warning' | 'default' => {
  return p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'default';
};

export default function RoadmapPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const [items, setItems] = useState<RoadmapItem[]>(demoRoadmap);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const toggleComplete = (id: string) => {
    const item = items.find(i => i.id === id);
    const willComplete = !item?.completed;
    setItems(items.map(i => i.id === id ? { ...i, completed: willComplete } : i));
    if (willComplete) toast.success(`"${item?.title}" marked as complete! 🎉`);
    else toast.info(`"${item?.title}" marked as pending.`);
  };

  const completed = items.filter(i => i.completed).length;
  const progress = Math.round((completed / items.length) * 100);

  const filtered = items.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('roadmapTitle')} subtitle={t('roadmapSubtitle')} />

      <div className="p-6 space-y-6">
        {/* Progress overview */}
        <Card>
          <div className={cn('flex items-center justify-between mb-4', isRTL ? 'flex-row-reverse' : '')}>
            <div>
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-500">{completed} of {items.length} milestones completed</p>
            </div>
            <span className="text-2xl font-bold text-primary-600">{progress}%</span>
          </div>
          <Progress value={progress} color="primary" size="lg" />
          <div className={cn('flex gap-4 mt-4 text-sm', isRTL ? 'flex-row-reverse' : '')}>
            <div className="flex items-center gap-1.5 text-gray-600">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              {items.filter(i => i.priority === 'high' && !i.completed).length} high priority remaining
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              {completed} completed
            </div>
          </div>
        </Card>

        {/* Filter tabs */}
        <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors',
                filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? t('all') : f}
            </button>
          ))}
        </div>

        {/* Roadmap items */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <EmptyState
              icon={<CheckCircle size={32} />}
              title={filter === 'completed' ? 'No completed milestones yet' : 'All milestones completed!'}
              description={filter === 'completed' ? 'Start checking off your roadmap items to see them here.' : 'Great work — all pending items are done!'}
            />
          )}
          {filtered.map((item, index) => (
            <Card key={item.id} className={cn('transition-all', item.completed && 'opacity-70')}>
              <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={cn('mt-0.5 flex-shrink-0 transition-colors', item.completed ? 'text-green-500' : 'text-gray-300 hover:text-primary-500')}
                >
                  {item.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={cn('flex flex-wrap items-center gap-2 mb-1.5', isRTL ? 'flex-row-reverse' : '')}>
                    <h3 className={cn('font-semibold text-gray-900', item.completed && 'line-through text-gray-500')}>
                      {lang === 'fa' ? item.titleFa : item.title}
                    </h3>
                    <Badge variant={priorityVariant(item.priority)}>
                      {item.priority} priority
                    </Badge>
                    <Badge variant="default" className="flex items-center gap-1">
                      {categoryIcon(item.category)} {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {lang === 'fa' ? item.descriptionFa : item.description}
                  </p>
                  <div className={cn('flex items-center gap-1 text-xs text-gray-400', isRTL ? 'flex-row-reverse' : '')}>
                    <Clock size={12} />
                    Est. {item.estimatedTime}
                  </div>
                  {item.resources && item.resources.length > 0 && (
                    <div className={cn('flex flex-wrap gap-1.5 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                      {item.resources.map((r) => (
                        <span key={r} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">{r}</span>
                      ))}
                    </div>
                  )}
                </div>

                {!item.completed && (
                  <Button size="sm" variant="outline" onClick={() => toggleComplete(item.id)}>
                    {t('markComplete')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
