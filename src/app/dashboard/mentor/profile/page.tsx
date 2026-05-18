'use client';

import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { demoMentors } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function MentorProfilePage() {
  const { t, isRTL } = useLang();
  const { user } = useAuth();
  const mentor = demoMentors[0];
  const [expertise, setExpertise] = useState<string[]>(mentor.expertise);
  const [newExp, setNewExp] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} />
      <div className="p-6 space-y-6">
        {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Profile saved!</div>}

        <Card>
          <CardHeader><CardTitle>Mentor Profile</CardTitle><Button size="sm" onClick={() => setSaved(true)}><Save size={14}/> {t('save')}</Button></CardHeader>
          <div className={cn('flex items-center gap-4 mb-6', isRTL ? 'flex-row-reverse' : '')}>
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <Button size="sm" variant="outline">Change Photo</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('fullName')} defaultValue={user?.name} />
            <Input label={t('email')} defaultValue={user?.email} />
            <Input label={t('phoneNumber')} defaultValue={mentor.phone ?? ''} />
            <Input label={t('location')} defaultValue={mentor.location ?? ''} />
            <Input label="Hourly Rate (تومان)" type="number" defaultValue={String(mentor.hourlyRate ?? '')} />
            <div className="md:col-span-2">
              <Textarea label={t('bio')} defaultValue={mentor.bio ?? ''} rows={4} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('expertiseArea')}</CardTitle></CardHeader>
          <div className={cn('flex flex-wrap gap-2 mb-4', isRTL ? 'flex-row-reverse' : '')}>
            {expertise.map(e => (
              <span key={e} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium', isRTL ? 'flex-row-reverse' : '')}>
                {e}
                <button onClick={() => setExpertise(expertise.filter(x => x !== e))}><X size={12}/></button>
              </span>
            ))}
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Input placeholder="Add expertise area..." value={newExp} onChange={e => setNewExp(e.target.value)} onKeyDown={e => { if(e.key === 'Enter' && newExp.trim()) { setExpertise([...expertise, newExp.trim()]); setNewExp(''); }}} />
            <Button variant="outline" onClick={() => { if(newExp.trim()) { setExpertise([...expertise, newExp.trim()]); setNewExp(''); }}}><Plus size={16}/></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
