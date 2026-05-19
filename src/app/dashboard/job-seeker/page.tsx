'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, FileText, Map, Users, BookOpen, CheckCircle,
  ArrowRight, AlertCircle, Star, X,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  getMyRequests, getMyEnrollments, getJobSeekerProfile,
  getApprovedMentors, getPublishedCourses,
} from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function JobSeekerDashboardPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [jsProfile, setJsProfile] = useState<any>(null);
  const [mentors, setMentors] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMyRequests(user.id),
      getMyEnrollments(user.id),
      getJobSeekerProfile(user.id),
      getApprovedMentors(),
      getPublishedCourses(),
    ])
      .then(([reqs, enrs, profile, ments, crs]) => {
        setRequests(reqs);
        setEnrollments(enrs);
        setJsProfile(profile);
        setMentors(ments);
        setCourses(crs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const employabilityScore = jsProfile?.employability_score ?? null;

  const quickActions = [
    { href: '/dashboard/job-seeker/assessment', icon: <TrendingUp size={20} />, label: t('careerAssessment'), color: 'text-blue-600 bg-blue-50', desc: 'Get your score' },
    { href: '/dashboard/job-seeker/cv-builder', icon: <FileText size={20} />, label: t('cvBuilder'), color: 'text-purple-600 bg-purple-50', desc: 'Build your CV' },
    { href: '/dashboard/job-seeker/roadmap', icon: <Map size={20} />, label: t('myRoadmap'), color: 'text-teal-600 bg-teal-50', desc: 'Follow your plan' },
    { href: '/dashboard/job-seeker/mentors', icon: <Users size={20} />, label: t('findMentors'), color: 'text-orange-600 bg-orange-50', desc: 'Book a session' },
  ];

  const recentRequests = requests.slice(0, 3);
  const featuredMentors = mentors.slice(0, 2);
  const featuredCourses = courses.slice(0, 2);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={`${t('welcome')}, ${user?.name?.split(' ')[0] ?? 'there'}!`}
        subtitle="Here's your career readiness overview."
      />

      <div className="p-6 space-y-6">
        {/* Incomplete assessment alert */}
        {showBanner && !employabilityScore && (
          <div className={cn('relative flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm', isRTL ? 'flex-row-reverse' : '')}>
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-amber-800">Complete your career assessment</span>
              <span className="text-amber-700 ms-1">to unlock your full employability score and personalized roadmap.</span>
            </div>
            <Link href="/dashboard/job-seeker/assessment">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-0">Start Now</Button>
            </Link>
            <button onClick={() => setShowBanner(false)} className="absolute top-2 end-2 p-1 text-amber-500 hover:text-amber-700 rounded-lg hover:bg-amber-100 transition-colors" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('employabilityScore')}
            value={employabilityScore ? `${employabilityScore}/100` : 'Not taken'}
            icon={<TrendingUp size={20} />}
            color="blue"
          />
          <StatCard
            title={t('profileCompletion')}
            value={`${jsProfile ? 85 : 40}%`}
            icon={<CheckCircle size={20} />}
            color="green"
          />
          <StatCard
            title="Requests Sent"
            value={String(requests.length)}
            icon={<Users size={20} />}
            color="amber"
          />
          <StatCard
            title="Courses Enrolled"
            value={String(enrollments.length)}
            icon={<BookOpen size={20} />}
            color="purple"
          />
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card hover className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', action.color)}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Mentors + Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured mentors */}
          <Card>
            <CardHeader>
              <CardTitle>{t('findMentors')}</CardTitle>
              <Link href="/dashboard/job-seeker/mentors" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                {t('viewAll')} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </CardHeader>
            {loading ? (
              <div className="space-y-3">{Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : featuredMentors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No mentors available yet.</p>
            ) : (
              <div className="space-y-3">
                {featuredMentors.map((mentor) => {
                  const profile = (mentor.profiles as any) ?? {};
                  const expertise: string[] = mentor.expertise ?? [];
                  return (
                    <div key={mentor.id} className={cn('flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors', isRTL ? 'flex-row-reverse' : '')}>
                      <Avatar src={profile.avatar} name={profile.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
                        <p className="text-xs text-gray-500 truncate">{expertise.slice(0, 2).join(', ')}</p>
                        {mentor.rating && (
                          <div className={cn('flex items-center gap-1 mt-0.5', isRTL ? 'flex-row-reverse' : '')}>
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-600">{mentor.rating}</span>
                          </div>
                        )}
                      </div>
                      <Link href="/dashboard/job-seeker/mentors">
                        <Button size="sm" variant="outline">{t('bookSession')}</Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Featured courses */}
          <Card>
            <CardHeader>
              <CardTitle>{t('discoverCourses')}</CardTitle>
              <Link href="/dashboard/job-seeker/courses" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                {t('viewAll')} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </CardHeader>
            {loading ? (
              <div className="space-y-3">{Array.from({length: 2}).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
            ) : featuredCourses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No courses available yet.</p>
            ) : (
              <div className="space-y-3">
                {featuredCourses.map((course) => (
                  <div key={course.id} className={cn('flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors', isRTL ? 'flex-row-reverse' : '')}>
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{course.title}</p>
                      <p className="text-xs text-gray-500">{(course.profiles as any)?.name ?? ''}</p>
                      <div className={cn('flex items-center gap-2 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                        <Badge variant="default">{course.level}</Badge>
                        <span className="text-xs text-gray-500">{course.enrollments_count ?? 0} enrolled</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent requests */}
        <Card>
          <CardHeader>
            <CardTitle>{t('myRequests')}</CardTitle>
            <Link href="/dashboard/job-seeker/requests" className="text-sm text-primary-600 hover:text-primary-700">
              {t('viewAll')}
            </Link>
          </CardHeader>
          {loading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : recentRequests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No consultation requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className={cn('text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Mentor</th>
                    <th className={cn('text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Subject</th>
                    <th className={cn('text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Date</th>
                    <th className={cn('text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => {
                    const mentor = (req.mentor as any) ?? {};
                    return (
                      <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium text-gray-900">{mentor.name ?? '—'}</td>
                        <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">{req.subject}</td>
                        <td className="py-3 px-3 text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-3"><StatusBadge status={req.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
