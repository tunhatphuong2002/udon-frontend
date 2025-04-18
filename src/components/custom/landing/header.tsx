import React from 'react';
import { Typography } from '@/components/common/typography';

export const Header: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[20] flex justify-center items-center py-6">
      <div className="px-3 md:px-5 py-2 md:py-2.5 bg-neutral-900 rounded-[17px] flex items-center gap-4 md:gap-9">
        {['Hero', 'Infrastructure', 'Lending'].map((text, index) => (
          <Typography key={index} size="sm" className="text-white md:text-base md:font-medium">
            {text}
          </Typography>
        ))}
      </div>
    </div>
  );
};
