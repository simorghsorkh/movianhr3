'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, FileText, MessageSquare, BookOpen, Map, Mic, ArrowRight, CheckCircle } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const { t, isRTL } = useLang();

  const services = [
    {
      icon: <BarChart3 size={28} />,
      title: t('service1Title'),
      desc: t('service1Desc'),
      color: 'text-blue-600 bg-blue-50',
      features: ['5-category assessment', 'Personalized scoring', 'Gap analysis report', 'Priority recommendations'],
    },
    {
      icon: <FileText size={28} />,
      title: t('service2Title'),
      desc: t('service2Desc'),
      color: 'text-purple-600 bg-purple-50',
      features: ['Professional templates', 'ATS optimization', 'Mentor review', 'Export to PDF'],
    },
    {
      icon: <MessageSquare size={28} />,
      title: t('service3Title'),
      desc: t('service3Desc'),
      color: 'text-orange-600 bg-orange-50',
      features: ['Expert mentor network', 'Flexible scheduling', 'Session recordings', 'Follow-up notes'],
    },
    {
      icon: <BookOpen size={28} />,
      title: t('service4Title'),
      desc: t('service4Desc'),
      color: 'text-green-600 bg-green-50',
      features: ['90+ courses available', 'Beginner to advanced', 'Certificates issued', 'Self-paced learning'],
    },
    {
      icon: <Map size={28} />,
      title: t('service5Title'),
      desc: t('service5Desc'),
      color: 'text-teal-600 bg-teal-50',
      features: ['AI-driven personalization', 'Progress tracking', 'Milestone alerts', 'Adjustable timeline'],
    },
    {
      icon: <Mic size={28} />,
      title: t('service6Title'),
      desc: t('service6Desc'),
      color: 'text-red-600 bg-red-50',
      features: ['Mock interviews', 'Feedback sessions', 'LinkedIn optimization', 'Salary negotiation tips'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-700 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('servicesTitle')}</h1>
            <p className="text-xl text-white/75">{t('servicesSubtitle')}</p>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Card key={s.title} className="flex flex-col hover:shadow-md transition-shadow">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-5', s.color)}>
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className={cn('flex items-center gap-2 text-sm text-gray-600', isRTL ? 'flex-row-reverse' : '')}>
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
            <p className="text-gray-600 mb-8">Create your free account today and access all core features with our Free plan.</p>
            <Link href="/register">
              <Button size="lg" variant="primary">
                {t('register')}
                <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
