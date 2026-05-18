'use client';

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { demoTrainers } from '@/lib/demoData';

export default function TrainerProfilePage() {
  const { t } = useLang();
  const { user } = useAuth();
  const trainer = demoTrainers[0];
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} />
      <div className="p-6 space-y-6">
        {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Profile saved!</div>}
        <Card>
          <CardHeader>
            <CardTitle>Trainer Profile</CardTitle>
            <Button size="sm" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              <Save size={14} /> {t('save')}
            </Button>
          </CardHeader>
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <Button size="sm" variant="outline">Change Photo</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('fullName')} defaultValue={user?.name} />
            <Input label={t('email')} defaultValue={user?.email} />
            <Input label={t('phoneNumber')} defaultValue={trainer.phone ?? ''} />
            <Input label={t('location')} defaultValue={trainer.location ?? ''} />
            <div className="md:col-span-2">
              <Input label="Specialization" defaultValue={(trainer.specialization ?? []).join(', ')} hint="Comma-separated areas of specialization" />
            </div>
            <div className="md:col-span-2">
              <Textarea label={t('bio')} defaultValue={trainer.bio ?? ''} rows={4} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
