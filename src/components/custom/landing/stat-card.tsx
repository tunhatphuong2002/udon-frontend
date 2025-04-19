import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-[rgba(255,255,255,0.71)] border self-stretch flex min-w-60 overflow-hidden flex-col items-stretch flex- spac[-8px]-y-6 shrink basis-[0%] p-6 rounded-3xl border-[rgba(138,183,246,1)] border-solid backdrop-blur-md">
      {/* Top Glow Effect */}
      <div className="absolute w-3/4 left-1/2 -translate-x-1/2 h-[20px] top-0  bg-[#8ab7f6] blur-[42px] rounded-full z-0" />

      {/* Icon 3 circle */}
      <div className="flex items-center space-x-[-8px]">
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
      </div>

      {/* Value and Label */}
      <div className="w-full text-neutral-800 font-normal mt-[27px]">
        <div className="text-[40px]">
          <span className="text-[rgba(107,107,107,1)]">$</span>
          <span className="font-semibold">{value}</span>
        </div>
        <div className="text-2xl mt-1.5">{label}</div>
      </div>
    </div>
  );
};
