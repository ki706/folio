import type { Metadata } from 'next';
import './globals.css';
import MobileLayout from '@/components/layout/MobileLayout';

export const metadata: Metadata = {
  title: 'Emitto | AI Content Engine for Developers',
  description: 'Your personal AI copywriter. Generate LinkedIn posts and X threads that get you hired.',
  openGraph: {
    title: 'Emitto | AI Content Engine for Developers',
    description: 'Your personal AI copywriter. Generate LinkedIn posts and X threads that get you hired.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emitto | AI Content Engine for Developers',
    description: 'Your personal AI copywriter.',
  },
};

import { ToastProvider } from '@/components/ui/Toast';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get('emitto_demo_mode')?.value === 'true';
  const hasToken = cookieStore.getAll().some(c => c.name.includes('-auth-token'));

  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <MobileLayout serverSession={{ isDemo, hasToken }}>{children}</MobileLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
