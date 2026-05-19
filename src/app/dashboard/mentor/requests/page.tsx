'use client';

import React, { useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { getMentorRequests, updateRequestStatus } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function MentorRequestsPage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [noteModal, setNoteModal] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await getMentorRequests(user.id);
        setRequests(data);
      } catch {
        toast.error('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleStatus = async (id: string, status: 'accepted' | 'rejected' | 'completed') => {
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await updateRequestStatus(id, status);
      if (status === 'accepted') toast.success('Request accepted! The job seeker will be notified.');
      else if (status === 'rejected') toast.warning('Request rejected.');
      else if (status === 'completed') toast.success('Session marked as completed.');
    } catch {
      // Revert on failure
      const data = await getMentorRequests(user!.id);
      setRequests(data);
      toast.error('Failed to update status.');
    }
  };

  const saveNote = async (id: string) => {
    setSaving(true);
    try {
      await updateRequestStatus(id, requests.find(r => r.id === id)?.status ?? 'accepted', note);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, notes: note } : r));
      setNoteModal(null);
      setNote('');
      toast.success('Session note saved successfully.');
    } catch {
      toast.error('Failed to save note.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('consultationRequests')} />

      <div className="p-6 space-y-5">
        {/* Filter */}
        <div className={cn('flex gap-2 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
          {['all', 'pending', 'accepted', 'completed', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors', filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Request list */}
        <div className="space-y-4">
          {filtered.map((req) => {
            const seeker = (req.seeker as any) ?? {};
            return (
              <Card key={req.id}>
                <div className={cn('flex items-start gap-4', isRTL ? 'flex-row-reverse' : '')}>
                  <Avatar src={seeker.avatar} name={seeker.name} size="md" />
                  <div className="flex-1">
                    <div className={cn('flex items-start justify-between gap-2', isRTL ? 'flex-row-reverse' : '')}>
                      <div>
                        <h3 className="font-semibold text-gray-900">{seeker.name ?? 'Job Seeker'}</h3>
                        <p className="text-sm font-medium text-gray-700 mt-0.5">{req.subject}</p>
                        {seeker.email && <p className="text-xs text-gray-400">{seeker.email}</p>}
                      </div>
                      <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
                        <StatusBadge status={req.status} />
                        <span className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{req.message}</p>
                    {req.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <span className="font-medium">Your note: </span>{req.notes}
                      </div>
                    )}
                    {req.status === 'pending' && (
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="primary" onClick={() => handleStatus(req.id, 'accepted')}>{t('accept')}</Button>
                        <Button size="sm" variant="danger" onClick={() => handleStatus(req.id, 'rejected')}>{t('reject')}</Button>
                      </div>
                    )}
                    {(req.status === 'accepted' || req.status === 'completed') && (
                      <div className={cn('flex gap-2 mt-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Button size="sm" variant="outline" onClick={() => { setNoteModal(req.id); setNote(req.notes ?? ''); }}>
                          {t('addNote')}
                        </Button>
                        {req.status === 'accepted' && (
                          <Button size="sm" variant="secondary" onClick={() => handleStatus(req.id, 'completed')}>
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No requests found.</div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!noteModal}
        onClose={() => setNoteModal(null)}
        title={t('addNote')}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setNoteModal(null)}>{t('cancel')}</Button>
            <Button onClick={() => noteModal && saveNote(noteModal)} loading={saving}>{t('save')}</Button>
          </>
        }
      >
        <Textarea
          label="Session Note"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={5}
          placeholder="Add notes about this session, outcomes, and follow-up actions..."
        />
      </Modal>
    </div>
  );
}
