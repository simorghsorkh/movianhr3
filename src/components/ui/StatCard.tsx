import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: { value: number; label: string };
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal';
  className?: string;
}

export function StatCard({ title, value, icon, change, color = 'blue', className }: StatCardProps) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    teal: 'bg-teal-50 text-teal-600',
  };

  const isPositive = change && change.value >= 0;

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(change.value)}% {change.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-xl', colors[color])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
