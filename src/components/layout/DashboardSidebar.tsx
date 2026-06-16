'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, User, FileText, ClipboardList, Map, Users, BookOpen,
  MessageSquare, Calendar, BarChart3, Settings, LogOut, X,
  CheckSquare, Globe, Linkedin, Package, Route,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: UserRole, t: (k: any) => string, lang: string): NavItem[] {
  const fa = lang === 'fa';
  const nl = lang === 'nl';

  if (role === 'job-seeker') {
    return [
      { href: '/dashboard/job-seeker',              label: t('overview'),            icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/job-seeker/journey',       label: fa ? 'مسیر من' : nl ? 'Mijn traject' : 'My Journey',     icon: <Route size={18} /> },
      { href: '/dashboard/job-seeker/services',      label: fa ? 'خدمات من' : nl ? 'Mijn diensten' : 'My Services',  icon: <Package size={18} /> },
      { href: '/dashboard/job-seeker/profile',       label: t('profile'),             icon: <User size={18} /> },
      { href: '/dashboard/job-seeker/cv-builder',    label: t('cvBuilder'),           icon: <FileText size={18} /> },
      { href: '/dashboard/job-seeker/assessment',    label: t('careerAssessment'),    icon: <ClipboardList size={18} /> },
      { href: '/dashboard/job-seeker/roadmap',       label: t('myRoadmap'),           icon: <Map size={18} /> },
      { href: '/dashboard/job-seeker/mentors',       label: t('findMentors'),         icon: <Users size={18} /> },
      { href: '/dashboard/job-seeker/courses',       label: t('discoverCourses'),     icon: <BookOpen size={18} /> },
      { href: '/dashboard/job-seeker/linkedin',      label: 'LinkedIn',               icon: <Linkedin size={18} /> },
      { href: '/dashboard/job-seeker/requests',      label: t('myRequests'),          icon: <MessageSquare size={18} /> },
    ];
  }
  if (role === 'mentor') {
    return [
      { href: '/dashboard/mentor',              label: t('overview'),               icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/mentor/profile',      label: t('profile'),                icon: <User size={18} /> },
      { href: '/dashboard/mentor/requests',     label: t('consultationRequests'),   icon: <MessageSquare size={18} /> },
      { href: '/dashboard/mentor/sessions',     label: t('sessions'),               icon: <Calendar size={18} /> },
      { href: '/dashboard/mentor/availability', label: t('availability'),           icon: <CheckSquare size={18} /> },
    ];
  }
  if (role === 'trainer') {
    return [
      { href: '/dashboard/trainer',          label: t('overview'),    icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/trainer/profile',  label: t('profile'),     icon: <User size={18} /> },
      { href: '/dashboard/trainer/courses',  label: t('myCourses'),   icon: <BookOpen size={18} /> },
      { href: '/dashboard/trainer/students', label: t('students'),    icon: <Users size={18} /> },
    ];
  }
  if (role === 'admin') {
    return [
      { href: '/dashboard/admin',               label: t('overview'),        icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/admin/users',         label: t('userManagement'),  icon: <Users size={18} /> },
      { href: '/dashboard/admin/approvals',     label: t('approvals'),       icon: <CheckSquare size={18} /> },
      { href: '/dashboard/admin/courses',       label: t('courses'),         icon: <BookOpen size={18} /> },
      { href: '/dashboard/admin/requests',      label: t('requests'),        icon: <MessageSquare size={18} /> },
      { href: '/dashboard/admin/reports',       label: t('reports'),         icon: <BarChart3 size={18} /> },
      {
        href: '/dashboard/admin/site-settings',
        label: lang === 'fa' ? 'تنظیمات سایت' : lang === 'nl' ? 'Site-instellingen' : 'Site Settings',
        icon: <Settings size={18} />,
      },
    ];
  }
  return [];
}

export function DashboardSidebar() {
  const { t, lang, setLang, isRTL } = useLang();
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const navItems = getNavItems(user.role, t, lang);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const rowClass = (active?: boolean) =>
    cn(
      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
      isRTL ? 'flex-row-reverse' : '',
      active
        ? 'bg-primary-50 text-primary-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Header row: logo + close button */}
      <div className={cn('px-4 py-4 border-b border-gray-100 flex items-center justify-between', isRTL ? 'flex-row-reverse' : '')}>
        <Link href="/" className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            Movi<span className="text-primary-600">an</span>
          </span>
        </Link>
        <button
          onClick={close}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <Avatar src={user.avatar} name={user.name} size="md" />
          <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={rowClass(isActive)}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-primary-600' : 'text-gray-400')}>
                {item.icon}
              </span>
              <span className={cn('flex-1 truncate', isRTL ? 'text-right' : 'text-left')}>
                {item.label}
              </span>
              {isActive && (
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/dashboard/settings"
          onClick={close}
          className={rowClass(pathname === '/dashboard/settings')}
        >
          <Settings
            size={18}
            className={cn('flex-shrink-0', pathname === '/dashboard/settings' ? 'text-primary-600' : 'text-gray-400')}
          />
          <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>{t('settings')}</span>
        </Link>

        <button
          onClick={() => {
            const next = lang === 'en' ? 'nl' : lang === 'nl' ? 'fa' : 'en';
            setLang(next as import('@/lib/types').Language);
          }}
          className={rowClass()}
        >
          <Globe size={18} className="text-gray-400 flex-shrink-0" />
          <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>
            {lang === 'en' ? 'Nederlands' : lang === 'nl' ? 'فارسی' : 'English'}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50',
            isRTL ? 'flex-row-reverse' : ''
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className={cn('flex-1', isRTL ? 'text-right' : 'text-left')}>{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />
      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 z-50 w-64 bg-white shadow-2xl flex flex-col',
          isRTL ? 'right-0' : 'left-0'
        )}
        style={{
          animation: `slideIn${isRTL ? 'Right' : 'Left'} 0.22s ease-out`,
        }}
      >
        <SidebarContent />
      </aside>

      <style>{`
        @keyframes slideInLeft  { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes slideInRight { from { transform: translateX(100%);  } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
