'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getApprovedMentors, sendConsultationRequest } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function MentorsPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [requestModal, setRequestModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getApprovedMentors();
        setMentors(data);
      } catch {
        toast.error('Failed to load mentors.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = mentors.filter(m => {
    const name = (m.profiles as any)?.name ?? '';
    const expertise: string[] = m.expertise ?? [];
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      expertise.some((e: string) => e.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleRequest = async () => {
    if (!user || !selectedMentor || !subject || !message) return;
    setSubmitting(true);
    try {
      await sendConsultationRequest({
        job_seeker_id: user.id,
        mentor_id: selectedMentor.id,
        subject,
        message,
        status: 'pending',
      });
      setSubmitted(prev => [...prev, selectedMentor.id]);
      setRequestModal(false);
      setSubject('');
      setMessage('');
      toast.success(`Consultation request sent to ${(selectedMentor.profiles as any)?.name}!`);
    } catch {
      toast.error('Failed to send request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('findMentors')} subtitle="Connect with industry experts who can guide your career." />

      <div className="p-6 space-y-6">
        <Input
          placeholder={`${t('search')} mentors by name or expertise...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mentor) => {
            const profile = (mentor.profiles as any) ?? {};
            const expertise: string[] = mentor.expertise ?? [];
            return (
              <Card key={mentor.id} className="flex flex-col">
                <div className={cn('flex items-start gap-3 mb-4', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={profile.avatar} name={profile.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{mentor.location}</p>
                    <div className={cn('flex items-center gap-1 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{mentor.rating ?? '—'}</span>
                      <span className="text-xs text-gray-400">· {mentor.total_sessions ?? 0} sessions</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mentor.bio}</p>

                <div className={cn('flex flex-wrap gap-1.5 mb-4', isRTL ? 'flex-row-reverse' : '')}>
                  {expertise.slice(0, 3).map((exp: string) => (
                    <Badge key={exp} variant="info">{exp}</Badge>
                  ))}
                </div>

                <div className={cn('flex items-center justify-between mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      {mentor.hourly_rate ? mentor.hourly_rate.toLocaleString('fa-IR') : '—'}
                    </span>
                    <span className="text-xs text-gray-500 ms-1">تومان/hr</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => { setSelectedMentor(mentor); setRequestModal(true); }}
                    disabled={submitted.includes(mentor.id)}
                    variant={submitted.includes(mentor.id) ? 'secondary' : 'primary'}
                  >
                    {submitted.includes(mentor.id) ? '✓ Requested' : t('requestConsultation')}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
            <p>{mentors.length === 0 ? 'No approved mentors yet.' : 'No mentors found matching your search.'}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        title={`Request Consultation — ${(selectedMentor?.profiles as any)?.name ?? ''}`}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setRequestModal(false)}>{t('cancel')}</Button>
            <Button onClick={handleRequest} disabled={!subject || !message} loading={submitting}>{t('submit')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Career transition advice" />
          <Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Describe what you'd like to discuss..." />
        </div>
      </Modal>
    </div>
  );
}
