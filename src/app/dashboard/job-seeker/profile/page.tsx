'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Briefcase, GraduationCap, Zap, Save, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  getJobSeekerProfile, upsertJobSeekerProfile,
  getWorkExperiences, addWorkExperience, deleteWorkExperience,
  getEducation, addEducation, deleteEducation,
  updateProfile,
} from '@/lib/supabase/dal';
import { cn } from '@/lib/utils';

export default function JobSeekerProfilePage() {
  const { t, isRTL } = useLang();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Basic info
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Experience
  const [experience, setExperience] = useState<any[]>([]);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>({});
  const [savingExp, setSavingExp] = useState(false);

  // Education
  const [education, setEducation] = useState<any[]>([]);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any>({});
  const [savingEdu, setSavingEdu] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [jsProfile, exps, edus] = await Promise.all([
          getJobSeekerProfile(user.id),
          getWorkExperiences(user.id),
          getEducation(user.id),
        ]);
        setName(user.name ?? '');
        setHeadline(user.headline ?? '');
        setPhone((user as any).phone ?? '');
        setLocation((user as any).location ?? '');
        setBio((user as any).bio ?? '');
        setSkills(jsProfile?.skills ?? []);
        setExperience(exps);
        setEducation(edus);
      } catch {
        toast.error('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await Promise.all([
        updateProfile(user.id, { name, headline, phone, location, bio }),
        upsertJobSeekerProfile(user.id, { skills }),
      ]);
      await updateUser({ name, headline, phone, location, bio });
      toast.success('Profile saved successfully!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const saveExp = async () => {
    if (!user || !editingExp.company || !editingExp.position) return;
    setSavingExp(true);
    try {
      const saved = await addWorkExperience({
        profile_id: user.id,
        company: editingExp.company,
        position: editingExp.position,
        start_date: editingExp.startDate ?? null,
        end_date: editingExp.endDate ?? null,
        is_current: editingExp.current ?? false,
        description: editingExp.description ?? null,
      });
      setExperience(prev => [saved, ...prev]);
      setExpModalOpen(false);
      setEditingExp({});
      toast.success('Work experience added!');
    } catch {
      toast.error('Failed to save experience.');
    } finally {
      setSavingExp(false);
    }
  };

  const removeExp = async (id: string) => {
    try {
      await deleteWorkExperience(id);
      setExperience(prev => prev.filter(e => e.id !== id));
      toast.success('Experience removed.');
    } catch {
      toast.error('Failed to remove experience.');
    }
  };

  const saveEdu = async () => {
    if (!user || !editingEdu.institution || !editingEdu.degree) return;
    setSavingEdu(true);
    try {
      const saved = await addEducation({
        profile_id: user.id,
        institution: editingEdu.institution,
        degree: editingEdu.degree,
        field: editingEdu.field ?? null,
        start_date: editingEdu.startDate ?? null,
        end_date: editingEdu.endDate ?? null,
        is_current: editingEdu.current ?? false,
      });
      setEducation(prev => [saved, ...prev]);
      setEduModalOpen(false);
      setEditingEdu({});
      toast.success('Education added!');
    } catch {
      toast.error('Failed to save education.');
    } finally {
      setSavingEdu(false);
    }
  };

  const removeEdu = async (id: string) => {
    try {
      await deleteEducation(id);
      setEducation(prev => prev.filter(e => e.id !== id));
      toast.success('Education removed.');
    } catch {
      toast.error('Failed to remove education.');
    }
  };

  if (loading) return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('profile')} subtitle="Manage your professional profile." />

      <div className="p-6 space-y-6 max-w-3xl mx-auto">

        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <div className={cn('flex items-center gap-4 mb-6', isRTL ? 'flex-row-reverse' : '')}>
            <Avatar name={name} src={user?.avatar} size="xl" />
            <div>
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Professional Headline" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior Developer" />
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+98 912..." />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Tehran, Iran" />
          </div>
          <div className="mt-4">
            <Textarea label="Bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell mentors about yourself..." />
          </div>
          <div className={cn('flex justify-end mt-4', isRTL ? 'justify-start' : '')}>
            <Button onClick={handleSaveProfile} loading={saving}><Save size={15} /> Save Profile</Button>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader><CardTitle><Zap size={16} className="text-primary-600" /> Skills</CardTitle></CardHeader>
          <div className={cn('flex flex-wrap gap-2 mb-4', isRTL ? 'flex-row-reverse' : '')}>
            {skills.map(skill => (
              <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                {skill}
                <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="ms-1 text-primary-400 hover:text-primary-700"><X size={12} /></button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet.</p>}
          </div>
          <div className={cn('flex gap-2', isRTL ? 'flex-row-reverse' : '')}>
            <Input placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} />
            <Button onClick={addSkill} variant="outline"><Plus size={16} /></Button>
          </div>
          <div className={cn('flex justify-end mt-4', isRTL ? 'justify-start' : '')}>
            <Button onClick={handleSaveProfile} loading={saving} size="sm" variant="outline"><Save size={14} /> Save Skills</Button>
          </div>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <CardTitle><Briefcase size={16} className="text-orange-500" /> Work Experience</CardTitle>
            <Button size="sm" onClick={() => { setEditingExp({}); setExpModalOpen(true); }}><Plus size={14} /> Add</Button>
          </CardHeader>
          <div className="space-y-4">
            {experience.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No work experience added.</p>}
            {experience.map(exp => (
              <div key={exp.id} className={cn('flex items-start gap-3 p-4 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase size={18} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-400">{exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
                <button onClick={() => removeExp(exp.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle><GraduationCap size={16} className="text-purple-500" /> Education</CardTitle>
            <Button size="sm" onClick={() => { setEditingEdu({}); setEduModalOpen(true); }}><Plus size={14} /> Add</Button>
          </CardHeader>
          <div className="space-y-4">
            {education.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No education added.</p>}
            {education.map(edu => (
              <div key={edu.id} className={cn('flex items-start gap-3 p-4 bg-gray-50 rounded-xl', isRTL ? 'flex-row-reverse' : '')}>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-400">{edu.start_date} — {edu.is_current ? 'Present' : edu.end_date}</p>
                </div>
                <button onClick={() => removeEdu(edu.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title="Add Work Experience" size="md"
        footer={<><Button variant="outline" onClick={() => setExpModalOpen(false)}>{t('cancel')}</Button><Button onClick={saveExp} loading={savingExp}>{t('save')}</Button></>}>
        <div className="space-y-3">
          <Input label="Company *" value={editingExp.company ?? ''} onChange={e => setEditingExp({ ...editingExp, company: e.target.value })} />
          <Input label="Position *" value={editingExp.position ?? ''} onChange={e => setEditingExp({ ...editingExp, position: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="month" value={editingExp.startDate ?? ''} onChange={e => setEditingExp({ ...editingExp, startDate: e.target.value })} />
            <Input label="End Date" type="month" value={editingExp.endDate ?? ''} onChange={e => setEditingExp({ ...editingExp, endDate: e.target.value })} disabled={editingExp.current} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={editingExp.current ?? false} onChange={e => setEditingExp({ ...editingExp, current: e.target.checked })} className="rounded" />
            Currently working here
          </label>
          <Textarea label="Description" value={editingExp.description ?? ''} onChange={e => setEditingExp({ ...editingExp, description: e.target.value })} rows={3} />
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal isOpen={eduModalOpen} onClose={() => setEduModalOpen(false)} title="Add Education" size="md"
        footer={<><Button variant="outline" onClick={() => setEduModalOpen(false)}>{t('cancel')}</Button><Button onClick={saveEdu} loading={savingEdu}>{t('save')}</Button></>}>
        <div className="space-y-3">
          <Input label="Institution *" value={editingEdu.institution ?? ''} onChange={e => setEditingEdu({ ...editingEdu, institution: e.target.value })} />
          <Input label="Degree *" value={editingEdu.degree ?? ''} onChange={e => setEditingEdu({ ...editingEdu, degree: e.target.value })} placeholder="e.g. Bachelor's" />
          <Input label="Field of Study" value={editingEdu.field ?? ''} onChange={e => setEditingEdu({ ...editingEdu, field: e.target.value })} placeholder="e.g. Computer Science" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="month" value={editingEdu.startDate ?? ''} onChange={e => setEditingEdu({ ...editingEdu, startDate: e.target.value })} />
            <Input label="End Date" type="month" value={editingEdu.endDate ?? ''} onChange={e => setEditingEdu({ ...editingEdu, endDate: e.target.value })} disabled={editingEdu.current} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={editingEdu.current ?? false} onChange={e => setEditingEdu({ ...editingEdu, current: e.target.checked })} className="rounded" />
            Currently studying here
          </label>
        </div>
      </Modal>
    </div>
  );
}
