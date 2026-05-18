'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { demoAdminUsers } from '@/lib/demoData';
import { cn } from '@/lib/utils';

const roleColors: Record<string, 'info' | 'warning' | 'purple' | 'danger'> = {
  'job-seeker': 'info',
  mentor: 'warning',
  trainer: 'purple',
  admin: 'danger',
};

export default function AdminUsersPage() {
  const { t, isRTL } = useLang();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = demoAdminUsers.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('userManagement')} subtitle={`${demoAdminUsers.length} total users`} />

      <div className="p-6 space-y-5">
        <div className={cn('flex flex-col sm:flex-row gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <div className="flex-1">
            <Input placeholder={`${t('search')} users...`} value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'job-seeker', 'mentor', 'trainer', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn('px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors', roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
              >
                {r === 'all' ? t('all') : r}
              </button>
            ))}
          </div>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>User</th>
                  <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Email</th>
                  <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Role</th>
                  <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Joined</th>
                  <th className={cn('text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : '')}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                        <Avatar name={user.name} size="sm" />
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={roleColors[user.role] ?? 'default'}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{user.createdAt}</td>
                    <td className="py-3 px-4">
                      {user.approvalStatus ? <StatusBadge status={user.approvalStatus} /> : <Badge variant="success">active</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {filtered.length} of {demoAdminUsers.length} users
          </div>
        </Card>
      </div>
    </div>
  );
}
