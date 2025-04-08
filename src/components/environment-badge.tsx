'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentEnvironment, APP_NAME } from '@/utils/env';

type BadgeColors = {
  [key: string]: {
    bg: string;
    text: string;
  };
};

export const EnvironmentBadge: React.FC = () => {
  // Add client-side only state
  const [mounted, setMounted] = useState(false);
  const [environment, setEnvironment] = useState<string>('');
  
  // Only run this effect on the client
  useEffect(() => {
    setMounted(true);
    setEnvironment(getCurrentEnvironment());
  }, []);

  // Don't render anything on server or before mounting
  if (!mounted) {
    return null;
  }

  const colors: BadgeColors = {
    development: {
      bg: 'bg-blue-500',
      text: 'text-white',
    },
    production: {
      bg: 'bg-green-500',
      text: 'text-white',
    },
  };

  // Hide in production
  if (environment === 'production') {
    return null;
  }

  const { bg, text } = colors[environment] || colors.development;

  return (
    <div
      className={`fixed bottom-2 right-2 ${bg} ${text} px-3 py-1 rounded-full text-xs font-medium shadow-md z-50`}
    >
      {APP_NAME} - {environment.toUpperCase()}
    </div>
  );
};

export default EnvironmentBadge; 