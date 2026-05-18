'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const { t, isRTL } = useLang();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: t('planFree'),
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Perfect for getting started with career assessment.',
      color: 'border-gray-200',
      buttonVariant: 'outline' as const,
      features: [
        { label: 'Basic profile creation', included: true },
        { label: 'Career assessment (1x)', included: true },
        { label: 'View 5 mentor profiles', included: true },
        { label: 'Access to free courses', included: true },
        { label: 'CV builder (1 template)', included: true },
        { label: 'Mentor consultation requests', included: false },
        { label: 'Personalized roadmap', included: false },
        { label: 'Priority support', included: false },
      ],
    },
    {
      name: t('planPro'),
      priceMonthly: 299000,
      priceYearly: 249000,
      description: 'For serious job seekers who want full career support.',
      color: 'border-primary-500',
      popular: true,
      buttonVariant: 'primary' as const,
      features: [
        { label: 'Everything in Free', included: true },
        { label: 'Unlimited career assessments', included: true },
        { label: 'Full mentor directory access', included: true },
        { label: 'Unlimited consultation requests', included: true },
        { label: 'Personalized career roadmap', included: true },
        { label: 'CV builder (all templates)', included: true },
        { label: 'Course enrollment discounts', included: true },
        { label: 'Priority support', included: true },
      ],
    },
    {
      name: t('planEnterprise'),
      priceMonthly: null,
      priceYearly: null,
      description: 'For teams and organizations hiring at scale.',
      color: 'border-gray-200',
      buttonVariant: 'outline' as const,
      features: [
        { label: 'Everything in Professional', included: true },
        { label: 'Team accounts (up to 50)', included: true },
        { label: 'Dedicated account manager', included: true },
        { label: 'Custom training programs', included: true },
        { label: 'API access', included: true },
        { label: 'Analytics dashboard', included: true },
        { label: 'SLA guarantee', included: true },
        { label: 'White-labeling options', included: true },
      ],
    },
  ];

  const faq = [
    { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription at any time with no penalties. You keep access until the end of your billing period.' },
    { q: 'Is there a free trial?', a: 'Yes! The Free plan gives you full access to core features indefinitely. Upgrade only when you need more.' },
    { q: 'How does mentor billing work?', a: 'Mentors set their own rates. Movian charges a 15% platform fee on successful sessions.' },
    { q: 'Are courses included in the price?', a: 'Pro subscribers get a 20% discount on all courses. Free users pay full course prices.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-700 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('pricingTitle')}</h1>
            <p className="text-xl text-white/75 mb-8">{t('pricingSubtitle')}</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', billing === 'monthly' ? 'bg-white text-primary-700' : 'text-white/70 hover:text-white')}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2', billing === 'yearly' ? 'bg-white text-primary-700' : 'text-white/70 hover:text-white')}
              >
                Yearly
                <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">-17%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn('relative bg-white rounded-2xl border-2 shadow-sm flex flex-col', plan.color, plan.popular && 'shadow-xl scale-105')}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge variant="info" className="bg-primary-600 text-white px-4 py-1">
                        {t('mostPopular')}
                      </Badge>
                    </div>
                  )}
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      {plan.priceMonthly === null ? (
                        <span className="text-2xl font-bold text-gray-900">Custom</span>
                      ) : plan.priceMonthly === 0 ? (
                        <span className="text-3xl font-bold text-gray-900">Free</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-gray-900">
                            {(billing === 'yearly' ? plan.priceYearly : plan.priceMonthly)?.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-gray-500 text-sm">تومان {t('perMonth')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f.label} className={cn('flex items-center gap-2.5 text-sm', isRTL ? 'flex-row-reverse' : '', f.included ? 'text-gray-700' : 'text-gray-400')}>
                          {f.included
                            ? <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                            : <X size={15} className="text-gray-300 flex-shrink-0" />}
                          {f.label}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.priceMonthly === null ? '#' : '/register'}>
                      <Button variant={plan.buttonVariant} fullWidth>
                        {plan.priceMonthly === null ? t('contactUs') : t('getStarted')}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <Card key={item.q} padding="md">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-600">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
