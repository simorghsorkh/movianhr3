'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_STYLES: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full',
        'animate-slideUp',
        STYLES[toast.type]
      )}
      role="alert"
    >
      <span className={cn('flex-shrink-0 mt-0.5', ICON_STYLES[toast.type])}>
        {ICONS[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const value: ToastContextValue = {
    success: (msg, dur) => addToast('success', msg, dur),
    error: (msg, dur) => addToast('error', msg, dur),
    warning: (msg, dur) => addToast('warning', msg, dur),
    info: (msg, dur) => addToast('info', msg, dur),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container — bottom-right on LTR, bottom-left on RTL */}
      <div
        className="fixed bottom-6 end-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
