'use client';

import React, { useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminRequestsPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const sb = createClient();
        const { data } = await sb
          .from('consultation_requests')
          .select('*, seeker:job_seeker_id(name), mentor:mentor_id(name)')
          .order('created_at', { ascending: false });
        setRequests(data ?? []);
      } catch {
        toast.error('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = requests.filter(r => {
    const seekerName = (r.seeker as any)?.name ?? '';
    const mentorName = (r.mentor as any)?.name ?? '';
    const matchStatus = status === 'all' || r.status === status;
    const matchSearch = !search ||
      seekerName.toLowerCase().includes(search.toLowerCase()) ||
      mentorName.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('consultationRequests')} subtitle="All consultation requests on the platform." />
      <div className="p-6 space-y-5">
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <div className="flex-1">
            <Input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'pending', 'accepted', 'completed', 'rejected'].map(s => (
              <button key={s} onClick={() => setStatus(s)} className={cn('px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors', status === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Job Seeker</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Mentor</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Subject</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Date</th>
                    <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500', isRTL ? 'text-right' : '')}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(req => (
                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{(req.seeker as any)?.name ?? '—'}</td>
                      <td className="py-3 px-4 text-gray-600">{(req.mentor as any)?.name ?? '—'}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{req.subject}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-gray-400">No requests found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              {filtered.length} requests shown
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
