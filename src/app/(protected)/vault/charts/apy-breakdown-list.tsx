import React from 'react';
import { cn } from '@/types/utils/tailwind';

interface APYBreakdownItemProps {
  label: string;
  value: string;
}

const APYBreakdownItem: React.FC<APYBreakdownItemProps> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-xl px-4 py-2 bg-[rgba(40,41,44,0.85)]">
    <span className="flex items-center gap-2">
      <span className="inline-block h-5 w-5 rounded-full bg-primary opacity-75" />
      <span className="text-sm text-gray-100">{label}</span>
    </span>
    <span className="font-semibold text-sm text-gray-300">{value}</span>
  </div>
);

interface APYBreakdownListProps {
  items: Array<{ label: string; value: string }>;
  className?: string;
}

export const APYBreakdownList: React.FC<APYBreakdownListProps> = ({ items, className }) => (
  <div className={cn('flex flex-col gap-2 min-w-[160px]', className)}>
    {items.map((item, i) => (
      <APYBreakdownItem key={i} label={item.label} value={item.value} />
    ))}
  </div>
);
