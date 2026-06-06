'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Star, TrendingUp, Users, BookOpen, Award, CheckCircle,
  BarChart3, Map, FileText, MessageSquare, ChevronRight, Sparkles,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useSiteStats } from '@/contexts/SiteStatsContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

function HeroSection() {
  const { t, isRTL } = useLang();
  const { stats } = useSiteStats();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8">
            <Sparkles size={14} className="text-accent-400" />
            <span className="text-white/90">Platform for Iranian Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl">
            {t('heroSubtitle')}
          </p>

          <div className={cn('flex flex-wrap gap-4', isRTL ? 'flex-row-reverse justify-end' : '')}>
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg">
                {t('heroCtaPrimary')}
                <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent">
                {t('heroCtaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Stats row — values are controlled from the admin panel */}
          <div className={cn('flex flex-wrap gap-8 mt-14', isRTL ? 'flex-row-reverse' : '')}>
            {[
              { value: stats.stat1, label: t('heroStat1') },
              { value: stats.stat2, label: t('heroStat2') },
              { value: stats.stat3, label: t('heroStat3') },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/60 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-10 sm:h-16">
          <path d="M0,80 L1440,80 L1440,20 Q1080,80 720,40 Q360,0 0,40 Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { t, isRTL } = useLang();

  const features = [
    { icon: <BarChart3 size={24} />, title: t('feature1Title'), desc: t('feature1Desc'), color: 'text-blue-600 bg-blue-50' },
    { icon: <FileText size={24} />, title: t('feature2Title'), desc: t('feature2Desc'), color: 'text-purple-600 bg-purple-50' },
    { icon: <MessageSquare size={24} />, title: t('feature3Title'), desc: t('feature3Desc'), color: 'text-orange-600 bg-orange-50' },
    { icon: <BookOpen size={24} />, title: t('feature4Title'), desc: t('feature4Desc'), color: 'text-green-600 bg-green-50' },
    { icon: <Map size={24} />, title: t('feature5Title'), desc: t('feature5Desc'), color: 'text-teal-600 bg-teal-50' },
    { icon: <Award size={24} />, title: t('feature6Title'), desc: t('feature6Desc'), color: 'text-red-600 bg-red-50' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('featuresTitle')}</h2>
          <p className="text-lg text-gray-600">{t('featuresSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} hover className="group">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', f.color)}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  const { t, isRTL } = useLang();
  const roles = [
    {
      icon: <TrendingUp size={28} />,
      title: t('roleJobSeeker'),
      desc: t('roleJobSeekerDesc'),
      href: '/register',
      color: 'from-primary-600 to-primary-700',
      features: ['Employability Assessment', 'CV Builder', 'Mentor Consultation', 'Career Roadmap'],
    },
    {
      icon: <Users size={28} />,
      title: t('roleMentor'),
      desc: t('roleMentorDesc'),
      href: '/register',
      color: 'from-orange-500 to-orange-600',
      features: ['Manage Requests', 'Schedule Sessions', 'Session Notes', 'Earn Income'],
    },
    {
      icon: <BookOpen size={28} />,
      title: t('roleTrainer'),
      desc: t('roleTrainerDesc'),
      href: '/register',
      color: 'from-purple-600 to-purple-700',
      features: ['Create Courses', 'Manage Students', 'Publish Content', 'Track Analytics'],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('rolesTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div key={role.title} className="relative group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className={cn('p-6 bg-gradient-to-br text-white', role.color)}>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{role.desc}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5 mb-6">
                  {role.features.map((f) => (
                    <li key={f} className={cn('flex items-center gap-2.5 text-sm text-gray-600', isRTL ? 'flex-row-reverse' : '')}>
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={role.href}>
                  <Button variant="outline" size="sm" fullWidth className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                    {t('register')}
                    <ChevronRight size={15} className={isRTL ? 'rotate-180' : ''} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { lang, isRTL } = useLang();
  const { testimonials } = useSiteStats();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {lang === 'fa' ? 'نظر کاربران ما' : lang === 'nl' ? 'Wat onze gebruikers zeggen' : 'What Our Users Say'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const displayName = lang === 'fa' ? item.nameFa : item.name;
            const displayRole = lang === 'fa' ? item.roleFa : item.role;
            const displayText = lang === 'fa' ? item.textFa : item.text;
            return (
            <Card key={item.id} className="flex flex-col">
              <div className={cn('flex mb-3', isRTL ? 'flex-row-reverse' : '')}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className={cn('text-sm text-gray-600 leading-relaxed flex-1 mb-5', isRTL ? 'text-right' : '')}>
                "{displayText}"
              </p>
              <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {(displayName || '?')[0]}
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { t } = useLang();
  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
        <p className="text-lg text-primary-100 mb-8">{t('ctaSubtitle')}</p>
        <Link href="/register">
          <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg">
            {t('ctaButton')}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
