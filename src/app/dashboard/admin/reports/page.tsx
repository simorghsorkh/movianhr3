'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, MessageSquare, Download } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AdminReportsPage() {
  const { t, isRTL } = useLang();

  const monthlyData = [
    { month: 'Nov', users: 142, sessions: 89, courses: 7 },
    { month: 'Dec', users: 168, sessions: 112, courses: 9 },
    { month: 'Jan', users: 195, sessions: 134, courses: 12 },
    { month: 'Feb', users: 221, sessions: 167, courses: 15 },
    { month: 'Mar', users: 289, sessions: 198, courses: 18 },
    { month: 'Apr', users: 341, sessions: 241, courses: 23 },
  ];

  const maxUsers = Math.max(...monthlyData.map(d => d.users));

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('systemReports')} subtitle="Platform analytics and growth metrics." />
      <div className="p-6 space-y-6">
        {/* Export button */}
        <div className={cn('flex justify-end', isRTL ? 'justify-start' : '')}>
          <Button variant="outline" size="sm"><Download size={14} /> Export Report</Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), change: `+${adminStats.monthlyGrowth}%`, color: 'text-primary-600' },
            { label: 'Monthly Growth', value: `${adminStats.monthlyGrowth}%`, change: '+2.1% vs prev', color: 'text-green-600' },
            { label: 'Platform Revenue', value: '₺ 1.2M', change: '+24% this month', color: 'text-amber-600' },
            { label: 'Avg. Session Rating', value: '4.82 ★', change: '+0.12 this month', color: 'text-orange-600' },
          ].map(item => (
            <Card key={item.label} className="text-center">
              <p className={`text-2xl font-bold mb-1 ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-500 mb-2">{item.label}</p>
              <p className="text-xs text-green-600 font-medium">{item.change}</p>
            </Card>
          ))}
        </div>

        {/* Growth chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly User Growth</CardTitle>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </CardHeader>
          <div className={cn('flex items-end justify-between gap-3 h-40 pt-4', isRTL ? 'flex-row-reverse' : '')}>
            {monthlyData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{d.users}</span>
                <div
                  className="w-full bg-primary-500 rounded-t-md min-h-[4px] opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(d.users / maxUsers) * 100}%` }}
                  title={`${d.users} new users`}
                />
                <span className="text-xs font-medium text-gray-600">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Breakdown table */}
        <Card>
          <CardHeader><CardTitle>Monthly Breakdown</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className={cn('text-left py-2.5 px-3 text-xs text-gray-500 font-semibold', isRTL ? 'text-right' : '')}>Month</th>
                  <th className={cn('text-left py-2.5 px-3 text-xs text-gray-500 font-semibold', isRTL ? 'text-right' : '')}>New Users</th>
                  <th className={cn('text-left py-2.5 px-3 text-xs text-gray-500 font-semibold', isRTL ? 'text-right' : '')}>Sessions</th>
                  <th className={cn('text-left py-2.5 px-3 text-xs text-gray-500 font-semibold', isRTL ? 'text-right' : '')}>New Courses</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(d => (
                  <tr key={d.month} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium text-gray-900">{d.month} 2024</td>
                    <td className="py-2.5 px-3 text-gray-600">{d.users}</td>
                    <td className="py-2.5 px-3 text-gray-600">{d.sessions}</td>
                    <td className="py-2.5 px-3 text-gray-600">{d.courses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
