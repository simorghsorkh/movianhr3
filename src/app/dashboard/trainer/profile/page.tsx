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
import { updateProfile } from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function TrainerProfilePage() {
  const { t, isRTL } = useLang();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState('');

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
      await updateProfile(user.id, { name, phone, location, bio });
      await updateUser({ name, phone, location, bio } as any);
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const addSpec = () => {
    if (newSpec.trim() && !specialization.includes(newSpec.trim())) {
      setSpecialization(prev => [...prev, newSpec.trim()]);
      setNewSpec('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} />
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Trainer Profile</CardTitle>
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Save size={14} /> {t('save')}
            </Button>
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
            <div className="md:col-span-2">
              <Textarea label={t('bio')} value={bio} onChange={e => setBio(e.target.value)} rows={4} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Specialization Areas</CardTitle></CardHeader>
          <div className={cn('flex flex-wrap gap-2 mb-4', isRTL ? 'flex-row-reverse' : '')}>
            {specialization.map(s => (
              <span key={s} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium', isRTL ? 'flex-row-reverse' : '')}>
                {s}
                <button onClick={() => setSpecialization(prev => prev.filter(x => x !== s))}><X size={12} /></button>
              </span>
            ))}
            {specialization.length === 0 && <p className="text-sm text-gray-400">No specializations added yet.</p>}
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Input
              placeholder="Add specialization area..."
              value={newSpec}
              onChange={e => setNewSpec(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addSpec(); }}
            />
            <Button variant="outline" onClick={addSpec}><Plus size={16} /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
