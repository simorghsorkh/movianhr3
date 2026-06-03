'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, UserCheck, UserX, RefreshCw, Shield, X, CheckSquare, Square } from 'lucide-react';
import {
  TrendingUp, FileText, Map, Users, BookOpen,
  MessageSquare, ClipboardList, Linkedin,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { useFeatureAccess } from '@/contexts/FeatureAccessContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { createClient } from '@/lib/supabase/client';
import { FEATURES, type FeatureKey } from '@/lib/features';
import { cn } from '@/lib/utils';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  is_active: boolean;
  created_at: string;
  mentor_status: string | null;
  trainer_status: string | null;
};

const ROLE_COLORS: Record<string, string> = {
  'job-seeker': 'info',
  mentor: 'warning',
  trainer: 'success',
  admin: 'danger',
};

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  assessment:   <TrendingUp size={16} />,
  'cv-builder': <FileText size={16} />,
  linkedin:     <Linkedin size={16} />,
  roadmap:      <Map size={16} />,
  mentors:      <Users size={16} />,
  courses:      <BookOpen size={16} />,
};

export default function AdminUsersPage() {
  const { lang, isRTL } = useLang();
  const fa = lang === 'fa';
  const toast = useToast();
  const supabase = createClient();
  const { getUserAccess, setFeatureAccess, setAllAccess } = useFeatureAccess();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Access control modal
  const [accessModal, setAccessModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users_view')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(fa ? 'بارگذاری کاربران ناموفق بود.' : 'Failed to load users.');
    else setUsers((data as UserRow[]) ?? []);
    setLoading(false);
  }, [supabase, toast, fa]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (user: UserRow) => {
    setActionLoading(user.id);
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !user.is_active })
      .eq('id', user.id);
    if (error) toast.error(fa ? 'بروزرسانی ناموفق بود.' : 'Failed to update user status.');
    else {
      toast.success(fa
        ? `${user.name} ${user.is_active ? 'غیرفعال' : 'فعال'} شد.`
        : `${user.name} has been ${user.is_active ? 'deactivated' : 'activated'}.`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    }
    setActionLoading(null);
  };

  const openAccessModal = (user: UserRow) => {
    setSelectedUser(user);
    setAccessModal(true);
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleLabels: Record<string, string> = {
    all: fa ? 'همه' : 'All',
    'job-seeker': fa ? 'جویای کار' : 'Job Seeker',
    mentor: fa ? 'مشاور' : 'Mentor',
    trainer: fa ? 'مدرس' : 'Trainer',
    admin: fa ? 'ادمین' : 'Admin',
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? 'مدیریت کاربران' : 'User Management'}
        subtitle={fa ? 'مشاهده و مدیریت تمام کاربران پلتفرم.' : 'View and manage all platform users.'}
      />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className={cn('flex flex-col sm:flex-row gap-3 items-start sm:items-center', isRTL ? 'sm:flex-row-reverse' : '')}>
          <div className="flex-1 w-full">
            <Input
              placeholder={fa ? 'جستجو بر اساس نام یا ایمیل...' : 'Search by name or email...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className={cn('flex gap-2 flex-wrap', isRTL ? 'flex-row-reverse' : '')}>
            {['all', 'job-seeker', 'mentor', 'trainer', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn('px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw size={14} />
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          {fa ? `${filtered.length} کاربر یافت شد` : `${filtered.length} users found`}
        </p>

        {/* Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    fa ? 'کاربر' : 'User',
                    fa ? 'نقش' : 'Role',
                    fa ? 'تأیید' : 'Approval',
                    fa ? 'تاریخ عضویت' : 'Joined',
                    fa ? 'وضعیت' : 'Status',
                    fa ? 'دسترسی ابزارها' : 'Tool Access',
                    fa ? 'عملیات' : 'Actions',
                  ].map((h, i) => (
                    <th key={i} className={cn('px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide', isRTL ? 'text-right' : 'text-left', i === 6 ? 'text-center' : '')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                  : filtered.map(user => {
                    const access = getUserAccess(user.id);
                    const enabledCount = Object.values(access).filter(Boolean).length;
                    const totalCount = FEATURES.length;
                    const allEnabled = enabledCount === totalCount;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* User */}
                        <td className="px-4 py-3">
                          <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                            <Avatar name={user.name} src={user.avatar ?? undefined} size="sm" />
                            <div className={isRTL ? 'text-right' : ''}>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* Role */}
                        <td className="px-4 py-3">
                          <Badge variant={ROLE_COLORS[user.role] as any ?? 'default'}>
                            {fa
                              ? roleLabels[user.role] ?? user.role
                              : user.role.replace('-', ' ')}
                          </Badge>
                        </td>
                        {/* Approval */}
                        <td className="px-4 py-3">
                          {user.mentor_status && <StatusBadge status={user.mentor_status as any} />}
                          {user.trainer_status && <StatusBadge status={user.trainer_status as any} />}
                          {!user.mentor_status && !user.trainer_status && <span className="text-xs text-gray-400">—</span>}
                        </td>
                        {/* Joined */}
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleDateString(fa ? 'fa-IR' : 'en-US')}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                            user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                            <span className={cn('w-1.5 h-1.5 rounded-full', user.is_active ? 'bg-green-500' : 'bg-red-500')} />
                            {user.is_active ? (fa ? 'فعال' : 'Active') : (fa ? 'غیرفعال' : 'Inactive')}
                          </span>
                        </td>
                        {/* Tool Access */}
                        <td className="px-4 py-3">
                          {user.role === 'job-seeker' ? (
                            <button
                              onClick={() => openAccessModal(user)}
                              className={cn(
                                'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors',
                                allEnabled
                                  ? 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                              )}
                            >
                              <Shield size={13} />
                              {fa ? `${enabledCount}/${totalCount}` : `${enabledCount}/${totalCount}`}
                              {' '}{fa ? 'ابزار' : 'tools'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleActive(user)}
                            disabled={actionLoading === user.id || user.role === 'admin'}
                            className={cn(
                              'p-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                              user.is_active ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                            )}
                            title={user.is_active ? (fa ? 'غیرفعال کردن' : 'Deactivate') : (fa ? 'فعال کردن' : 'Activate')}
                          >
                            {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                }
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                      {fa ? 'کاربری یافت نشد.' : 'No users found matching your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Feature Access Modal ── */}
      {selectedUser && (
        <Modal
          isOpen={accessModal}
          onClose={() => setAccessModal(false)}
          title={fa
            ? `مدیریت دسترسی — ${selectedUser.name}`
            : `Manage Access — ${selectedUser.name}`}
          size="md"
          footer={
            <Button onClick={() => setAccessModal(false)}>
              {fa ? 'بستن' : 'Close'}
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Bulk actions */}
            <div className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
              <button
                onClick={() => setAllAccess(selectedUser.id, true)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
              >
                <CheckSquare size={13} />
                {fa ? 'فعال کردن همه' : 'Enable All'}
              </button>
              <button
                onClick={() => setAllAccess(selectedUser.id, false)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
              >
                <Square size={13} />
                {fa ? 'غیرفعال کردن همه' : 'Disable All'}
              </button>
            </div>

            {/* Feature toggles */}
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
              {FEATURES.map((feature) => {
                const enabled = getUserAccess(selectedUser.id)[feature.key];
                return (
                  <div
                    key={feature.key}
                    className={cn('flex items-center gap-3 px-4 py-3 transition-colors',
                      enabled ? 'bg-white' : 'bg-gray-50/60',
                      isRTL ? 'flex-row-reverse' : ''
                    )}
                  >
                    {/* Feature icon */}
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      enabled ? feature.color : 'bg-gray-100 text-gray-400')}>
                      {FEATURE_ICONS[feature.key]}
                    </div>

                    {/* Label */}
                    <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                      <p className={cn('text-sm font-medium', enabled ? 'text-gray-900' : 'text-gray-400')}>
                        {fa ? feature.labelFa : feature.labelEn}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {fa ? feature.descFa : feature.descEn}
                      </p>
                    </div>

                    {/* Toggle switch */}
                    <button
                      onClick={() => setFeatureAccess(selectedUser.id, feature.key as FeatureKey, !enabled)}
                      className={cn(
                        'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none',
                        enabled ? 'bg-primary-600' : 'bg-gray-200'
                      )}
                      role="switch"
                      aria-checked={enabled}
                    >
                      <span className={cn(
                        'inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200',
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 text-center">
              {fa
                ? 'تغییرات بلافاصله اعمال می‌شود. ابزارهای غیرفعال در داشبورد کاربر قفل نشان داده می‌شوند.'
                : 'Changes apply immediately. Disabled tools appear locked in the user\'s dashboard.'}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
