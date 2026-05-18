'use client';

import React, { useState } from 'react';
import { Clock, Tag, Search } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const posts = [
  {
    id: 1, title: 'How to Write a CV That Gets You Noticed', titleFa: 'چطور رزومه‌ای بنویسید که توجه را جلب کند',
    excerpt: 'Learn the proven techniques for crafting a CV that stands out in a competitive job market.',
    excerptFa: 'تکنیک‌های اثبات‌شده برای نوشتن رزومه‌ای که در بازار کار رقابتی متمایز شود را بیاموزید.',
    category: 'CV Tips', readTime: 8, date: '2024-03-10', thumbnail: 'https://picsum.photos/seed/cv/400/250',
  },
  {
    id: 2, title: 'The 5 Key Pillars of Career Readiness', titleFa: '۵ رکن اصلی آمادگی شغلی',
    excerpt: 'Discover what makes a professional truly ready for their next career move and how to achieve it.',
    excerptFa: 'کشف کنید چه چیزی یک متخصص را برای قدم بعدی شغلی آماده می‌کند و چطور به آن دست یابید.',
    category: 'Career Strategy', readTime: 12, date: '2024-03-05', thumbnail: 'https://picsum.photos/seed/career/400/250',
  },
  {
    id: 3, title: 'How to Get the Most from Career Mentorship', titleFa: 'چطور بیشترین بهره را از مشاوره شغلی ببرید',
    excerpt: 'Practical tips to maximize the value of your mentor relationships and accelerate your growth.',
    excerptFa: 'نکات عملی برای به حداکثر رساندن ارزش روابط مشاوره‌ای و تسریع رشد شما.',
    category: 'Mentorship', readTime: 6, date: '2024-02-28', thumbnail: 'https://picsum.photos/seed/mentor/400/250',
  },
  {
    id: 4, title: 'LinkedIn Optimization: The Complete 2024 Guide', titleFa: 'بهینه‌سازی لینکدین: راهنمای کامل ۲۰۲۴',
    excerpt: 'A step-by-step guide to building a LinkedIn profile that attracts recruiters and opportunities.',
    excerptFa: 'یک راهنمای گام به گام برای ساخت پروفایل لینکدین که کارفرمایان و فرصت‌ها را جذب کند.',
    category: 'Personal Brand', readTime: 15, date: '2024-02-20', thumbnail: 'https://picsum.photos/seed/linkedin2/400/250',
  },
  {
    id: 5, title: 'Upskilling Strategies for Mid-Career Professionals', titleFa: 'استراتژی‌های ارتقای مهارت برای متخصصان میان‌سال',
    excerpt: 'How to identify skill gaps and build learning habits that keep you relevant in a changing market.',
    excerptFa: 'چطور شکاف‌های مهارتی را شناسایی کنید و عادات یادگیری بسازید که شما را در بازار در حال تغییر مرتبط نگه دارد.',
    category: 'Skill Development', readTime: 10, date: '2024-02-15', thumbnail: 'https://picsum.photos/seed/skills/400/250',
  },
  {
    id: 6, title: 'Salary Negotiation: A Practical Playbook', titleFa: 'مذاکره حقوق: یک کتاب بازی عملی',
    excerpt: 'Evidence-based strategies to negotiate your salary confidently and maximize your compensation.',
    excerptFa: 'استراتژی‌های مبتنی بر شواهد برای مذاکره اعتمادبه‌نفس محور درباره حقوق و به حداکثر رساندن پاداش شما.',
    category: 'Job Search', readTime: 9, date: '2024-02-08', thumbnail: 'https://picsum.photos/seed/salary/400/250',
  },
];

const categories = ['All', 'CV Tips', 'Career Strategy', 'Mentorship', 'Personal Brand', 'Skill Development', 'Job Search'];

export default function ResourcesPage() {
  const { t, lang, isRTL } = useLang();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = posts.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-950 to-primary-700 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">{t('resourcesTitle')}</h1>
            <p className="text-xl text-white/75 mb-8">{t('resourcesSubtitle')}</p>
            <div className="max-w-md mx-auto">
              <Input
                placeholder={t('search') + '...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
                className="bg-white/95"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category filter */}
            <div className={cn('flex flex-wrap gap-2 mb-8', isRTL ? 'flex-row-reverse' : '')}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    category === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Card key={post.id} hover className="flex flex-col overflow-hidden p-0">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-44 object-cover" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className={cn('flex items-center justify-between mb-3', isRTL ? 'flex-row-reverse' : '')}>
                      <Badge variant="info">{post.category}</Badge>
                      <div className={cn('flex items-center gap-1 text-xs text-gray-400', isRTL ? 'flex-row-reverse' : '')}>
                        <Clock size={12} />
                        {post.readTime} {t('minuteRead')}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
                      {lang === 'fa' ? post.titleFa : post.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
                      {lang === 'fa' ? post.excerptFa : post.excerpt}
                    </p>
                    <button className={cn('flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors', isRTL ? 'flex-row-reverse' : '')}>
                      {t('readMore')} →
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">No articles found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
