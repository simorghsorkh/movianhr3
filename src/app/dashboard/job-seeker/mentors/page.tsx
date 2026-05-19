'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Search, Filter } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { demoMentors } from '@/lib/demoData';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MentorsPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<typeof demoMentors[0] | null>(null);
  const [requestModal, setRequestModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState<string[]>([]);

  const filtered = demoMentors.filter(m =>
    m.approvalStatus === 'approved' &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase())))
  );

  const handleRequest = () => {
    if (selectedMentor) {
      setSubmitted([...submitted, selectedMentor.id]);
      setRequestModal(false);
      setSubject('');
      setMessage('');
      toast.success(`Consultation request sent to ${selectedMentor.name}! They'll respond soon.`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('findMentors')} subtitle="Connect with industry experts who can guide your career." />

      <div className="p-6 space-y-6">
        {/* Search */}
        <Input
          placeholder={`${t('search')} mentors by name or expertise...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />

        {/* Mentors grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <div className={cn('flex items-start gap-3 mb-4', isRTL ? 'flex-row-reverse' : '')}>
                <Avatar src={mentor.avatar} name={mentor.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{mentor.location}</p>
                  <div className={cn('flex items-center gap-1 mt-1', isRTL ? 'flex-row-reverse' : '')}>
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                    <span className="text-xs text-gray-400">· {mentor.totalSessions} sessions</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mentor.bio}</p>

              <div className={cn('flex flex-wrap gap-1.5 mb-4', isRTL ? 'flex-row-reverse' : '')}>
                {mentor.expertise.slice(0, 3).map((exp) => (
                  <Badge key={exp} variant="info">{exp}</Badge>
                ))}
              </div>

              <div className={cn('flex items-center justify-between mt-auto pt-3 border-t border-gray-100', isRTL ? 'flex-row-reverse' : '')}>
                <div>
                  <span className="text-lg font-bold text-gray-900">{mentor.hourlyRate?.toLocaleString('fa-IR')}</span>
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
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
            <p>No mentors found matching your search.</p>
          </div>
        )}
      </div>

      {/* Request consultation modal */}
      <Modal
        isOpen={requestModal}
        onClose={() => setRequestModal(false)}
        title={`Request Consultation — ${selectedMentor?.name}`}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setRequestModal(false)}>{t('cancel')}</Button>
            <Button onClick={handleRequest} disabled={!subject || !message}>{t('submit')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Career transition advice" />
          <Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Describe what you'd like to discuss and what you're hoping to achieve from this consultation..." />
        </div>
      </Modal>

    </div>
  );
}
