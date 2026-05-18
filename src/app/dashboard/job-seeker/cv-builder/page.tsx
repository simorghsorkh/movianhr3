'use client';

import React, { useState } from 'react';
import { FileText, Upload, Download, Eye } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { demoJobSeekers } from '@/lib/demoData';
import { cn } from '@/lib/utils';

const templates = [
  { id: 'modern', name: 'Modern', color: 'bg-primary-600', preview: '▬▬ ▬▬▬▬▬▬\n▬▬▬▬▬▬▬▬▬\n▬▬▬ ▬▬▬' },
  { id: 'classic', name: 'Classic', color: 'bg-gray-800', preview: '▬▬▬▬▬▬▬▬▬\n▬▬ ▬▬▬\n▬▬▬▬▬▬▬' },
  { id: 'minimal', name: 'Minimal', color: 'bg-teal-600', preview: '▬▬▬ ▬▬▬▬\n▬▬▬▬▬▬▬\n▬▬ ▬▬▬▬▬' },
];

export default function CVBuilderPage() {
  const { t, isRTL } = useLang();
  const demoData = demoJobSeekers[0];
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState<'upload' | 'build'>('build');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('cvBuilder')} subtitle="Create a professional CV that stands out." />

      <div className="p-6 space-y-6">
        {/* Tab switch */}
        <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
          {(['build', 'upload'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors', activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700')}
            >
              {tab === 'build' ? t('buildCV') : t('uploadCV')}
            </button>
          ))}
        </div>

        {activeTab === 'upload' ? (
          <Card>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
              <Upload size={40} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">Upload Your Existing CV</h3>
              <p className="text-sm text-gray-500 mb-6">PDF or DOCX files up to 10MB</p>
              <Button variant="primary">
                <Upload size={16} /> Choose File
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Builder form */}
            <div className="lg:col-span-2 space-y-5">
              {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">CV saved successfully!</div>}

              {/* Template selection */}
              <Card>
                <CardHeader><CardTitle>Choose Template</CardTitle></CardHeader>
                <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
                  {templates.map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={cn('flex-1 p-3 rounded-xl border-2 transition-all', selectedTemplate === tmpl.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300')}
                    >
                      <div className={cn('w-full h-16 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-mono', tmpl.color)}>
                        <pre className="opacity-70 text-[8px] leading-tight">{tmpl.preview}</pre>
                      </div>
                      <p className="text-xs font-medium text-center text-gray-700">{tmpl.name}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Personal info */}
              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={demoData.name} />
                  <Input label="Email" defaultValue={demoData.email} />
                  <Input label="Phone" defaultValue={demoData.phone ?? ''} />
                  <Input label="Location" defaultValue={demoData.location ?? ''} />
                  <div className="md:col-span-2">
                    <Input label="Professional Headline" defaultValue={demoData.headline ?? ''} />
                  </div>
                  <div className="md:col-span-2">
                    <Textarea label="Professional Summary" rows={3} defaultValue={demoData.bio ?? ''} />
                  </div>
                </div>
              </Card>

              {/* Summary section placeholder */}
              <Card>
                <CardHeader><CardTitle>{t('workExperience')}</CardTitle></CardHeader>
                {demoData.experience?.map(exp => (
                  <div key={exp.id} className="mb-3 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-semibold">{exp.title} — {exp.company}</p>
                    <p className="text-gray-500 text-xs">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                ))}
              </Card>

              <div className={cn('flex gap-3', isRTL ? 'flex-row-reverse' : '')}>
                <Button onClick={handleSave} variant="primary" className="flex-1">
                  <FileText size={16} /> Save CV
                </Button>
                <Button variant="outline">
                  <Eye size={16} /> Preview
                </Button>
                <Button variant="outline">
                  <Download size={16} /> Export PDF
                </Button>
              </div>
            </div>

            {/* Preview panel */}
            <div>
              <Card className="sticky top-4">
                <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
                <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-64">
                  <div className={cn('border-b-2 pb-3 mb-3', selectedTemplate === 'modern' ? 'border-primary-500' : selectedTemplate === 'classic' ? 'border-gray-800' : 'border-teal-500')}>
                    <h2 className="font-bold text-gray-900">{demoData.name}</h2>
                    <p className="text-xs text-gray-500">{demoData.headline}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="h-2 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-100 rounded w-full" />
                      <div className="h-1.5 bg-gray-100 rounded w-4/5" />
                      <div className="h-1.5 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-400 mt-3">Full preview with real data in export</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
