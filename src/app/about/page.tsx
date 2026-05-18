'use client';

import React from 'react';
import { Heart, Target, Eye, Users, Award, TrendingUp, Globe } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  const { t } = useLang();

  const values = [
    { icon: <Heart size={20} />, title: t('value1'), desc: 'We operate with full transparency and honesty in everything we do.' },
    { icon: <TrendingUp size={20} />, title: t('value2'), desc: 'We believe every challenge is a learning opportunity.' },
    { icon: <Users size={20} />, title: t('value3'), desc: 'We build for all professionals regardless of background.' },
    { icon: <Award size={20} />, title: t('value4'), desc: 'We deliver exceptional quality in every product and service.' },
  ];

  const team = [
    { name: 'Arash Movian', role: 'CEO & Co-Founder', avatar: 'AM', color: 'bg-primary-100 text-primary-700' },
    { name: 'Nazanin Karimi', role: 'CTO & Co-Founder', avatar: 'NK', color: 'bg-purple-100 text-purple-700' },
    { name: 'Behrouz Sadeghi', role: 'Head of Product', avatar: 'BS', color: 'bg-green-100 text-green-700' },
    { name: 'Shirin Ahmadi', role: 'Head of Mentorship', avatar: 'SA', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-700 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('aboutTitle')}</h1>
            <p className="text-xl text-white/75">{t('aboutSubtitle')}</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-primary-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                    <Target size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t('missionTitle')}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{t('missionText')}</p>
              </Card>

              <Card className="border-l-4 border-accent-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-accent-50 rounded-xl text-accent-600">
                    <Eye size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t('visionTitle')}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">{t('visionText')}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '1,500+', label: 'Job Seekers', color: 'text-primary-600' },
                { value: '180+', label: 'Expert Mentors', color: 'text-orange-600' },
                { value: '90+', label: 'Courses', color: 'text-purple-600' },
                { value: '3,200+', label: 'Sessions Completed', color: 'text-green-600' },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <p className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('valuesTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <Card key={v.title} className="text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {v.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 ${member.color}`}>
                    {member.avatar}
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{member.role}</p>
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
