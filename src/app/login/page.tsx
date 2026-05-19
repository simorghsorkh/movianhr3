'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const { t } = useLang();
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome back! Redirecting to your dashboard…');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password. Try the demo accounts below.');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const demoAccounts = [
    { label: 'Job Seeker', email: 'seeker@movian.io', pass: 'demo123' },
    { label: 'Mentor', email: 'mentor@movian.io', pass: 'demo123' },
    { label: 'Trainer', email: 'trainer@movian.io', pass: 'demo123' },
    { label: 'Admin', email: 'admin@movian.io', pass: 'demo123' },
  ];

  const loginAs = async (acc: typeof demoAccounts[0]) => {
    setLoading(true);
    const ok = await login(acc.email, acc.pass);
    setLoading(false);
    if (ok) {
      toast.success(`Logged in as ${acc.label}. Welcome!`);
      router.push('/dashboard');
    } else {
      toast.error('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Movi<span className="text-primary-600">an</span></span>
          </Link>
        </div>

        <Card>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('loginTitle')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('loginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              required
            />
            <div className="relative">
              <Input
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700">
                {t('forgotPassword')}
              </button>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              {t('signIn')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('noAccount')}{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              {t('register')}
            </Link>
          </p>
        </Card>

        {/* Demo accounts */}
        <Card className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                onClick={() => loginAs(acc)}
                disabled={loading}
                className="text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">{acc.label}</p>
                <p className="text-xs text-gray-400 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">All demo passwords: <code className="font-mono">demo123</code></p>
        </Card>
      </div>
    </div>
  );
}
