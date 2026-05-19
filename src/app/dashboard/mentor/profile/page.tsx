'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { upsertMentorProfile, updateProfile } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function MentorProfilePage() {
  const { t, isRTL } = useLang();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Basic
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Expertise
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newExp, setNewExp] = useState('');

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? '');
    setPhone((user as any).phone ?? '');
    setLocation((user as any).location ?? '');
    setBio((user as any).bio ?? '');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await Promise.all([
        updateProfile(user.id, { name, phone, location, bio }),
        upsertMentorProfile(user.id, {
          expertise,
          hourly_rate: hourlyRate ? Number(hourlyRate) : null,
          bio,
          location,
        }),
      ]);
      await updateUser({ name, phone, location, bio } as any);
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const addExpertise = () => {
    if (newExp.trim() && !expertise.includes(newExp.trim())) {
      setExpertise(prev => [...prev, newExp.trim()]);
      setNewExp('');
    }
  };

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} />
      <div className="p-6 space-y-6 max-w-3xl mx-auto">

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mentor Profile</CardTitle>
            <Button size="sm" onClick={handleSave} loading={saving}><Save size={14} /> {t('save')}</Button>
          </CardHeader>
          <div className={cn('flex items-center gap-4 mb-6', isRTL ? 'flex-row-reverse' : '')}>
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('fullName')} value={name} onChange={e => setName(e.target.value)} />
            <Input label={t('email')} value={user?.email ?? ''} disabled />
            <Input label={t('phoneNumber')} value={phone} onChange={e => setPhone(e.target.value)} />
            <Input label={t('location')} value={location} onChange={e => setLocation(e.target.value)} />
            <Input
              label="Hourly Rate (تومان)"
              type="number"
              value={hourlyRate}
              onChange={e => setHourlyRate(e.target.value)}
              placeholder="e.g. 500000"
            />
          </div>
          <div className="mt-4">
            <Textarea label={t('bio')} value={bio} onChange={e => setBio(e.target.value)} rows={4} />
          </div>
        </Card>

        {/* Expertise */}
        <Card>
          <CardHeader><CardTitle>{t('expertiseArea')}</CardTitle></CardHeader>
          <div className={cn('flex flex-wrap gap-2 mb-4', isRTL ? 'flex-row-reverse' : '')}>
            {expertise.map(e => (
              <span key={e} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium', isRTL ? 'flex-row-reverse' : '')}>
                {e}
                <button onClick={() => setExpertise(prev => prev.filter(x => x !== e))}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {expertise.length === 0 && <p className="text-sm text-gray-400">No expertise areas added yet.</p>}
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Input
              placeholder="Add expertise area..."
              value={newExp}
              onChange={e => setNewExp(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addExpertise(); }}
            />
            <Button variant="outline" onClick={addExpertise}><Plus size={16} /></Button>
          </div>
          <div className={cn('flex justify-end mt-4', isRTL ? 'justify-start' : '')}>
            <Button size="sm" onClick={handleSave} loading={saving} variant="outline">
              <Save size={14} /> Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
