'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@/components/common/typography';
import { Skeleton } from '@/components/common/skeleton';
import { ExternalLinkIcon, Sparkles } from 'lucide-react';
import { cn } from '@/utils/tailwind';
import { ShineBorder } from '@/components/common/shine-border';
import { DepositDialog } from './supply/deposit-to-udon-dialog';

interface DepositBadgeBadgeProps {
  isLoading?: boolean;
  className?: string;
}

export function DepositBadge({ isLoading = false, className }: DepositBadgeBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration issues
  }

  if (isLoading) {
    return (
      <div className={cn('inline-flex items-center h-9', className)}>
        <Skeleton className="w-40 h-9 rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'relative inline-flex items-center gap-2 py-2 px-3 rounded-full h-9',
          'bg-gradient-to-r from-background/20 via-background/50 to-background/20',
          'cursor-pointer',
          isHovered && 'scale-[1.03]',
          className
        )}
        onClick={() => setDepositModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ShineBorder shineColor={['#52E5FF', '#36B1FF', '#E4F5FF']} duration={10} />
        <Sparkles
          className={cn(
            'w-4 h-4 transition-colors duration-300',
            isHovered ? 'text-primary' : 'text-submerged'
          )}
        />
        <Typography
          variant="small"
          weight="medium"
          className={cn(
            'transition-colors duration-300',
            isHovered ? 'text-foreground' : 'text-submerged'
          )}
        >
          Deposit to Udon
        </Typography>
        <ExternalLinkIcon
          className={cn(
            'w-3.5 h-3.5 transition-all duration-300',
            isHovered ? 'text-primary transform translate-x-0.5 -translate-y-0.5' : 'text-submerged'
          )}
        />
      </div>

      {/* re-render when close or click outside dialog */}
      {depositModalOpen && (
        <DepositDialog open={depositModalOpen} onOpenChange={setDepositModalOpen} />
      )}
    </>
  );
}
