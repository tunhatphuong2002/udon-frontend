import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import EnvironmentBadge from '@/components/environment-badge';
import { Analytics } from '@/analytics';
import { SITE_URL } from '@/utils/env';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Udon Frontend',
    default: 'Udon Frontend - Modern Web Application',
  },
  description: 'A modern web application built with Next.js, React, and TypeScript',
  keywords: ['next.js', 'react', 'typescript', 'web development'],
  authors: [{ name: 'Udon Team' }],
  creator: 'Udon Team',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Udon Frontend',
    description: 'A modern web application built with Next.js, React, and TypeScript',
    url: SITE_URL,
    siteName: 'Udon Frontend',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Udon Frontend',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Udon Frontend',
    description: 'A modern web application built with Next.js, React, and TypeScript',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <EnvironmentBadge />
        <Analytics />
      </body>
    </html>
  );
}
