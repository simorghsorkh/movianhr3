/**
 * Data Access Layer — Supabase queries.
 * Uses `as any` casts to bypass Supabase's complex generic inference
 * while still benefiting from full type safety at the call sites.
 */

import { createClient } from './client';

const sb = () => createClient();

// ── Profiles ────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await sb().from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await (sb().from('profiles') as any).update(updates).eq('id', userId);
  if (error) throw error;
}

// ── Mentor Profiles ─────────────────────────────────────────

export async function getApprovedMentors() {
  const { data, error } = await sb()
    .from('mentor_profiles')
    .select('*, profiles(*)')
    .eq('approval_status', 'approved');
  if (error) throw error;
  return data ?? [];
}

export async function upsertMentorProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await (sb().from('mentor_profiles') as any).upsert({ id: userId, ...updates });
  if (error) throw error;
}

// ── Trainer Profiles ────────────────────────────────────────

export async function getApprovedTrainers() {
  const { data, error } = await sb()
    .from('trainer_profiles')
    .select('*, profiles(*)')
    .eq('approval_status', 'approved');
  if (error) throw error;
  return data ?? [];
}

// ── Job Seeker Profile ──────────────────────────────────────

export async function getJobSeekerProfile(userId: string) {
  const { data, error } = await sb()
    .from('job_seeker_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && (error as any).code !== 'PGRST116') throw error;
  return data;
}

export async function upsertJobSeekerProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await (sb().from('job_seeker_profiles') as any).upsert({ id: userId, ...updates });
  if (error) throw error;
}

// ── Work Experience ─────────────────────────────────────────

export async function getWorkExperiences(profileId: string) {
  const { data, error } = await sb()
    .from('work_experiences')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addWorkExperience(exp: Record<string, unknown>) {
  const { data, error } = await (sb().from('work_experiences') as any).insert(exp).select().single();
  if (error) throw error;
  return data;
}

export async function deleteWorkExperience(id: string) {
  const { error } = await sb().from('work_experiences').delete().eq('id', id);
  if (error) throw error;
}

// ── Education ───────────────────────────────────────────────

export async function getEducation(profileId: string) {
  const { data, error } = await sb()
    .from('education')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addEducation(edu: Record<string, unknown>) {
  const { data, error } = await (sb().from('education') as any).insert(edu).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEducation(id: string) {
  const { error } = await sb().from('education').delete().eq('id', id);
  if (error) throw error;
}

// ── Courses ─────────────────────────────────────────────────

export async function getPublishedCourses() {
  const { data, error } = await sb()
    .from('courses')
    .select('*, profiles(name)')
    .eq('status', 'published')
    .eq('approval_status', 'approved');
  if (error) throw error;
  return data ?? [];
}

export async function getTrainerCourses(trainerId: string) {
  const { data, error } = await sb()
    .from('courses')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCourse(course: Record<string, unknown>) {
  const { data, error } = await (sb().from('courses') as any).insert(course).select().single();
  if (error) throw error;
  return data;
}

export async function updateCourse(id: string, updates: Record<string, unknown>) {
  const { error } = await (sb().from('courses') as any).update(updates).eq('id', id);
  if (error) throw error;
}

// ── Course Enrollments ──────────────────────────────────────

export async function enrollInCourse(courseId: string, jobSeekerId: string) {
  const { error } = await (sb().from('course_enrollments') as any).insert({
    course_id: courseId,
    job_seeker_id: jobSeekerId,
    progress: 0,
  });
  if (error) throw error;
}

export async function getMyEnrollments(jobSeekerId: string) {
  const { data, error } = await sb()
    .from('course_enrollments')
    .select('*, courses(*)')
    .eq('job_seeker_id', jobSeekerId);
  if (error) throw error;
  return data ?? [];
}

export async function getTrainerStudents(trainerId: string) {
  const { data, error } = await sb()
    .from('course_enrollments')
    .select('*, courses!inner(id, title, trainer_id), seeker:job_seeker_id(id, name, email, avatar)')
    .eq('courses.trainer_id', trainerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Consultation Requests ───────────────────────────────────

export async function sendConsultationRequest(req: Record<string, unknown>) {
  const { data, error } = await (sb().from('consultation_requests') as any).insert(req).select().single();
  if (error) throw error;
  return data;
}

export async function getMyRequests(jobSeekerId: string) {
  const { data, error } = await sb()
    .from('consultation_requests')
    .select('*, mentor:mentor_id(name, avatar)')
    .eq('job_seeker_id', jobSeekerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMentorRequests(mentorId: string) {
  const { data, error } = await sb()
    .from('consultation_requests')
    .select('*, seeker:job_seeker_id(name, avatar, email)')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateRequestStatus(
  id: string,
  status: 'accepted' | 'rejected' | 'completed',
  notes?: string
) {
  const { error } = await (sb().from('consultation_requests') as any)
    .update({ status, ...(notes !== undefined ? { notes } : {}) })
    .eq('id', id);
  if (error) throw error;
}

// ── Roadmap ─────────────────────────────────────────────────

export async function getRoadmapItems(profileId: string) {
  const { data, error } = await sb()
    .from('roadmap_items')
    .select('*')
    .eq('profile_id', profileId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function toggleRoadmapItem(id: string, completed: boolean) {
  const { error } = await (sb().from('roadmap_items') as any).update({ completed }).eq('id', id);
  if (error) throw error;
}

// ── Notifications ───────────────────────────────────────────

export async function getNotifications(userId: string) {
  const { data, error } = await sb()
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  await (sb().from('notifications') as any).update({ read: true }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string) {
  await (sb().from('notifications') as any).update({ read: true }).eq('user_id', userId);
}

// ── Assessment ──────────────────────────────────────────────

export async function saveAssessmentResult(profileId: string, score: number, answers: Record<string, string>) {
  const { error } = await (sb().from('assessment_results') as any).insert({ profile_id: profileId, score, answers });
  if (error) throw error;
  await (sb().from('job_seeker_profiles') as any).upsert({ id: profileId, employability_score: score });
}
