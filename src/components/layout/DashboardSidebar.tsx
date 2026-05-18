'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, User, FileText, ClipboardList, Map, Users, BookOpen,
  MessageSquare, Calendar, BarChart3, Settings, LogOut, Menu, X,
  CheckSquare, Bell, Globe, TrendingUp, Shield, BookMarked,
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
  const base = (path: string) => `/dashboard/${role === 'job-seeker' ? 'job-seeker' : role}${path}`;

  if (role === 'job-seeker') {
    return [
      { href: '/dashboard/job-seeker', label: t('overview'), icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/job-seeker/profile', label: t('profile'), icon: <User size={18} /> },
      { href: '/dashboard/job-seeker/cv-builder', label: t('cvBuilder'), icon: <FileText size={18} /> },
      { href: '/dashboard/job-seeker/assessment', label: t('careerAssessment'), icon: <ClipboardList size={18} /> },
      { href: '/dashboard/job-seeker/roadmap', label: t('myRoadmap'), icon: <Map size={18} /> },
      { href: '/dashboard/job-seeker/mentors', label: t('findMentors'), icon: <Users size={18} /> },
      { href: '/dashboard/job-seeker/courses', label: t('discoverCourses'), icon: <BookOpen size={18} /> },
      { href: '/dashboard/job-seeker/requests', label: t('myRequests'), icon: <MessageSquare size={18} /> },
    ];
  }
  if (role === 'mentor') {
    return [
      { href: '/dashboard/mentor', label: t('overview'), icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/mentor/profile', label: t('profile'), icon: <User size={18} /> },
      { href: '/dashboard/mentor/requests', label: t('consultationRequests'), icon: <MessageSquare size={18} /> },
      { href: '/dashboard/mentor/sessions', label: t('sessions'), icon: <Calendar size={18} /> },
      { href: '/dashboard/mentor/availability', label: t('availability'), icon: <CheckSquare size={18} /> },
    ];
  }
  if (role === 'trainer') {
    return [
      { href: '/dashboard/trainer', label: t('overview'), icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/trainer/profile', label: t('profile'), icon: <User size={18} /> },
      { href: '/dashboard/trainer/courses', label: t('myCourses'), icon: <BookOpen size={18} /> },
      { href: '/dashboard/trainer/students', label: t('students'), icon: <Users size={18} /> },
    ];
  }
  if (role === 'admin') {
    return [
      { href: '/dashboard/admin', label: t('overview'), icon: <LayoutDashboard size={18} /> },
      { href: '/dashboard/admin/users', label: t('userManagement'), icon: <Users size={18} /> },
      { href: '/dashboard/admin/approvals', label: t('approvals'), icon: <CheckSquare size={18} /> },
      { href: '/dashboard/admin/courses', label: t('courses'), icon: <BookOpen size={18} /> },
      { href: '/dashboard/admin/requests', label: t('requests'), icon: <MessageSquare size={18} /> },
      { href: '/dashboard/admin/reports', label: t('reports'), icon: <BarChart3 size={18} /> },
    ];
  }
  return [];
}

export function DashboardSidebar() {
  const { t, lang, setLang, isRTL } = useLang();
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            Movi<span className="text-primary-600">an</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
          <Avatar src={user.avatar} name={user.name} size="md" />
          <div className="flex-1 min-w-0">
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
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isRTL ? 'flex-row-reverse' : '',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-primary-600' : 'text-gray-400')}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className={cn('ms-auto w-1.5 h-1.5 rounded-full bg-primary-600', isRTL ? 'me-auto ms-0' : '')} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <button
          onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors', isRTL ? 'flex-row-reverse' : '')}
        >
          <Globe size={18} className="text-gray-400 flex-shrink-0" />
          <span>{lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}</span>
        </button>
        <button
          onClick={handleLogout}
          className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors', isRTL ? 'flex-row-reverse' : '')}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-white border-e border-gray-100 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className={cn('lg:hidden fixed top-0 bottom-0 z-50 w-64 bg-white shadow-xl flex flex-col', isRTL ? 'right-0' : 'left-0')}>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
