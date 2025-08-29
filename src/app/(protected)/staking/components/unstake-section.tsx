'use client';

import React, { useState } from 'react';
import { Clock, Zap } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { cn } from '@/utils/tailwind';
import { SlowWithdraw } from './slow-withdraw';
import { QuickWithdraw } from './quick-withdraw';
import { UserReserveData } from '../../dashboard/types';

type WithdrawType = 'slow' | 'quick';

interface UnstakeSectionProps {
  chrAsset: UserReserveData | undefined;
  stAsset: UserReserveData | undefined;
  refetchAssets: () => void;
  isLoadingAssets: boolean;
}

export const UnstakeSection: React.FC<UnstakeSectionProps> = ({
  chrAsset,
  stAsset,
  refetchAssets,
  isLoadingAssets,
}: UnstakeSectionProps) => {
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('slow');

  return (
    <div>
      {/* Withdraw Method Selection */}
      <div className="space-y-2 mb-6">
        <Typography weight="semibold" className="text-lg">
          Withdraw Method
        </Typography>

        <div className="grid grid-cols-2 gap-4">
          {/* Slow Withdraw Option */}
          <div
            className={cn(
              'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
              withdrawType === 'slow'
                ? 'border-transparent shadow-lg'
                : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
            )}
            onClick={() => setWithdrawType('slow')}
          >
            {withdrawType === 'slow' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] opacity-10" />
                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] rounded-xl p-[2px]">
                  <div className="bg-background w-full h-full rounded-[10px]" />
                </div>
              </>
            )}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    withdrawType === 'slow'
                      ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                      : 'bg-muted'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-5 h-5',
                      withdrawType === 'slow' ? 'text-black' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <Typography
                    weight="semibold"
                    className={cn(
                      withdrawType === 'slow'
                        ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                        : ''
                    )}
                  >
                    Slow withdrawal
                  </Typography>
                  {/* <Typography variant="small" className="text-muted-foreground">
                    14 days waiting period
                  </Typography> */}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="text-muted-foreground">
                  Rate: 1:1
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Waiting time: ~14 days
                </Typography>
              </div>
            </div>
          </div>

          {/* Quick Withdraw Option */}
          <div
            className={cn(
              'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
              withdrawType === 'quick'
                ? 'border-transparent shadow-lg'
                : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
            )}
            onClick={() => setWithdrawType('quick')}
          >
            {withdrawType === 'quick' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] opacity-10" />
                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] rounded-xl p-[2px]">
                  <div className="bg-background w-full h-full rounded-[10px]" />
                </div>
              </>
            )}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    withdrawType === 'quick'
                      ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                      : 'bg-muted'
                  )}
                >
                  <Zap
                    className={cn(
                      'w-5 h-5',
                      withdrawType === 'quick' ? 'text-black' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <Typography
                    weight="semibold"
                    className={cn(
                      withdrawType === 'quick'
                        ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                        : ''
                    )}
                  >
                    Quick withdrawal
                  </Typography>
                  {/* <Typography variant="small" className="text-muted-foreground">
                    Instant withdrawal
                  </Typography> */}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="text-muted-foreground">
                  Best Rate: 1:0.9950
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Waiting time: Immediately
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Withdraw Type */}
      {withdrawType === 'slow' ? (
        <SlowWithdraw
          isLoadingAssets={isLoadingAssets}
          refetchAssets={refetchAssets}
          chrAsset={chrAsset}
          stAsset={stAsset}
        />
      ) : (
        <QuickWithdraw />
      )}
    </div>
  );
};
