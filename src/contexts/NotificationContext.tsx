'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/supabase/dal';

export interface AppNotification {
  id: string;
  type: 'request' | 'approval' | 'session' | 'course' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'time'>) => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotifications(user.id);
      const mapped: AppNotification[] = data.map((n: any) => ({
        id: n.id,
        type: n.type ?? 'system',
        title: n.title,
        body: n.body,
        time: formatTime(n.created_at),
        read: n.read ?? false,
        href: n.href ?? undefined,
      }));
      setNotifications(mapped);
    } catch {
      // silently fail — notifications are non-critical
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [user, loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await markNotificationRead(id);
    } catch {
      // silently fail
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (user) {
      try {
        await markAllNotificationsRead(user.id);
      } catch {
        // silently fail
      }
    }
  };

  const addNotification = (n: Omit<AppNotification, 'id' | 'read' | 'time'>) =>
    setNotifications(prev => [
      { ...n, id: `n-${Date.now()}`, read: false, time: 'Just now' },
      ...prev,
    ]);

  const refresh = () => loadNotifications();

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, addNotification, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside <NotificationProvider>');
  return ctx;
}
