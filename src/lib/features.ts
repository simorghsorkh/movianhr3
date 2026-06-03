/**
 * Controllable job-seeker features.
 * Profile and Requests are NOT here — they're always accessible via sidebar.
 */
export const FEATURES = [
  {
    key: 'assessment',
    href: '/dashboard/job-seeker/assessment',
    labelFa: 'ارزیابی شغلی',
    labelEn: 'Career Assessment',
    descFa: 'امتیاز استخدام‌پذیری خود را بسنجید',
    descEn: 'Measure your employability score',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    key: 'cv-builder',
    href: '/dashboard/job-seeker/cv-builder',
    labelFa: 'ساخت رزومه',
    labelEn: 'CV Builder',
    descFa: 'رزومه حرفه‌ای بسازید',
    descEn: 'Build a professional resume',
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
  },
  {
    key: 'linkedin',
    href: '/dashboard/job-seeker/linkedin',
    labelFa: 'بهینه‌سازی لینکدین',
    labelEn: 'LinkedIn Optimizer',
    descFa: 'پروفایل لینکدین خود را بهبود دهید',
    descEn: 'Improve your LinkedIn profile with AI',
    color: 'bg-sky-50 text-sky-600',
    border: 'border-sky-100',
  },
  {
    key: 'roadmap',
    href: '/dashboard/job-seeker/roadmap',
    labelFa: 'نقشه راه من',
    labelEn: 'My Roadmap',
    descFa: 'مسیر شغلی خود را دنبال کنید',
    descEn: 'Follow your career path',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-100',
  },
  {
    key: 'mentors',
    href: '/dashboard/job-seeker/mentors',
    labelFa: 'یافتن مشاور',
    labelEn: 'Find Mentors',
    descFa: 'با متخصصان ارتباط بگیرید',
    descEn: 'Connect with industry experts',
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
  },
  {
    key: 'courses',
    href: '/dashboard/job-seeker/courses',
    labelFa: 'دوره‌ها',
    labelEn: 'Courses',
    descFa: 'مهارت‌های جدید بیاموزید',
    descEn: 'Learn new skills',
    color: 'bg-green-50 text-green-600',
    border: 'border-green-100',
  },
] as const;

export type FeatureKey = typeof FEATURES[number]['key'];
export type Feature = typeof FEATURES[number];
