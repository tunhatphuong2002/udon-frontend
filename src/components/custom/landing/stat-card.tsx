import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-[rgba(255,255,255,0.71)] border self-stretch flex min-w-60 flex-col items-stretch flex- spac[-8px]-y-6 shrink basis-[0%] p-6 rounded-3xl border-[rgba(138,183,246,1)] border-solid backdrop-blur-md">
      <div className="flex items-center space-x-[-8px]">
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
        <div className="border self-stretch flex w-9 shrink-0 h-9 my-auto rounded-[50%] border-black border-solid" />
      </div>
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
