'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, BookOpen, Award, Briefcase, Zap, Clock } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { getRoadmapItems, toggleRoadmapItem } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

const categoryIcon = (cat: string) => {
  const icons: Record<string, React.ReactNode> = {
    skill: <Zap size={16} />,
    course: <BookOpen size={16} />,
    experience: <Briefcase size={16} />,
    certification: <Award size={16} />,
  };
  return icons[cat] ?? <Zap size={16} />;
};

const priorityVariant = (p: string): 'danger' | 'warning' | 'default' => {
  return p === 'high' ? 'danger' : p === 'medium' ? 'warning' : 'default';
};

export default function RoadmapPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getRoadmapItems(user.id);
        setItems(data);
      } catch {
        toast.error('Failed to load roadmap.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id);
    const willComplete = !item?.completed;
    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? { ...i, completed: willComplete } : i));
    try {
      await toggleRoadmapItem(id, willComplete);
      if (willComplete) toast.success(`"${item?.title}" marked as complete! 🎉`);
      else toast.info(`"${item?.title}" marked as pending.`);
    } catch {
      // Revert on failure
      setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !willComplete } : i));
      toast.error('Failed to update item.');
    }
  };

  const completed = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  const filtered = items.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

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
        )}

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
          {items.length === 0 ? (
            <EmptyState
              icon={<CheckCircle size={32} />}
              title="No roadmap items yet"
              description="Your mentor or admin will add personalized milestones to guide your career journey."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CheckCircle size={32} />}
              title={filter === 'completed' ? 'No completed milestones yet' : 'All milestones completed!'}
              description={filter === 'completed' ? 'Start checking off your roadmap items.' : 'Great work — all pending items are done!'}
            />
          ) : (
            filtered.map((item) => (
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
                        {item.title}
                      </h3>
                      {item.priority && (
                        <Badge variant={priorityVariant(item.priority)}>
                          {item.priority} priority
                        </Badge>
                      )}
                      {item.category && (
                        <Badge variant="default" className="flex items-center gap-1">
                          {categoryIcon(item.category)} {item.category}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    )}
                    {item.estimated_time && (
                      <div className={cn('flex items-center gap-1 text-xs text-gray-400', isRTL ? 'flex-row-reverse' : '')}>
                        <Clock size={12} />
                        Est. {item.estimated_time}
                      </div>
                    )}
                    {item.resources && item.resources.length > 0 && (
                      <div className={cn('flex flex-wrap gap-1.5 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                        {item.resources.map((r: string) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
