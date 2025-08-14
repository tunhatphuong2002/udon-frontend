'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle, Archive } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { cn } from '@/utils/tailwind';
import { PendingClaims } from './pending-claims';
import { ReadyClaims } from './ready-claims';
import { CompletedClaims } from './completed-claims';

type ClaimType = 'pending' | 'ready' | 'completed';

export const ClaimSection: React.FC = () => {
  const [claimType, setClaimType] = useState<ClaimType>('ready');

  return (
    <div>
      {/* Claim Type Selection */}
      <div className="space-y-2 mb-6">
        <Typography weight="semibold" className="text-lg">
          Withdrawal Status
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ready to Claim Option */}
          <div
            className={cn(
              'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
              claimType === 'ready'
                ? 'border-transparent shadow-lg'
                : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
            )}
            onClick={() => setClaimType('ready')}
          >
            {claimType === 'ready' && (
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
                    claimType === 'ready'
                      ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                      : 'bg-muted'
                  )}
                >
                  <CheckCircle
                    className={cn(
                      'w-5 h-5',
                      claimType === 'ready' ? 'text-black' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <Typography
                    weight="semibold"
                    className={cn(
                      claimType === 'ready'
                        ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                        : ''
                    )}
                  >
                    Ready to Claim
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="text-muted-foreground">
                  Completed withdrawals
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Available to claim
                </Typography>
              </div>
            </div>
          </div>

          {/* Pending Option */}
          <div
            className={cn(
              'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
              claimType === 'pending'
                ? 'border-transparent shadow-lg'
                : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
            )}
            onClick={() => setClaimType('pending')}
          >
            {claimType === 'pending' && (
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
                    claimType === 'pending'
                      ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                      : 'bg-muted'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-5 h-5',
                      claimType === 'pending' ? 'text-black' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <Typography
                    weight="semibold"
                    className={cn(
                      claimType === 'pending'
                        ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                        : ''
                    )}
                  >
                    Pending
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="text-muted-foreground">
                  Withdrawals in progress
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  14-day unbonding period
                </Typography>
              </div>
            </div>
          </div>

          {/* Completed Option */}
          <div
            className={cn(
              'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
              claimType === 'completed'
                ? 'border-transparent shadow-lg'
                : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
            )}
            onClick={() => setClaimType('completed')}
          >
            {claimType === 'completed' && (
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
                    claimType === 'completed'
                      ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                      : 'bg-muted'
                  )}
                >
                  <Archive
                    className={cn(
                      'w-5 h-5',
                      claimType === 'completed' ? 'text-black' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <Typography
                    weight="semibold"
                    className={cn(
                      claimType === 'completed'
                        ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                        : ''
                    )}
                  >
                    Completed
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Typography variant="small" className="text-muted-foreground">
                  Already claimed
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Transaction history
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content Based on Claim Type */}
      {claimType === 'pending' && <PendingClaims />}
      {claimType === 'ready' && <ReadyClaims />}
      {claimType === 'completed' && <CompletedClaims />}
    </div>
  );
};
