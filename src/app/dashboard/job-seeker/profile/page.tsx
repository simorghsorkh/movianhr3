'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, GraduationCap, Zap, Globe, Edit3, Save, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { demoJobSeekers } from '@/lib/demoData';
import { cn, generateId } from '@/lib/utils';
import type { WorkExperience, Education } from '@/lib/types';

export default function JobSeekerProfilePage() {
  const { t, isRTL } = useLang();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const demoData = demoJobSeekers[0];
  const [skills, setSkills] = useState<string[]>(demoData.skills ?? []);
  const [newSkill, setNewSkill] = useState('');
  const [experience, setExperience] = useState<WorkExperience[]>(demoData.experience ?? []);
  const [education, setEducation] = useState<Education[]>(demoData.education ?? []);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<WorkExperience>>({});
  const [editingEdu, setEditingEdu] = useState<Partial<Education>>({});
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('Profile saved successfully!');
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  const saveExperience = () => {
    if (editingExp.id) {
      setExperience(experience.map(e => e.id === editingExp.id ? { ...e, ...editingExp } as WorkExperience : e));
    } else {
      setExperience([...experience, { ...editingExp, id: generateId(), current: editingExp.current ?? false } as WorkExperience]);
    }
    setExpModalOpen(false);
    setEditingExp({});
  };

  const saveEducation = () => {
    if (editingEdu.id) {
      setEducation(education.map(e => e.id === editingEdu.id ? { ...e, ...editingEdu } as Education : e));
    } else {
      setEducation([...education, { ...editingEdu, id: generateId(), current: false } as Education]);
    }
    setEduModalOpen(false);
    setEditingEdu({});
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} subtitle="Manage your professional profile" />

      <div className="p-6 space-y-6">
        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
            <Save size={15} /> Profile saved successfully!
          </div>
        )}

        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <Button size="sm" variant="primary" onClick={handleSaveProfile}>
              <Save size={14} /> {t('save')}
            </Button>
          </CardHeader>
          <div className={cn('flex items-start gap-6 mb-6', isRTL ? 'flex-row-reverse' : '')}>
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <div className="flex-1">
              <Button size="sm" variant="outline">Change Photo</Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('fullName')} defaultValue={user?.name} />
            <Input label={t('email')} type="email" defaultValue={user?.email} />
            <Input label={t('phoneNumber')} defaultValue={user?.phone ?? ''} placeholder="+98 912 ..." />
            <Input label={t('location')} defaultValue={user?.location ?? ''} placeholder="City, Country" />
            <div className="md:col-span-2">
              <Input label={t('headline')} defaultValue={demoData.headline ?? ''} placeholder="Your professional headline" />
            </div>
            <div className="md:col-span-2">
              <Textarea label={t('bio')} defaultValue={user?.bio ?? ''} rows={3} placeholder="Write a short bio..." />
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>{t('skills')}</CardTitle>
          </CardHeader>
          <div className={cn('flex flex-wrap gap-2 mb-4', isRTL ? 'flex-row-reverse' : '')}>
            {skills.map((skill) => (
              <span key={skill} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium', isRTL ? 'flex-row-reverse' : '')}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-primary-400 hover:text-primary-600 rounded-full">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Input
              placeholder={t('addSkill') + '...'}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button variant="outline" onClick={addSkill}>
              <Plus size={16} /> Add
            </Button>
          </div>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle>{t('workExperience')}</CardTitle>
            <Button size="sm" variant="outline" onClick={() => { setEditingExp({}); setExpModalOpen(true); }}>
              <Plus size={15} /> {t('addExperience')}
            </Button>
          </CardHeader>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className={cn('flex items-start gap-4 p-4 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600">
                  <Briefcase size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                </div>
                <div className={cn('flex gap-1', isRTL ? 'flex-row-reverse' : '')}>
                  <button onClick={() => { setEditingExp(exp); setExpModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => setExperience(experience.filter(e => e.id !== exp.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {experience.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No experience added yet.</p>
            )}
          </div>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>{t('education')}</CardTitle>
            <Button size="sm" variant="outline" onClick={() => { setEditingEdu({}); setEduModalOpen(true); }}>
              <Plus size={15} /> {t('addEducation')}
            </Button>
          </CardHeader>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className={cn('flex items-start gap-4 p-4 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600">
                  <GraduationCap size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{edu.degree} in {edu.field}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</p>
                </div>
                <div className={cn('flex gap-1', isRTL ? 'flex-row-reverse' : '')}>
                  <button onClick={() => { setEditingEdu(edu); setEduModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => setEducation(education.filter(e => e.id !== edu.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>{t('languages')}</CardTitle>
          </CardHeader>
          <div className={cn('flex flex-wrap gap-2', isRTL ? 'flex-row-reverse' : '')}>
            {(demoData.languages ?? []).map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <Globe size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                <Badge variant="default">{lang.level}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Experience Modal */}
      <Modal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        title={editingExp.id ? 'Edit Experience' : t('addExperience')}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setExpModalOpen(false)}>{t('cancel')}</Button>
            <Button onClick={saveExperience}>{t('save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label={t('jobTitle')} value={editingExp.title ?? ''} onChange={e => setEditingExp({...editingExp, title: e.target.value})} placeholder="e.g. Senior Product Manager" />
          <Input label={t('company')} value={editingExp.company ?? ''} onChange={e => setEditingExp({...editingExp, company: e.target.value})} placeholder="Company name" />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('startDate')} type="month" value={editingExp.startDate ?? ''} onChange={e => setEditingExp({...editingExp, startDate: e.target.value})} />
            <Input label={t('endDate')} type="month" value={editingExp.endDate ?? ''} onChange={e => setEditingExp({...editingExp, endDate: e.target.value})} disabled={editingExp.current} />
          </div>
          <label className={cn('flex items-center gap-2 text-sm text-gray-700', isRTL ? 'flex-row-reverse' : '')}>
            <input type="checkbox" checked={editingExp.current ?? false} onChange={e => setEditingExp({...editingExp, current: e.target.checked})} className="rounded" />
            {t('currentlyWorking')}
          </label>
          <Textarea label="Description" value={editingExp.description ?? ''} onChange={e => setEditingExp({...editingExp, description: e.target.value})} rows={3} placeholder="Describe your role and responsibilities..." />
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        title={editingEdu.id ? 'Edit Education' : t('addEducation')}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEduModalOpen(false)}>{t('cancel')}</Button>
            <Button onClick={saveEducation}>{t('save')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label={t('institution')} value={editingEdu.institution ?? ''} onChange={e => setEditingEdu({...editingEdu, institution: e.target.value})} placeholder="University or school name" />
          <Select
            label={t('degree')}
            value={editingEdu.degree ?? ''}
            onChange={e => setEditingEdu({...editingEdu, degree: e.target.value})}
            options={[
              { value: 'Bachelor of Science', label: 'Bachelor of Science' },
              { value: 'Bachelor of Arts', label: 'Bachelor of Arts' },
              { value: 'Master of Science', label: 'Master of Science' },
              { value: 'Master of Arts', label: 'Master of Arts' },
              { value: 'MBA', label: 'MBA' },
              { value: 'PhD', label: 'PhD' },
              { value: 'Associate Degree', label: 'Associate Degree' },
              { value: 'Diploma', label: 'Diploma' },
            ]}
            placeholder="Select degree"
          />
          <Input label={t('fieldOfStudy')} value={editingEdu.field ?? ''} onChange={e => setEditingEdu({...editingEdu, field: e.target.value})} placeholder="e.g. Computer Engineering" />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('startDate')} type="month" value={editingEdu.startDate ?? ''} onChange={e => setEditingEdu({...editingEdu, startDate: e.target.value})} />
            <Input label={t('endDate')} type="month" value={editingEdu.endDate ?? ''} onChange={e => setEditingEdu({...editingEdu, endDate: e.target.value})} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
