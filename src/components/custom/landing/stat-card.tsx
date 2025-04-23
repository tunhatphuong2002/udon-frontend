import Image from 'next/image';
import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  iconUrl: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, iconUrl }) => {
  return (
    <div className="bg-[rgba(255,255,255,0.71)] border self-stretch flex min-w-60 overflow-hidden flex-col items-stretch flex- spac[-8px]-y-6 shrink basis-[0%] p-6 rounded-3xl border-[rgba(138,183,246,1)] border-solid backdrop-blur-md">
      {/* Top Glow Effect */}
      <div className="absolute w-3/4 left-1/2 -translate-x-1/2 h-[20px] top-0  bg-[#8ab7f6] blur-[42px] rounded-full z-0" />

      {/* Value and Label */}
      <div className="flex flex-row justify-between">
        <div className="w-full text-neutral-800 font-normal">
          <div className="text-[40px]">
            <span className="text-[rgba(107,107,107,1)]">$</span>
            <span className="font-semibold">{value}</span>
          </div>
          <div className="text-2xl mt-1.5">{label}</div>
        </div>
        <div className="w-[100px] h-[100px] relative">
          <Image src={iconUrl} fill alt="Icon Stat Card Supply" />
        </div>
      </div>
    </div>
  );
};
