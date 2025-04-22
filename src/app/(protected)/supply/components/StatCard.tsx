'use client';

import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  iconUrl: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, iconUrl }) => {
  return (
    <div className="flex-1 flex items-center gap-5 p-5 rounded-[18px] border-2 border-solid border-[#3E73C4]">
      <div className="flex-1">
        <div className="text-[32px] font-semibold text-white">{value}</div>
        <div className="text-base text-[#D9D9D9]">{label}</div>
      </div>
      <img src={iconUrl} alt="" className="w-[99px] h-[99px]" />
    </div>
  );
};
