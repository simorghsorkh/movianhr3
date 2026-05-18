'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, BookOpen, Check } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

const roles: { role: UserRole; icon: React.ReactNode; title: string; desc: string; color: string }[] = [
  { role: 'job-seeker', icon: <TrendingUp size={28} />, title: 'jobSeekerRole', desc: 'jobSeekerRoleDesc', color: 'border-primary-500 bg-primary-50 text-primary-700' },
  { role: 'mentor', icon: <Users size={28} />, title: 'mentorRole', desc: 'mentorRoleDesc', color: 'border-orange-500 bg-orange-50 text-orange-700' },
  { role: 'trainer', icon: <BookOpen size={28} />, title: 'trainerRole', desc: 'trainerRoleDesc', color: 'border-purple-500 bg-purple-50 text-purple-700' },
];

export default function RoleSelectionPage() {
  const { t, isRTL } = useLang();
  const { setRole } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    router.push('/onboarding/profile-setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Movi<span className="text-primary-600">an</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{t('selectRoleTitle')}</h1>
          <p className="text-gray-500 mt-2">{t('selectRoleSubtitle')}</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => setSelected(r.role)}
              className={cn(
                'relative flex items-start gap-5 p-5 bg-white rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md',
                selected === r.role ? 'border-primary-500 shadow-md ring-2 ring-primary-200' : 'border-gray-200',
                isRTL ? 'flex-row-reverse text-right' : ''
              )}
            >
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0', r.color)}>
                {r.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base">{t(r.title as any)}</h3>
                <p className="text-sm text-gray-500 mt-1">{t(r.desc as any)}</p>
              </div>
              {selected === r.role && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected}
          fullWidth
          size="lg"
        >
          {t('continueButton')}
        </Button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-6 h-1.5 bg-primary-600 rounded-full" />
          <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Step 1 of 2</p>
      </div>
    </div>
  );
}
