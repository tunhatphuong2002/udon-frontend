'use client';

import React, { useState } from 'react';
import { Clock, Zap, ArrowLeftRight } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { Typography } from '@/components/common/typography';
import { TooltipProvider } from '@/components/common/tooltip';
import { UserAccountData, UserReserveData } from '../../types';
import { cn } from '@/utils/tailwind';

// Import the new form components
import { ChrWithdrawForm, StchrWithdrawForm, HybridWithdrawForm } from './forms';

export interface LsdWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserve: UserReserveData;
  accountData: UserAccountData;
  mutateAssets: () => void;
}

type WithdrawType = 'chr' | 'stchr' | 'hybrid';

export const LsdWithdrawDialog: React.FC<LsdWithdrawDialogProps> = ({
  open,
  onOpenChange,
  reserve,
  accountData,
  mutateAssets,
}) => {
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('chr');

  const handleFormSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[50vw] w-auto max-h-[90vh] overflow-y-auto rounded-xl">
        <TooltipProvider delayDuration={300}>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">
                LSD Withdraw {reserve.symbol}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Withdraw Type Selection */}
          <div className="space-y-4">
            <Typography weight="semibold" className="text-lg">
              Choose Withdraw Option
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CHR Withdraw Option */}
              <div
                className={cn(
                  'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
                  withdrawType === 'chr'
                    ? 'border-transparent shadow-lg'
                    : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
                )}
                onClick={() => setWithdrawType('chr')}
              >
                {withdrawType === 'chr' && (
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
                        withdrawType === 'chr'
                          ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                          : 'bg-muted'
                      )}
                    >
                      <Clock
                        className={cn(
                          'w-5 h-5',
                          withdrawType === 'chr' ? 'text-black' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <Typography
                        weight="semibold"
                        className={cn(
                          withdrawType === 'chr'
                            ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                            : ''
                        )}
                      >
                        CHR Only
                      </Typography>
                      <Typography className="text-muted-foreground" size="sm">
                        Slow withdraw via BSC unstaking
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography size="sm" className="text-muted-foreground">
                      • Withdraw original CHR + staking rewards
                    </Typography>
                    <Typography size="sm" className="text-muted-foreground">
                      • 14 days waiting period
                    </Typography>
                  </div>
                </div>
              </div>

              {/* stCHR Withdraw Option */}
              <div
                className={cn(
                  'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
                  withdrawType === 'stchr'
                    ? 'border-transparent shadow-lg'
                    : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
                )}
                onClick={() => setWithdrawType('stchr')}
              >
                {withdrawType === 'stchr' && (
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
                        withdrawType === 'stchr'
                          ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                          : 'bg-muted'
                      )}
                    >
                      <Zap
                        className={cn(
                          'w-5 h-5',
                          withdrawType === 'stchr' ? 'text-black' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <Typography
                        weight="semibold"
                        className={cn(
                          withdrawType === 'stchr'
                            ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                            : ''
                        )}
                      >
                        stCHR Only
                      </Typography>
                      <Typography size="sm" className="text-muted-foreground">
                        Immediate from lending pool
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography size="sm" className="text-muted-foreground">
                      • Withdraw all available stCHR
                    </Typography>
                    <Typography size="sm" className="text-muted-foreground">
                      • Instant withdrawal
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Hybrid Withdraw Option */}
              <div
                className={cn(
                  'bg-card relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border-2',
                  withdrawType === 'hybrid'
                    ? 'border-transparent shadow-lg'
                    : 'border-border hover:border-muted-foreground/30 hover:shadow-md'
                )}
                onClick={() => setWithdrawType('hybrid')}
              >
                {withdrawType === 'hybrid' && (
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
                        withdrawType === 'hybrid'
                          ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF]'
                          : 'bg-muted'
                      )}
                    >
                      <ArrowLeftRight
                        className={cn(
                          'w-5 h-5',
                          withdrawType === 'hybrid' ? 'text-black' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <Typography
                        weight="semibold"
                        className={cn(
                          withdrawType === 'hybrid'
                            ? 'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] bg-clip-text text-transparent'
                            : ''
                        )}
                      >
                        Both CHR + stCHR
                      </Typography>
                      <Typography size="sm" className="text-muted-foreground">
                        Flexible combination withdraw
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography size="sm" className="text-muted-foreground">
                      • CHR received after 14 days
                    </Typography>
                    <Typography size="sm" className="text-muted-foreground">
                      • stCHR received immediately
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          {withdrawType === 'chr' && (
            <ChrWithdrawForm
              reserve={reserve}
              accountData={accountData}
              mutateAssets={mutateAssets}
              onSuccess={handleFormSuccess}
            />
          )}

          {withdrawType === 'stchr' && (
            <StchrWithdrawForm
              reserve={reserve}
              accountData={accountData}
              mutateAssets={mutateAssets}
              onSuccess={handleFormSuccess}
            />
          )}

          {withdrawType === 'hybrid' && (
            <HybridWithdrawForm
              reserve={reserve}
              accountData={accountData}
              mutateAssets={mutateAssets}
              onSuccess={handleFormSuccess}
            />
          )}
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
