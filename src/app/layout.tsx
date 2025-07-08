import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { Suspense } from 'react';
import Navigation from '@/app/components/Navigation';

const inter = Inter({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | AK Proleter',
    default: 'AK Proleter',
  },
  description: 'Atletski Klub Proleter Zrenjanin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <div className='min-h-screen bg-gray-50 dark:bg-neutral-800'>
          <Navigation />
          <Suspense fallback={'Loading...'}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
