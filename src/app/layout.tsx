import type { Metadata } from 'next';
import EnvironmentBadge from '@/components/environment-badge';
import { Analytics } from '@/analytics';
import { SITE_URL } from '@/types/utils/env';
import { Providers } from '@/providers';
import './globals.css';
// import { MainLayout } from '@/components/layout';
import localFont from 'next/font/local';
// import Header from '@/components/layout/header';
// import Footer from '@/components/layout/footer';
// import Image from 'next/image';

const BattlefinFont = localFont({
  src: '../../public/fonts/Battlefin-Black.woff2',
  variable: '--font-battlefin',
  weight: '900',
});

const NBInternationalFont = localFont({
  variable: '--font-nb-international',
  src: [
    {
      path: '../../public/fonts/NBInternationalLightWebfont.woff2',
      weight: '300',
    },
    {
      path: '../../public/fonts/NBInternationalRegularWebfont.woff2',
      weight: '400',
    },
    {
      path: '../../public/fonts/NBInternationalBoldWebfont.woff2',
      weight: '700',
    },
  ],
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
  const fontClasses = `${BattlefinFont.variable} ${NBInternationalFont.variable}`;

  return (
    <html lang="en" className={fontClasses} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        {/* TODO: remove this when we have a production environment */}
        <EnvironmentBadge />
        {/* Analytics webpage */}
        <Analytics />
      </body>
    </html>
  );
}
