'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const { t } = useLang();
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPwd) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const ok = await register(name, email, password);
    setLoading(false);
    if (ok) {
      router.push('/onboarding/role-selection');
    } else {
      setErrors({ email: 'This email is already registered. Try logging in.' });
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
            <h1 className="text-2xl font-bold text-gray-900">{t('registerTitle')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('fullName')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              leftIcon={<User size={16} />}
              error={errors.name}
              required
            />
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email}
              required
            />
            <div className="relative">
              <Input
                label={t('password')}
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                leftIcon={<Lock size={16} />}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input
              label={t('confirmPassword')}
              type={showPwd ? 'text' : 'password'}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Repeat password"
              leftIcon={<Lock size={16} />}
              error={errors.confirm}
              required
            />

            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              {t('createAccount')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('haveAccount')}{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              {t('signIn')}
            </Link>
          </p>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-4">
          By creating an account, you agree to our{' '}
          <span className="text-primary-600 cursor-pointer">Terms of Service</span> and{' '}
          <span className="text-primary-600 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
