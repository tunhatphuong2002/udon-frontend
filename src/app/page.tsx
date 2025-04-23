'use client';

import { useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { Landing } from '@/components/custom/landing';

export default function HomePage() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Set light theme for landing page
    setTheme('light');
  }, [setTheme]);

  return <Landing />;
}
