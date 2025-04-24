import { cn } from '@/types/utils/tailwind';
import { Typography } from '@/components/common/typography';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  icon?: string;
  className?: string;
  background?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className,
  background,
}) => {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between flex-1 min-w-[180px] p-4 rounded-lg border bg-card',
        className
      )}
    >
      {background && (
        <img
          src={background}
          className="absolute h-full w-full object-cover inset-0 rounded-lg"
          alt=""
        />
      )}
      <div className="relative">
        <div className="text-xl font-medium">{value}</div>
        <Typography size="sm" className="text-muted-foreground mt-1">
          {title}
        </Typography>
      </div>
      {icon && (
        <img
          src={icon}
          className="aspect-square object-contain w-5 absolute top-3 right-3"
          alt=""
        />
      )}
    </div>
  );
};
