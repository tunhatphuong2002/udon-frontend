'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { Typography } from '@/components/common/typography';
import { CheckCircle, Loader2, XCircle, Hourglass } from 'lucide-react';
import { useStakingPositions } from '@/hooks/contracts/queries/use-staking-positions';
import { StakingStatus } from '../../dashboard/types';

const getStepIcon = (status: 'completed' | 'current' | 'error' | 'pending') => {
  const size = 20;
  const whiteColor = 'white';
  switch (status) {
    case 'completed':
      return <CheckCircle size={size} color={whiteColor} />;
    case 'current':
      return <Loader2 size={size} color={whiteColor} className="animate-spin" />;
    case 'error':
      return <XCircle size={size} color={whiteColor} />;
    case 'pending':
    default:
      return <Hourglass size={size} color={whiteColor} />;
  }
};

const STAKING_STEPS = [
  {
    key: 'received',
    label: 'Received',
    description: 'Waiting for you to sign the transaction',
  },
  {
    key: 'staked',
    label: 'Completed Staking',
    description: 'Transaction is confirmed on EC',
  },
];

type StepKey = 'received' | 'staked' | 'completed' | 'error';

export interface StakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  chrAsset: { assetId: Buffer; decimals: number } | undefined;
  staking: (args: { assetId: Buffer; amount: number; decimals: number }) => Promise<void>;
}

export const StakingDialog: React.FC<StakingDialogProps> = ({
  open,
  onOpenChange,
  amount,
  chrAsset,
  staking,
}) => {
  const [stepStatus, setStepStatus] = useState<StepKey>('received');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeStaking, setTimeStaking] = useState<number>(0);
  const didStartStaking = React.useRef(false);

  const { data: stakedPositions } = useStakingPositions(
    chrAsset!.assetId,
    chrAsset!.decimals,
    StakingStatus.STAKED,
    timeStaking,
    open && stepStatus === 'staked' && !!timeStaking
  );

  useEffect(() => {
    if (!open) {
      didStartStaking.current = false;
      setStepStatus('received');
      setErrorMessage(null);
      return;
    }

    if (open && stepStatus === 'received' && !didStartStaking.current) {
      didStartStaking.current = true;

      const doStaking = async () => {
        if (!chrAsset) {
          setErrorMessage('CHR asset not found');
          setStepStatus('error');
          return;
        }
        try {
          setTimeStaking(Date.now());
          await staking({ assetId: chrAsset.assetId, amount, decimals: chrAsset.decimals });
          setStepStatus('staked');
        } catch {
          onOpenChange(false);
          setErrorMessage('Failed to submit stake transaction');
          setStepStatus('error');
        }
      };

      doStaking();
    }
  }, [open, stepStatus, amount, chrAsset, staking, onOpenChange]);

  useEffect(() => {
    const check = async () => {
      if (stepStatus === 'staked' && stakedPositions && stakedPositions.length > 0) {
        console.log('at staked staked');
        setStepStatus('completed');
        // close dialog after 3 seconds
        setTimeout(() => {
          onOpenChange(false);
        }, 3000);
      }
    };

    check();
  }, [stepStatus, stakedPositions, onOpenChange]);

  const getStepRenderStatus = (
    stepKey: StepKey,
    index: number
  ): 'completed' | 'current' | 'error' | 'pending' => {
    if (stepStatus === 'error' && stepKey === 'received') return 'error';
    if (stepKey === stepStatus) return 'current';
    const stepIndex = ['received', 'staked', 'completed'].findIndex(s => s === stepStatus);
    if (index < stepIndex) return 'completed';
    if (index > stepIndex) return 'pending';
    return 'pending';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Prevent user click outside
        onInteractOutside={e => e.preventDefault()}
        // Prevent user press ESC to close
        onEscapeKeyDown={e => e.preventDefault()}
        // Prevent close button custom
        showCloseButton={false}
        className="sm:max-w-[425px] rounded-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Staking Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {STAKING_STEPS.map((step, index) => {
            const status = getStepRenderStatus(step.key as StepKey, index);
            return (
              <div key={step.key} className="relative">
                {index < STAKING_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[29px] top-[45px] w-0.5 h-[calc(80%)] ${
                      status === 'completed' ? 'bg-primary' : 'bg-border/30'
                    }`}
                  />
                )}
                <div
                  className={`relative overflow-hidden rounded-lg transition-all z-10 bg-card ${
                    status === 'completed' ? 'border-transparent' : ''
                  } ${
                    status === 'current'
                      ? 'border border-orange-500/30 shadow-sm'
                      : status === 'error'
                        ? 'border border-destructive/30'
                        : 'border border-muted/20'
                  }`}
                >
                  {status === 'completed' && (
                    <>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-[1px] bg-gradient-to-r from-primary via-[#36B1FF] to-[#E4F5FF]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[1px] z-10 rounded-[inherit] bg-card"
                      />
                    </>
                  )}
                  <div className="flex items-start gap-4 p-4 relative z-20">
                    <div
                      className={`flex-shrink-0 mt-0.5 rounded-full p-2 ${
                        status === 'completed'
                          ? 'bg-gradient-to-r from-primary via-[#36B1FF] to-[#E4F5FF]'
                          : status === 'current'
                            ? 'bg-orange-500'
                            : status === 'error'
                              ? 'bg-destructive'
                              : 'bg-muted'
                      }`}
                    >
                      {getStepIcon(status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Typography weight="semibold" className="text-embossed">
                          <Typography weight="semibold" className="text-embossed">
                            {step.label}{' '}
                            {step.key === 'received' && stepStatus === 'received' && amount
                              ? ` ${amount} stCHR`
                              : ''}
                          </Typography>
                        </Typography>
                        <div
                          className={`text-xs h-5 px-2 rounded-full flex items-center font-medium ${
                            status === 'completed'
                              ? 'bg-gradient-to-r from-primary via-[#36B1FF] to-[#E4F5FF] text-black'
                              : status === 'current'
                                ? 'border border-orange-500/30 text-orange-500 bg-orange-500/10'
                                : status === 'error'
                                  ? 'border border-destructive/30 text-destructive bg-destructive/10'
                                  : 'border border-muted/30 text-muted-foreground bg-muted/10'
                          }`}
                        >
                          {status === 'completed'
                            ? 'Complete'
                            : status === 'current'
                              ? errorMessage
                                ? 'Failed'
                                : `Step ${index + 1}`
                              : status === 'error'
                                ? 'Failed'
                                : `Step ${index + 1}`}
                        </div>
                      </div>
                      <Typography variant="small" className="text-submerged">
                        {status === 'error' && errorMessage ? errorMessage : step.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
