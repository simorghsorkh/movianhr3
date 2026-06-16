'use client';

import React, { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Avatar } from '@/components/ui/Avatar';
import { NotificationDrawer } from '@/components/ui/NotificationDrawer';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { isRTL } = useLang();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { toggle } = useSidebar();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        {/* Hamburger — opens the sidebar drawer */}
        <button
          onClick={toggle}
          className={cn(
            'p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0',
            isRTL ? 'order-last' : 'order-first'
          )}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Title */}
        <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : '')}>
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Right-side actions */}
        <div className={cn('flex items-center gap-2 flex-shrink-0', isRTL ? 'flex-row-reverse' : '')}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className={cn('hidden sm:flex items-center gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
