import React from 'react';
import { Typography } from '@/components/common/typography';

type HeaderProps = {
  onSectionClick: (section: string) => void;
};

export const Header: React.FC<HeaderProps> = ({ onSectionClick }) => {
  const sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'backedBy', label: 'Backed by' },
    { id: 'upcoming', label: 'Upcoming Features' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[20] flex justify-center items-center py-6">
      <div className="px-3 md:px-5 py-2 md:py-3.5 bg-neutral-900 rounded-full flex items-center gap-4 md:gap-9">
        {sections.map(({ id, label }) => (
          <button key={id} onClick={() => onSectionClick(id)} className="focus:outline-none">
            <Typography
              size="sm"
              className="text-white md:text-base md:font-medium cursor-pointer hover:text-primary transition-colors"
            >
              {label}
            </Typography>
          </button>
        ))}
      </div>
    </div>
  );
};
