'use client';

import React, { useState } from 'react';
import { Check, X, BookOpen, Users, UserCheck } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { demoMentors, demoTrainers, demoCourses } from '@/lib/demoData';
import { cn } from '@/lib/utils';
import type { ApprovalStatus } from '@/lib/types';

export default function AdminApprovalsPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const [mentors, setMentors] = useState(demoMentors);
  const [trainers, setTrainers] = useState(demoTrainers);
  const [courses, setCourses] = useState(demoCourses);
  const [tab, setTab] = useState<'mentors' | 'trainers' | 'courses'>('mentors');

  const approveMentor = (id: string, status: ApprovalStatus) => {
    const mentor = mentors.find(m => m.id === id);
    setMentors(mentors.map(m => m.id === id ? { ...m, approvalStatus: status } : m));
    if (status === 'approved') toast.success(`${mentor?.name} has been approved as a mentor.`);
    else toast.warning(`${mentor?.name}'s application has been rejected.`);
  };
  const approveTrainer = (id: string, status: ApprovalStatus) => {
    const trainer = trainers.find(tr => tr.id === id);
    setTrainers(trainers.map(tr => tr.id === id ? { ...tr, approvalStatus: status } : tr));
    if (status === 'approved') toast.success(`${trainer?.name} has been approved as a trainer.`);
    else toast.warning(`${trainer?.name}'s application has been rejected.`);
  };
  const approveCourse = (id: string, status: ApprovalStatus) => {
    const course = courses.find(c => c.id === id);
    setCourses(courses.map(c => c.id === id ? { ...c, approvalStatus: status } : c));
    if (status === 'approved') toast.success(`"${course?.title}" has been approved.`);
    else toast.warning(`"${course?.title}" has been rejected.`);
  };

  const pendingMentors = mentors.filter(m => m.approvalStatus === 'pending');
  const pendingTrainers = trainers.filter(t => t.approvalStatus === 'pending');
  const pendingCourses = courses.filter(c => c.approvalStatus === 'pending');

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('approvals')} subtitle="Review and approve mentor, trainer, and course applications." />

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
          {[
            { key: 'mentors', label: `Mentors (${pendingMentors.length} pending)`, icon: <UserCheck size={14} /> },
            { key: 'trainers', label: `Trainers (${pendingTrainers.length} pending)`, icon: <Users size={14} /> },
            { key: 'courses', label: `Courses (${pendingCourses.length} pending)`, icon: <BookOpen size={14} /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors', tab === t.key ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Mentor approvals */}
        {tab === 'mentors' && (
          <div className="space-y-4">
            {mentors.map(mentor => (
              <Card key={mentor.id}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={mentor.avatar} name={mentor.name} size="lg" />
                  <div className="flex-1">
                    <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                      <div>
                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                      </div>
                      <StatusBadge status={mentor.approvalStatus} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{mentor.bio}</p>
                    <div className={cn('flex flex-wrap gap-1.5 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                      {mentor.expertise.map(e => <Badge key={e} variant="info">{e}</Badge>)}
                    </div>
                    <div className={cn('flex items-center gap-2 text-sm text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                      <span>Rate: {mentor.hourlyRate?.toLocaleString('fa-IR')} تومان/hr</span>
                      <span>·</span>
                      <span>Applied: {mentor.createdAt}</span>
                    </div>
                    {mentor.approvalStatus === 'pending' && (
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="primary" onClick={() => approveMentor(mentor.id, 'approved')}>
                          <Check size={14} /> {t('approveMentor')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => approveMentor(mentor.id, 'rejected')}>
                          <X size={14} /> {t('reject')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Trainer approvals */}
        {tab === 'trainers' && (
          <div className="space-y-4">
            {trainers.map(trainer => (
              <Card key={trainer.id}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={trainer.avatar} name={trainer.name} size="lg" />
                  <div className="flex-1">
                    <div className={cn('flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
                      <div>
                        <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                        <p className="text-sm text-gray-500">{trainer.email}</p>
                      </div>
                      <StatusBadge status={trainer.approvalStatus} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{trainer.bio}</p>
                    <p className="text-sm text-gray-500 mt-1">Specialization: {(trainer.specialization ?? []).join(', ')}</p>
                    {trainer.approvalStatus === 'pending' && (
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="primary" onClick={() => approveTrainer(trainer.id, 'approved')}>
                          <Check size={14} /> {t('approveTrainer')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => approveTrainer(trainer.id, 'rejected')}>
                          <X size={14} /> {t('reject')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Course approvals */}
        {tab === 'courses' && (
          <div className="space-y-4">
            {courses.map(course => (
              <Card key={course.id}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <img src={course.thumbnail} alt="" className="w-24 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                      <div>
                        <h3 className="font-semibold text-gray-900">{lang === 'fa' ? course.titleFa : course.title}</h3>
                        <p className="text-sm text-gray-500">by {course.trainerName}</p>
                      </div>
                      <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
                        <StatusBadge status={course.status} />
                        <StatusBadge status={course.approvalStatus} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lang === 'fa' ? course.descriptionFa : course.description}</p>
                    <div className={cn('flex gap-4 text-xs text-gray-500 mt-2', isRTL ? 'flex-row-reverse' : '')}>
                      <span>{course.level}</span><span>{course.duration}</span><span>{course.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    {course.approvalStatus === 'pending' && (
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="primary" onClick={() => approveCourse(course.id, 'approved')}>
                          <Check size={14} /> {t('approveCourse')}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => approveCourse(course.id, 'rejected')}>
                          <X size={14} /> {t('reject')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
