import React from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-white">
                Movi<span className="text-primary-400">an</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">{t('footerTagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: t('home') },
                { href: '/about', label: t('about') },
                { href: '/services', label: t('services') },
                { href: '/pricing', label: t('pricing') },
                { href: '/resources', label: t('resources') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t('support')}</h4>
            <ul className="space-y-2">
              {[
                { href: '#', label: t('helpCenter') },
                { href: '#', label: t('privacyPolicy') },
                { href: '#', label: t('termsOfService') },
                { href: '#', label: t('contactUs') },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Movian. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>for Iranian professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
