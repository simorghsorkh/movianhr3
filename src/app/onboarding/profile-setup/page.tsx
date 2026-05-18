'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, FileText, Briefcase } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ProfileSetupPage() {
  const { t } = useLang();
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const getDashboardPath = () => {
    const map: Record<string, string> = {
      'job-seeker': '/dashboard/job-seeker',
      mentor: '/dashboard/mentor',
      trainer: '/dashboard/trainer',
      admin: '/dashboard/admin',
    };
    return map[user?.role ?? 'job-seeker'] ?? '/dashboard/job-seeker';
  };

  const handleComplete = () => {
    setLoading(true);
    updateUser({ phone, location, bio });
    setTimeout(() => {
      setLoading(false);
      router.push(getDashboardPath());
    }, 600);
  };

  const handleSkip = () => {
    router.push(getDashboardPath());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Movi<span className="text-primary-600">an</span></span>
          </div>
        </div>

        <Card>
          {/* Avatar placeholder */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-3">
              <User size={32} />
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Upload Photo
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">{t('profileSetupTitle')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('profileSetupSubtitle')}</p>
          </div>

          <div className="space-y-4">
            {user?.role === 'job-seeker' && (
              <Input
                label={t('headline')}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Marketing Manager | Growth Specialist"
                leftIcon={<Briefcase size={16} />}
              />
            )}
            <Input
              label={t('phoneNumber')}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+98 912 345 6789"
              leftIcon={<Phone size={16} />}
            />
            <Input
              label={t('location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tehran, Iran"
              leftIcon={<MapPin size={16} />}
            />
            <Textarea
              label={t('bio')}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself, your background, and your career goals..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleSkip} fullWidth>
              {t('skip')}
            </Button>
            <Button onClick={handleComplete} loading={loading} fullWidth>
              {t('completeSetup')}
            </Button>
          </div>
        </Card>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-6 h-1.5 bg-gray-300 rounded-full" />
          <div className="w-6 h-1.5 bg-primary-600 rounded-full" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Step 2 of 2</p>
      </div>
    </div>
  );
}
