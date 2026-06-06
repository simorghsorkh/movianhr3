export type Language = 'fa' | 'en' | 'nl';
export type UserRole = 'job-seeker' | 'mentor' | 'trainer' | 'admin';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: string;
  approvalStatus?: ApprovalStatus;
}

export interface JobSeeker extends User {
  role: 'job-seeker';
  headline?: string;
  employabilityScore?: number;
  profileCompletion?: number;
  skills?: string[];
  languages?: { name: string; level: string }[];
  experience?: WorkExperience[];
  education?: Education[];
  cvUrl?: string;
  assessmentCompleted?: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Mentor extends User {
  role: 'mentor';
  expertise: string[];
  hourlyRate?: number;
  rating?: number;
  totalSessions?: number;
  availability?: string[];
  approvalStatus: ApprovalStatus;
}

export interface Trainer extends User {
  role: 'trainer';
  specialization?: string[];
  totalCourses?: number;
  totalStudents?: number;
  approvalStatus: ApprovalStatus;
}

export interface Course {
  id: string;
  trainerId: string;
  trainerName: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  status: CourseStatus;
  enrollments: number;
  rating?: number;
  thumbnail?: string;
  createdAt: string;
  approvalStatus: ApprovalStatus;
}

export interface ConsultationRequest {
  id: string;
  jobSeekerId: string;
  jobSeekerName: string;
  mentorId: string;
  mentorName: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  sessionDate?: string;
  notes?: string;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  questionFa: string;
  options: { value: string; label: string; labelFa: string }[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  category: 'skill' | 'course' | 'experience' | 'certification';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  completed: boolean;
  resources?: string[];
}

export interface AdminStats {
  totalUsers: number;
  jobSeekers: number;
  mentors: number;
  trainers: number;
  pendingMentors: number;
  pendingTrainers: number;
  pendingCourses: number;
  totalCourses: number;
  totalRequests: number;
  pendingRequests: number;
  monthlyGrowth: number;
}
