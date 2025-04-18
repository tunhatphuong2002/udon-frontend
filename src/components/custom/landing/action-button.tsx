import { cn } from '@/types/utils/tailwind';
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  icon?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'flex items-center gap-3 text-base font-normal text-center rounded-[50px] px-2.5 py-2.5',
        variant === 'primary' && 'bg-[rgba(30,30,30,1)] text-white',
        variant === 'outline' && 'bg-white border border-[rgba(205,205,205,1)] text-black',
        className
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {icon && <img src={icon} className="aspect-[1] object-contain w-4 shrink-0" alt="" />}
    </button>
  );
};
