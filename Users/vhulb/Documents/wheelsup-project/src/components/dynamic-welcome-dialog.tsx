
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the WelcomeDialog and disable SSR for it
export const DynamicWelcomeDialog = dynamic(
  () => import('./welcome-dialog').then(mod => mod.WelcomeDialog),
  { ssr: false }
);
