'use client';

import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00–10:00', '10:00–11:00', '11:00–12:00', '14:00–15:00', '15:00–16:00', '16:00–17:00', '18:00–19:00'];

export default function AvailabilityPage() {
  const { t, isRTL } = useLang();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set(['Monday-09:00–10:00', 'Wednesday-14:00–15:00', 'Friday-16:00–17:00']));
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    setSelected(next);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('availability')} subtitle="Set your available time slots for consultations." />
      <div className="p-6 space-y-6">
        {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Availability saved!</div>}

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <Button size="sm" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); toast.success(`Availability saved — ${selected.size} slots set.`); }}>
              <Save size={14} /> {t('save')}
            </Button>
          </CardHeader>
          <p className="text-sm text-gray-500 mb-4">Click on time slots to mark yourself available. Green = available.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className={cn('text-left py-2 px-2 text-xs text-gray-500 font-semibold w-32', isRTL ? 'text-right' : '')}>Time</th>
                  {days.map(d => (
                    <th key={d} className="py-2 px-2 text-xs text-gray-500 font-semibold text-center">{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot} className="border-t border-gray-50">
                    <td className={cn('py-2 px-2 text-xs text-gray-500 flex items-center gap-1', isRTL ? 'flex-row-reverse' : '')}>
                      <Clock size={11} /> {slot}
                    </td>
                    {days.map(day => {
                      const key = `${day}-${slot}`;
                      const isAvail = selected.has(key);
                      return (
                        <td key={day} className="py-1 px-2 text-center">
                          <button
                            onClick={() => toggle(key)}
                            className={cn('w-full h-8 rounded-lg transition-colors text-xs font-medium', isAvail ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-50 text-gray-300 hover:bg-gray-100')}
                          >
                            {isAvail ? '✓' : '·'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={cn('flex items-center gap-4 mt-4 text-xs text-gray-500', isRTL ? 'flex-row-reverse' : '')}>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-green-100" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-gray-50 border border-gray-200" /> Not available</span>
            <span className="font-medium text-primary-600">{selected.size} slots selected</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
