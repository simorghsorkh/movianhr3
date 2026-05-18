'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/login'); return; }
    const map: Record<string, string> = {
      'job-seeker': '/dashboard/job-seeker',
      mentor: '/dashboard/mentor',
      trainer: '/dashboard/trainer',
      admin: '/dashboard/admin',
    };
    router.push(map[user.role] ?? '/dashboard/job-seeker');
  }, [user, isLoading, router]);

  return null;
}
