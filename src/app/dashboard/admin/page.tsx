'use client';

import React from 'react';
import { Users, BookOpen, MessageSquare, TrendingUp, UserCheck, AlertCircle, Shield } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { adminStats, demoMentors, demoTrainers, demoCourses, demoRequests } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { t, isRTL } = useLang();

  const pendingMentors = demoMentors.filter(m => m.approvalStatus === 'pending');
  const pendingCourses = demoCourses.filter(c => c.approvalStatus === 'pending');
  const recentRequests = demoRequests.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Admin Dashboard" subtitle="Platform overview and management." />

      <div className="p-6 space-y-6">
        {/* Alert for pending approvals */}
        {(adminStats.pendingMentors + adminStats.pendingTrainers + adminStats.pendingCourses) > 0 && (
          <div className={cn('flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-amber-800">
                {adminStats.pendingMentors + adminStats.pendingTrainers + adminStats.pendingCourses} items need your review
              </span>
              <span className="text-amber-700 text-sm ms-1">({adminStats.pendingMentors} mentors, {adminStats.pendingTrainers} trainers, {adminStats.pendingCourses} courses)</span>
            </div>
            <Link href="/dashboard/admin/approvals">
              <button className="text-sm font-semibold text-amber-800 hover:text-amber-900">Review →</button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title={t('totalUsers')} value={adminStats.totalUsers.toLocaleString()} icon={<Users size={20} />} color="blue" change={{ value: adminStats.monthlyGrowth, label: 'this month' }} />
          <StatCard title="Job Seekers" value={adminStats.jobSeekers.toLocaleString()} icon={<TrendingUp size={20} />} color="green" />
          <StatCard title="Mentors" value={adminStats.mentors.toLocaleString()} icon={<UserCheck size={20} />} color="amber" />
          <StatCard title="Trainers" value={adminStats.trainers.toLocaleString()} icon={<Shield size={20} />} color="purple" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Courses" value={String(adminStats.totalCourses)} icon={<BookOpen size={20} />} color="teal" />
          <StatCard title="Total Requests" value={adminStats.totalRequests.toLocaleString()} icon={<MessageSquare size={20} />} color="blue" />
          <StatCard title="Pending Requests" value={String(adminStats.pendingRequests)} icon={<AlertCircle size={20} />} color="red" />
          <StatCard title={t('newThisMonth')} value="+341" icon={<TrendingUp size={20} />} color="green" change={{ value: adminStats.monthlyGrowth, label: '' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <Link href="/dashboard/admin/approvals" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            <div className="space-y-3">
              {pendingMentors.map(mentor => (
                <div key={mentor.id} className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={mentor.avatar} name={mentor.name} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-xs text-gray-500">Mentor application</p>
                  </div>
                  <StatusBadge status={mentor.approvalStatus} />
                </div>
              ))}
              {pendingCourses.map(course => (
                <div key={course.id} className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                    <BookOpen size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-500">Course by {course.trainerName}</p>
                  </div>
                  <StatusBadge status={course.approvalStatus} />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent consultation requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <Link href="/dashboard/admin/requests" className="text-sm text-primary-600">{t('viewAll')}</Link>
            </CardHeader>
            <div className="space-y-3">
              {recentRequests.map(req => (
                <div key={req.id} className={cn('p-3 bg-gray-50 rounded-xl', isRTL ? 'text-right' : '')}>
                  <div className={cn('flex items-center justify-between mb-1', isRTL ? 'flex-row-reverse' : '')}>
                    <span className="text-sm font-medium text-gray-900">{req.jobSeekerName}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-gray-600">→ {req.mentorName}: {req.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{req.createdAt}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* User role breakdown */}
        <Card>
          <CardHeader><CardTitle>{t('platformStats')}</CardTitle></CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Job Seekers', value: adminStats.jobSeekers, total: adminStats.totalUsers, color: 'bg-primary-500' },
              { label: 'Mentors', value: adminStats.mentors, total: adminStats.totalUsers, color: 'bg-orange-500' },
              { label: 'Trainers', value: adminStats.trainers, total: adminStats.totalUsers, color: 'bg-purple-500' },
            ].map(stat => (
              <div key={stat.label}>
                <div className={cn('flex justify-between text-sm mb-2', isRTL ? 'flex-row-reverse' : '')}>
                  <span className="font-medium text-gray-700">{stat.label}</span>
                  <span className="text-gray-500">{Math.round((stat.value / stat.total) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full">
                  <div className={cn('h-3 rounded-full', stat.color)} style={{ width: `${(stat.value / stat.total) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.value.toLocaleString()} users</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
