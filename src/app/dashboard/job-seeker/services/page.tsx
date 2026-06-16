'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText, ClipboardList, Map, Users, BookOpen, Linkedin,
  Lock, CheckCircle, ArrowUpRight,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureAccess } from '@/contexts/FeatureAccessContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { FEATURES } from '@/lib/features';
import { cn, toPersianNum } from '@/lib/utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  assessment:   <ClipboardList size={26} />,
  'cv-builder': <FileText size={26} />,
  linkedin:     <Linkedin size={26} />,
  roadmap:      <Map size={26} />,
  mentors:      <Users size={26} />,
  courses:      <BookOpen size={26} />,
};

export default function ServicesPage() {
  const { lang, isRTL } = useLang();
  const { user } = useAuth();
  const { hasAccess } = useFeatureAccess();
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  const accessible = user ? FEATURES.filter((f) => hasAccess(user.id, f.key)) : FEATURES;
  const locked     = user ? FEATURES.filter((f) => !hasAccess(user.id, f.key)) : [];

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader
        title={fa ? 'خدمات من' : nl ? 'Mijn diensten' : 'My Services'}
        subtitle={
          fa
            ? `${toPersianNum(accessible.length)} سرویس از ${toPersianNum(FEATURES.length)} سرویس در پکیج شما فعال است`
            : nl
            ? `${accessible.length} van ${FEATURES.length} diensten actief in uw pakket`
            : `${accessible.length} of ${FEATURES.length} services active in your plan`
        }
      />

      <div className="p-5 max-w-2xl mx-auto space-y-6">

        {/* Active services */}
        <div>
          <div className={cn('flex items-center gap-2 mb-3', isRTL ? 'flex-row-reverse' : '')}>
            <CheckCircle size={16} className="text-emerald-500" />
            <h2 className="text-sm font-semibold text-gray-700">
              {fa ? 'فعال در پکیج شما' : nl ? 'Actief in uw pakket' : 'Active in your plan'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accessible.map((feature) => {
              const label = fa ? feature.labelFa : feature.labelEn;
              const desc  = fa ? feature.descFa  : feature.descEn;
              return (
                <Link
                  key={feature.key}
                  href={feature.href}
                  className={cn(
                    'group flex items-center gap-4 bg-white border-2 rounded-2xl px-4 py-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
                    feature.border,
                    isRTL ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', feature.color)}>
                    {ICON_MAP[feature.key]}
                  </div>
                  <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 truncate">{desc}</p>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Locked services */}
        {locked.length > 0 && (
          <div>
            <div className={cn('flex items-center gap-2 mb-3', isRTL ? 'flex-row-reverse' : '')}>
              <Lock size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-400">
                {fa ? 'در پکیج فعلی قابل دسترس نیست' : nl ? 'Niet beschikbaar in huidig pakket' : 'Not in your current plan'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locked.map((feature) => {
                const label = fa ? feature.labelFa : feature.labelEn;
                return (
                  <div
                    key={feature.key}
                    className={cn(
                      'flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 opacity-60',
                      isRTL ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300">
                      {ICON_MAP[feature.key]}
                    </div>
                    <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
                      <p className="text-sm font-semibold text-gray-400">{label}</p>
                      <p className="text-xs text-gray-400">
                        {fa ? 'دسترسی محدود شده' : nl ? 'Toegang beperkt' : 'Access restricted'}
                      </p>
                    </div>
                    <Lock size={14} className="flex-shrink-0 text-gray-300" />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:underline font-medium"
              >
                {fa ? 'ارتقا به پکیج بالاتر' : nl ? 'Upgrade uw pakket' : 'Upgrade your plan'}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
