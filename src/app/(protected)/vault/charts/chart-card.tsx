import { cn } from '@/types/utils/tailwind';
import React from 'react';

interface ChartCardProps {
  title: string;
  value: string | number;
  valueSuffix?: string;
  children: React.ReactNode;
  filters?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  value,
  valueSuffix = '',
  children,
  filters,
  className,
}) => {
  return (
    <div className={cn('bg-[#232325] rounded-2xl p-5 md:p-6', className)}>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <div className="text-sm text-gray-300 mb-1">{title}</div>
          <div className="text-[2.2rem] leading-tight font-semibold text-white">
            {value}
            <span className="text-lg font-medium text-gray-400">{valueSuffix}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">{filters}</div>
      </div>
      <div className="mt-6 h-52 w-full">{children}</div>
    </div>
  );
};
