import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { FeatureAccessProvider } from '@/contexts/FeatureAccessContext';
import { SiteStatsProvider } from '@/contexts/SiteStatsContext';

export const metadata: Metadata = {
  title: 'Movian — Career Transformation Platform',
  description: 'Movian helps professionals become more employable through assessment, mentorship, learning, and personalized career roadmaps.',
  keywords: 'career, employability, mentorship, CV, job seeker, Iran, professional development',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Default to LTR/English — LanguageProvider will update dir/lang dynamically
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <SiteStatsProvider>
              <FeatureAccessProvider>
                <NotificationProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </NotificationProvider>
              </FeatureAccessProvider>
            </SiteStatsProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
