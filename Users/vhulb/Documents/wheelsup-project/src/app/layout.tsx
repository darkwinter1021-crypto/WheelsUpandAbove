
import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '../components/app-header';
import { Toaster } from "../components/ui/toaster";
import { AuthProvider } from '../contexts/auth-context';
import { RideProvider } from '../contexts/ride-context';
import { Suspense } from 'react';
import { Car } from 'lucide-react';
import { PT_Sans } from 'next/font/google';
import { DynamicWelcomeDialog } from '../components/dynamic-welcome-dialog';
import { ThemeProvider } from '../components/theme-provider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'WheelsUp',
  description: 'Your friendly ride-sharing community.',
};

function RootLoading() {
  return (
     <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <div className="relative flex items-center justify-center">
            <Car className="h-16 w-16 text-primary animate-pulse" />
            <div className="absolute h-24 w-24 border-2 border-primary/50 rounded-full animate-ping"></div>
        </div>
        <p className="mt-4 text-muted-foreground animate-pulse">Finding your ride...</p>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
      </head>
      <body className={`${ptSans.variable} font-body antialiased flex flex-col h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <RideProvider>
              <AppHeader />
              <main className="flex-1">
                <Suspense fallback={<RootLoading />}>
                  {children}
                </Suspense>
              </main>
              <footer className="py-4 text-center text-xs text-muted-foreground border-t">
                This app is in a Very Early Development Process - Please Contact (darkwinter1021@gmail.com) for suggestions and Issues.
              </footer>
              <Toaster />
              <DynamicWelcomeDialog />
            </RideProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
