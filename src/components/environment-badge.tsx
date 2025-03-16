import React from 'react';
import { getCurrentEnvironment, APP_NAME } from '@/utils/env';

type BadgeColors = {
  [key: string]: {
    bg: string;
    text: string;
  };
};

export const EnvironmentBadge: React.FC = () => {
  const env = getCurrentEnvironment();

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
  if (env === 'production') {
    return null;
  }

  const { bg, text } = colors[env] || colors.development;

  return (
    <div
      className={`fixed bottom-2 right-2 ${bg} ${text} px-3 py-1 rounded-full text-xs font-medium shadow-md z-50`}
    >
      {APP_NAME} - {env.toUpperCase()}
    </div>
  );
};

export default EnvironmentBadge;
