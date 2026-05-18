'use client';

import React, { useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { demoRequests } from '@/lib/demoData';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminRequestsPage() {
  const { t, isRTL } = useLang();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = demoRequests.filter(r => {
    const matchStatus = status === 'all' || r.status === status;
    const matchSearch = !search || r.jobSeekerName.toLowerCase().includes(search.toLowerCase()) || r.mentorName.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase());
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
                    <td className="py-3 px-4 font-medium text-gray-900">{req.jobSeekerName}</td>
                    <td className="py-3 px-4 text-gray-600">{req.mentorName}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{req.subject}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{req.createdAt}</td>
                    <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            {filtered.length} requests shown
          </div>
        </Card>
      </div>
    </div>
  );
}
