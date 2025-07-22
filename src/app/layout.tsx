import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { MusicPlayerProvider } from '@/context/MusicPlayerContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { AppShell } from '@/components/app-shell';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'AR Music',
  description: 'Your favorite music streaming app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sacramento&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <TooltipProvider>
          <SettingsProvider>
            <ThemeProvider>
              <AuthProvider>
                <MusicPlayerProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster />
                </MusicPlayerProvider>
              </AuthProvider>
            </ThemeProvider>
          </SettingsProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
