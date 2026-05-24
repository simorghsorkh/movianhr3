'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, User, FileText, ClipboardList, Map, Users, BookOpen,
  MessageSquare, Calendar, BarChart3, Settings, LogOut, Menu, X,
  CheckSquare, Globe,
} from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: UserRole, t: (k: any) => string): NavItem[] {
  if (role === 'job-seeker') {
    return [
      { href: '/dashboard/job-seeker',              label: t('overview'),            icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/job-seeker/profile',       label: t('profile'),             icon: <User size={18} /> },
      { href: '/dashboard/job-seeker/cv-builder',    label: t('cvBuilder'),           icon: <FileText size={18} /> },
      { href: '/dashboard/job-seeker/assessment',    label: t('careerAssessment'),    icon: <ClipboardList size={18} /> },
      { href: '/dashboard/job-seeker/roadmap',       label: t('myRoadmap'),           icon: <Map size={18} /> },
      { href: '/dashboard/job-seeker/mentors',       label: t('findMentors'),         icon: <Users size={18} /> },
      { href: '/dashboard/job-seeker/courses',       label: t('discoverCourses'),     icon: <BookOpen size={18} /> },
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
      { href: '/dashboard/admin',           label: t('overview'),        icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/admin/users',     label: t('userManagement'),  icon: <Users size={18} /> },
      { href: '/dashboard/admin/approvals', label: t('approvals'),       icon: <CheckSquare size={18} /> },
      { href: '/dashboard/admin/courses',   label: t('courses'),         icon: <BookOpen size={18} /> },
      { href: '/dashboard/admin/requests',  label: t('requests'),        icon: <MessageSquare size={18} /> },
      { href: '/dashboard/admin/reports',   label: t('reports'),         icon: <BarChart3 size={18} /> },
    ];
  }
  return [];
}

export function DashboardSidebar() {
  const { t, lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navItems = getNavItems(user.role, t);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  /**
   * Nav row class — uses Tailwind `rtl:` CSS variant (works because root <html dir="rtl">).
   * `flex-row-reverse` in RTL puts the icon (first DOM child) on the RIGHT,
   * and the label on the LEFT — exactly what we want for a right-side sidebar.
   */
  const rowClass = (active?: boolean) =>
    cn(
      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
      'rtl:flex-row-reverse',
      active
        ? 'bg-primary-50 text-primary-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 rtl:flex-row-reverse">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            Movi<span className="text-primary-600">an</span>
          </span>
        </Link>
      </div>

      {/* ── User info ── */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 rtl:flex-row-reverse">
          <Avatar src={user.avatar} name={user.name} size="md" />
          <div className="flex-1 min-w-0 rtl:text-right">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={rowClass(isActive)}
            >
              {/* Icon — first DOM child; rtl:flex-row-reverse moves it visually to the right */}
              <span className={cn('flex-shrink-0', isActive ? 'text-primary-600' : 'text-gray-400')}>
                {item.icon}
              </span>

              {/* Label — fills remaining space, right-aligned in RTL */}
              <span className="flex-1 truncate rtl:text-right ltr:text-left">
                {item.label}
              </span>

              {/* Active dot — visually at the far end */}
              {isActive && (
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom actions ── */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className={rowClass(pathname === '/dashboard/settings')}
        >
          <Settings
            size={18}
            className={cn('flex-shrink-0', pathname === '/dashboard/settings' ? 'text-primary-600' : 'text-gray-400')}
          />
          <span className="flex-1 rtl:text-right ltr:text-left">{t('settings')}</span>
        </Link>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          className={rowClass()}
        >
          <Globe size={18} className="text-gray-400 flex-shrink-0" />
          <span className="flex-1 rtl:text-right ltr:text-left">
            {lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50 rtl:flex-row-reverse"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="flex-1 rtl:text-right ltr:text-left">{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/*
        Desktop sidebar.
        The parent layout uses `rtl:flex-row-reverse`, which visually moves the
        sidebar (first DOM child) to the RIGHT side of the screen in RTL/Persian mode.
        `border-e` uses logical property — becomes border-left in RTL (inner edge).
      */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white border-e border-gray-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle button — right side in RTL */}
      <button
        className="lg:hidden fixed bottom-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg rtl:right-4 ltr:left-4"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer — slides in from the right in RTL */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed top-0 bottom-0 z-50 w-64 bg-white shadow-xl flex flex-col rtl:right-0 ltr:left-0">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
