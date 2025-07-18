'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CircleX, Clock, Zap, AlertTriangle, ArrowLeftRight, Info, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Input } from '@/components/common/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Skeleton } from '@/components/common/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';
import { UserAccountData, UserReserveData } from '../../types';
import CountUp from '@/components/common/count-up';
// import { useMaxAmount } from '@/hooks/contracts/queries/use-max-amount';
import { normalize, normalizeBN, valueToBigNumber } from '@/utils/bignumber';
import { calculateHFAfterWithdraw } from '@/utils/hf';
import { cn } from '@/utils/tailwind';

// Import new hooks for 3-option system
import { useChrWithdraw } from '@/hooks/contracts/operations/use-lsd-chr-withdraw';
import { useStchrWithdraw } from '@/hooks/contracts/operations/use-lsd-stchr-withdraw';
import { useHybridWithdraw } from '@/hooks/contracts/operations/use-lsd-hybrid-withdraw';
import { useWithdrawDashboard } from '@/hooks/contracts/queries/use-lsd-withdraw-options';

// Schema for single amount (CHR or stCHR options)
const singleWithdrawFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required!')
    .refine(
      val => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Please enter a valid positive number',
      }
    ),
});

// Schema for hybrid option (both CHR and stCHR)
const hybridWithdrawFormSchema = z
  .object({
    chrAmount: z.string().refine(
      val => {
        if (!val) return true; // Allow empty
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Please enter a valid number',
      }
    ),
    stchrAmount: z.string().refine(
      val => {
        if (!val) return true; // Allow empty
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: 'Please enter a valid number',
      }
    ),
  })
  .refine(
    data => {
      const chrAmount = Number(data.chrAmount) || 0;
      const stchrAmount = Number(data.stchrAmount) || 0;
      return chrAmount > 0 || stchrAmount > 0;
    },
    {
      message: 'At least one amount must be greater than 0',
      path: ['chrAmount'], // Show error on chrAmount field
    }
  );

type SingleWithdrawFormValues = z.infer<typeof singleWithdrawFormSchema>;
type HybridWithdrawFormValues = z.infer<typeof hybridWithdrawFormSchema>;

export interface LsdWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserve: UserReserveData;
  accountData: UserAccountData;
  mutateAssets: () => void;
}

type WithdrawType = 'chr' | 'stchr' | 'hybrid';

// Create a debounced fetch function with lodash
const debouncedFn = debounce((callback: () => void) => {
  callback();
}, 1000);

export const LsdWithdrawDialog: React.FC<LsdWithdrawDialogProps> = ({
  open,
  onOpenChange,
  reserve,
  accountData,
  mutateAssets,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(reserve.price);
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);
  const [calculatedHealthFactor, setCalculatedHealthFactor] = useState<number>(-1);
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('chr');

  // Forms for different withdraw types
  const singleForm = useForm<SingleWithdrawFormValues>({
    resolver: zodResolver(singleWithdrawFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  const hybridForm = useForm<HybridWithdrawFormValues>({
    resolver: zodResolver(hybridWithdrawFormSchema),
    defaultValues: {
      chrAmount: '',
      stchrAmount: '',
    },
  });

  // Use the asset price hook with TanStack Query
  const {
    data: priceData,
    isLoading: isPriceFetching,
    refetch: fetchPrice,
  } = useAssetPrice(reserve.assetId, isRefetchEnabled);

  // Fetch withdraw dashboard data
  const { data: withdrawDashboard, isLoading: isDashboardLoading } = useWithdrawDashboard(
    reserve.assetId,
    reserve.decimals,
    open // Only fetch when dialog is open
  );

  // Use the new withdraw hooks
  const chrWithdraw = useChrWithdraw({
    onSuccess: (result, params) => {
      console.log('CHR withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('CHR withdraw error:', { error, params });
    },
  });

  const stchrWithdraw = useStchrWithdraw({
    onSuccess: (result, params) => {
      console.log('stCHR withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('stCHR withdraw error:', { error, params });
    },
  });

  const hybridWithdrawOp = useHybridWithdraw({
    onSuccess: (result, params) => {
      console.log('Hybrid withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('Hybrid withdraw error:', { error, params });
    },
  });

  // Get current max amount based on withdraw type
  const getCurrentMaxAmount = useCallback(() => {
    if (!withdrawDashboard) return 0;

    switch (withdrawType) {
      case 'chr':
        return withdrawDashboard.maxChrWithdraw;
      case 'stchr':
        return withdrawDashboard.maxStchrImmediateWithdraw;
      case 'hybrid':
        return withdrawDashboard.maxTotalValue;
      default:
        return 0;
    }
  }, [withdrawType, withdrawDashboard]);

  // Calculate health factor based on current input
  const calculateHealthFactor = useCallback(() => {
    if (accountData.healthFactor === -1) {
      setCalculatedHealthFactor(-1);
      return;
    }

    let withdrawAmount = 0;

    if (withdrawType === 'hybrid') {
      const chrAmount = Number(hybridForm.watch('chrAmount')) || 0;
      const stchrAmount = Number(hybridForm.watch('stchrAmount')) || 0;
      withdrawAmount = chrAmount + stchrAmount;
    } else {
      withdrawAmount = Number(singleForm.watch('amount')) || 0;
    }

    if (withdrawAmount <= 0) {
      setCalculatedHealthFactor(
        Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
      );
      return;
    }

    const hf = calculateHFAfterWithdraw(
      valueToBigNumber(accountData.totalCollateralBase.toString()),
      valueToBigNumber(normalize(reserve.price.toString(), 18)).multipliedBy(
        valueToBigNumber(withdrawAmount.toString())
      ),
      (Number(accountData.currentLiquidationThreshold) / 100).toString(),
      reserve.liquidationThreshold.toString(),
      valueToBigNumber(accountData.totalDebtBase.toString()),
      valueToBigNumber(accountData.healthFactor.toString()),
      reserve.usageAsCollateralEnabled
    );

    setCalculatedHealthFactor(Number(hf));
  }, [
    accountData,
    singleForm,
    hybridForm,
    withdrawType,
    reserve.liquidationThreshold,
    reserve.price,
    reserve.usageAsCollateralEnabled,
  ]);

  // Handle price fetch with lodash debounce
  const handleFetchPrice = useCallback(() => {
    debouncedFn(() => {
      setIsRefetchEnabled(true);
      fetchPrice();
      calculateHealthFactor();
    });
  }, [fetchPrice, calculateHealthFactor]);

  // Update price when data is fetched
  useEffect(() => {
    if (priceData !== null && priceData !== undefined) {
      setCurrentPrice(priceData);
      setIsRefetchEnabled(false);
    }
  }, [priceData]);

  // Initialize with asset price and calculate initial health factor
  useEffect(() => {
    setCurrentPrice(reserve.price);
    calculateHealthFactor();
  }, [reserve.price, calculateHealthFactor]);

  // Handle amount change for single forms
  const handleSingleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^$|^[0-9]+\.?[0-9]*$/;

    if (!regex.test(value)) {
      singleForm.setValue('amount', '0');
      return;
    }

    singleForm.setValue('amount', value);

    if (value && parseFloat(value) > 0) {
      handleFetchPrice();
    } else {
      setCalculatedHealthFactor(
        accountData.healthFactor === -1
          ? -1
          : Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
      );
    }
  };

  // Handle amount change for hybrid forms
  const handleHybridAmountChange = (field: 'chrAmount' | 'stchrAmount', value: string) => {
    const regex = /^$|^[0-9]+\.?[0-9]*$/;

    if (!regex.test(value)) {
      hybridForm.setValue(field, '0');
      return;
    }

    hybridForm.setValue(field, value);

    const chrAmount = field === 'chrAmount' ? value : hybridForm.watch('chrAmount');
    const stchrAmount = field === 'stchrAmount' ? value : hybridForm.watch('stchrAmount');

    if ((parseFloat(chrAmount) || 0) > 0 || (parseFloat(stchrAmount) || 0) > 0) {
      handleFetchPrice();
    } else {
      setCalculatedHealthFactor(
        accountData.healthFactor === -1
          ? -1
          : Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
      );
    }
  };

  // Handle max amount click
  const handleMaxAmount = () => {
    const maxAmount = getCurrentMaxAmount();

    if (withdrawType === 'hybrid') {
      // For hybrid, set equal amounts for both
      const halfAmount = (maxAmount / 2).toString();
      hybridForm.setValue('chrAmount', halfAmount);
      hybridForm.setValue('stchrAmount', halfAmount);
    } else {
      singleForm.setValue('amount', maxAmount.toString());
    }

    handleFetchPrice();
  };

  // Handle max amount for specific field in hybrid
  const handleHybridMaxAmount = (field: 'chrAmount' | 'stchrAmount') => {
    if (!withdrawDashboard) return;

    let maxAmount = 0;
    if (field === 'chrAmount') {
      maxAmount = withdrawDashboard.maxChrWithdraw;
    } else {
      maxAmount = withdrawDashboard.maxStchrImmediateWithdraw;
    }

    hybridForm.setValue(field, maxAmount.toString());
    handleFetchPrice();
  };

  // Submit handlers
  const onSingleSubmit = async (data: SingleWithdrawFormValues) => {
    try {
      const amount = Number(data.amount);
      const maxAmount = getCurrentMaxAmount();

      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid positive number');
        return;
      }

      if (amount > maxAmount) {
        toast.error(`Amount exceeds maximum of ${maxAmount.toFixed(6)} ${reserve.symbol}`);
        return;
      }

      setIsSubmitting(true);

      let withdrawResult;
      const params = {
        assetId: reserve.assetId,
        amount: data.amount,
        decimals: reserve.decimals,
        isUserWithdrawMax: Number(data.amount) === maxAmount,
      };

      if (withdrawType === 'chr') {
        withdrawResult = await chrWithdraw(params);
      } else {
        withdrawResult = await stchrWithdraw(params);
      }

      if (withdrawResult.success) {
        toast.success(
          `Successfully initiated ${withdrawType.toUpperCase()} withdraw of ${data.amount} ${reserve.symbol}`
        );
        onOpenChange(false);
      } else {
        toast.error(`Failed to withdraw: ${withdrawResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting withdraw:', error);
      toast.error('Failed to submit withdraw transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onHybridSubmit = async (data: HybridWithdrawFormValues) => {
    try {
      const chrAmount = Number(data.chrAmount) || 0;
      const stchrAmount = Number(data.stchrAmount) || 0;

      if (chrAmount <= 0 && stchrAmount <= 0) {
        toast.error('At least one amount must be greater than 0');
        return;
      }

      setIsSubmitting(true);

      const withdrawResult = await hybridWithdrawOp({
        assetId: reserve.assetId,
        chrAmount: chrAmount.toString(),
        stchrAmount: stchrAmount.toString(),
        decimals: reserve.decimals,
      });

      if (withdrawResult.success) {
        toast.success(
          `Successfully initiated hybrid withdraw: ${chrAmount} CHR + ${stchrAmount} stCHR`
        );
        onOpenChange(false);
      } else {
        toast.error(`Failed to withdraw: ${withdrawResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting hybrid withdraw:', error);
      toast.error('Failed to submit hybrid withdraw transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHealthFactor =
    accountData.healthFactor === -1
      ? -1
      : normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18);

  // Get current withdraw amount for transaction overview
  const getCurrentWithdrawAmount = () => {
    if (withdrawType === 'hybrid') {
      const chrAmount = Number(hybridForm.watch('chrAmount')) || 0;
      const stchrAmount = Number(hybridForm.watch('stchrAmount')) || 0;
      return chrAmount + stchrAmount;
    } else {
      return Number(singleForm.watch('amount')) || 0;
    }
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

          {/* Balance Breakdown Section */}
          {withdrawDashboard && (
            <div className="bg-muted/30 rounded-lg p-4">
              <Typography weight="semibold" className="text-lg mb-3">
                Your stCHR Balance
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <Typography className="text-muted-foreground">• Principal:</Typography>
                  <Typography weight="medium">
                    {withdrawDashboard.stakingPrincipalStchr.toFixed(4)} stCHR
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-muted-foreground">• Staking Rewards:</Typography>
                  <Typography weight="medium">
                    {withdrawDashboard.stakingRewardsStchr.toFixed(4)} stCHR
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography className="text-muted-foreground">• Lending Rewards:</Typography>
                  <Typography weight="medium">
                    {withdrawDashboard.lendingRewardsStchr.toFixed(4)} stCHR
                  </Typography>
                </div>
              </div>

              <div className="border-t border-border mt-3 pt-3">
                <div className="flex justify-between">
                  <Typography weight="semibold">Total stCHR:</Typography>
                  <Typography weight="semibold">
                    {withdrawDashboard.totalStchr.toFixed(4)} stCHR
                  </Typography>
                </div>
              </div>
            </div>
          )}

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
                      <Typography variant="small" className="text-muted-foreground">
                        Slow withdraw via BSC unstaking
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography variant="small" className="text-muted-foreground">
                      • Withdraw original CHR + staking rewards
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground">
                      • 14 days waiting period
                    </Typography>
                    {withdrawDashboard && (
                      <Typography variant="small" className="text-primary font-medium">
                        Max: {withdrawDashboard.maxChrWithdraw.toFixed(4)} CHR
                      </Typography>
                    )}
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
                      <Typography variant="small" className="text-muted-foreground">
                        Immediate from lending pool
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography variant="small" className="text-muted-foreground">
                      • Withdraw all available stCHR
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground">
                      • Instant withdrawal
                    </Typography>
                    {withdrawDashboard && (
                      <Typography variant="small" className="text-primary font-medium">
                        Max: {withdrawDashboard.maxStchrImmediateWithdraw.toFixed(4)} stCHR
                      </Typography>
                    )}
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
                      <Typography variant="small" className="text-muted-foreground">
                        Flexible combination withdraw
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Typography variant="small" className="text-muted-foreground">
                      • CHR received after 14 days
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground">
                      • stCHR received immediately
                    </Typography>
                    {withdrawDashboard && (
                      <Typography variant="small" className="text-primary font-medium">
                        Max Total: {withdrawDashboard.maxTotalValue.toFixed(4)}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          {withdrawType === 'hybrid' ? (
            // Hybrid form with two inputs (similar style to single inputs)
            <form onSubmit={hybridForm.handleSubmit(onHybridSubmit)} autoComplete="off">
              <div className="space-y-6 py-4">
                {/* CHR Amount Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography className="flex items-center gap-1">
                      CHR Amount <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">(14 days)</span>
                    </Typography>
                  </div>

                  <div className="border px-3 py-2 rounded-lg">
                    <div className="relative">
                      <Input
                        {...hybridForm.register('chrAmount')}
                        autoComplete="off"
                        placeholder="0.00"
                        className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        min={0.0}
                        step="any"
                        onChange={e => handleHybridAmountChange('chrAmount', e.target.value)}
                      />
                      <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                        {hybridForm.watch('chrAmount') && (
                          <Button
                            variant="none"
                            size="icon"
                            onClick={() => {
                              hybridForm.setValue('chrAmount', '');
                              handleFetchPrice();
                            }}
                            className="hover:opacity-70"
                          >
                            <CircleX className="h-6 w-6 text-embossed" />
                          </Button>
                        )}
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={reserve.iconUrl} alt="CHR" />
                          <AvatarFallback>CHR</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row items-center gap-1">
                          <span className="font-medium text-lg">CHR</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-base">
                      {isPriceFetching ? (
                        <Skeleton className="h-5 w-20" />
                      ) : (
                        <CountUp
                          value={(currentPrice || 0) * Number(hybridForm.watch('chrAmount'))}
                          prefix="$"
                          className="text-base"
                        />
                      )}
                      <div
                        className="flex flex-row items-center gap-1 text-primary cursor-pointer"
                        onClick={() => handleHybridMaxAmount('chrAmount')}
                      >
                        <div className="flex flex-row items-center gap-1 cursor-pointer">
                          <Typography>Available: </Typography>
                          {isDashboardLoading ? (
                            <Skeleton className="h-5 w-20" />
                          ) : (
                            <Typography className="font-bold">
                              {withdrawDashboard?.maxChrWithdraw.toFixed(6) || '0'}
                            </Typography>
                          )}
                          <Typography className="font-bold text-primary">MAX</Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hybridForm.formState.errors.chrAmount && (
                    <Typography className="text-destructive">
                      {hybridForm.formState.errors.chrAmount.message}
                    </Typography>
                  )}
                </div>

                {/* stCHR Amount Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography className="flex items-center gap-1">
                      stCHR Amount <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">(Immediate)</span>
                    </Typography>
                  </div>

                  <div className="border px-3 py-2 rounded-lg">
                    <div className="relative">
                      <Input
                        {...hybridForm.register('stchrAmount')}
                        autoComplete="off"
                        placeholder="0.00"
                        className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        min={0.0}
                        step="any"
                        onChange={e => handleHybridAmountChange('stchrAmount', e.target.value)}
                      />
                      <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                        {hybridForm.watch('stchrAmount') && (
                          <Button
                            variant="none"
                            size="icon"
                            onClick={() => {
                              hybridForm.setValue('stchrAmount', '');
                              handleFetchPrice();
                            }}
                            className="hover:opacity-70"
                          >
                            <CircleX className="h-6 w-6 text-embossed" />
                          </Button>
                        )}
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={reserve.iconUrl} alt="stCHR" />
                          <AvatarFallback>stCHR</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row items-center gap-1">
                          <span className="font-medium text-lg">stCHR</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-base">
                      {isPriceFetching ? (
                        <Skeleton className="h-5 w-20" />
                      ) : (
                        <CountUp
                          value={(currentPrice || 0) * Number(hybridForm.watch('stchrAmount'))}
                          prefix="$"
                          className="text-base"
                        />
                      )}
                      <div
                        className="flex flex-row items-center gap-1 text-primary cursor-pointer"
                        onClick={() => handleHybridMaxAmount('stchrAmount')}
                      >
                        <div className="flex flex-row items-center gap-1 cursor-pointer">
                          <Typography>Available: </Typography>
                          {isDashboardLoading ? (
                            <Skeleton className="h-5 w-20" />
                          ) : (
                            <Typography className="font-bold">
                              {withdrawDashboard?.maxStchrImmediateWithdraw.toFixed(6) || '0'}
                            </Typography>
                          )}
                          <Typography className="font-bold text-primary">MAX</Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hybridForm.formState.errors.stchrAmount && (
                    <Typography className="text-destructive">
                      {hybridForm.formState.errors.stchrAmount.message}
                    </Typography>
                  )}
                </div>

                {/* Important Notice for Hybrid */}
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Notice</AlertTitle>
                  <AlertDescription>
                    Hybrid withdraw combines both options: stCHR is immediate, CHR requires 14-day
                    wait. Cross-constraints apply between the two amounts.
                  </AlertDescription>
                </Alert>

                {/* Transaction Overview for Hybrid */}
                <div className="space-y-4">
                  <Typography weight="semibold" className="text-lg">
                    Transaction overview
                  </Typography>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">
                      CHR amount (14 days)
                    </Typography>
                    <Typography weight="medium">
                      <CountUp
                        value={Number(hybridForm.watch('chrAmount')) || 0}
                        suffix=" CHR"
                        decimals={6}
                      />
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">
                      stCHR amount (immediate)
                    </Typography>
                    <Typography weight="medium">
                      <CountUp
                        value={Number(hybridForm.watch('stchrAmount')) || 0}
                        suffix=" stCHR"
                        decimals={6}
                      />
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">
                      Health factor
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger type="button">
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Liquidation occurs when health factor is below 1.0</p>
                        </TooltipContent>
                      </Tooltip>
                    </Typography>

                    <div className="flex flex-row items-center justify-center gap-1">
                      {Number(currentHealthFactor) === -1 ? (
                        <Typography className="text-green-500 text-3xl text-bold">∞</Typography>
                      ) : (
                        <CountUp
                          value={Number(currentHealthFactor)}
                          decimals={2}
                          className={
                            Number(currentHealthFactor) === -1
                              ? 'text-green-500'
                              : Number(currentHealthFactor) <= 1.25
                                ? 'text-red-500'
                                : Number(currentHealthFactor) <= 1.5
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                          }
                        />
                      )}

                      <ArrowRight className="h-4 w-4 mb-1 text-muted-foreground" />

                      {getCurrentWithdrawAmount() === 0 ? (
                        <Typography className="text-muted-foreground font-medium">_</Typography>
                      ) : calculatedHealthFactor === -1 ? (
                        <Typography className="!text-green-500 text-3xl text-bold">∞</Typography>
                      ) : (
                        <CountUp
                          value={calculatedHealthFactor}
                          decimals={2}
                          className={
                            calculatedHealthFactor === -1
                              ? 'text-green-500'
                              : calculatedHealthFactor <= 1.25
                                ? 'text-red-500'
                                : calculatedHealthFactor <= 1.5
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">
                      Total withdraw value
                    </Typography>
                    <div className="font-medium text-base flex flex-row items-center gap-1">
                      <CountUp value={getCurrentWithdrawAmount()} suffix=" tokens" decimals={6} />~{' '}
                      {isPriceFetching ? (
                        <Skeleton className="inline-block h-5 w-20" />
                      ) : (
                        <CountUp
                          value={(currentPrice || 0) * getCurrentWithdrawAmount()}
                          prefix="$"
                          className="text-base"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button for hybrid */}
              <div className="mt-4">
                {isSubmitting ? (
                  <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
                    Processing...
                  </Button>
                ) : !hybridForm.watch('chrAmount') && !hybridForm.watch('stchrAmount') ? (
                  <Button disabled className="w-full text-lg py-6">
                    Enter amounts
                  </Button>
                ) : (
                  <Button variant="gradient" type="submit" className="w-full text-lg py-6">
                    Withdraw Both CHR + stCHR
                  </Button>
                )}
              </div>
            </form>
          ) : (
            // Single amount form for CHR or stCHR
            <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} autoComplete="off">
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography className="flex items-center gap-1">
                      Amount ({withdrawType === 'chr' ? 'CHR' : 'stCHR'})
                    </Typography>
                  </div>

                  <div className="border px-3 py-2 rounded-lg">
                    <div className="relative">
                      <Input
                        {...singleForm.register('amount')}
                        autoComplete="off"
                        placeholder="0.00"
                        className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]"
                        inputMode="decimal"
                        pattern="[0-9]*[.]?[0-9]*"
                        min={0.0}
                        max={getCurrentMaxAmount()}
                        step="any"
                        onChange={handleSingleAmountChange}
                      />
                      <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                        {singleForm.watch('amount') && (
                          <Button
                            variant="none"
                            size="icon"
                            onClick={() => {
                              singleForm.setValue('amount', '');
                              setCalculatedHealthFactor(
                                accountData.healthFactor === -1
                                  ? -1
                                  : Number(
                                      normalizeBN(
                                        valueToBigNumber(accountData.healthFactor.toString()),
                                        18
                                      )
                                    )
                              );
                            }}
                            className="hover:opacity-70"
                          >
                            <CircleX className="h-6 w-6 text-embossed" />
                          </Button>
                        )}
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={reserve.iconUrl} alt={reserve.symbol} />
                          <AvatarFallback>{reserve.symbol.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-row items-center gap-1">
                          <span className="font-medium text-lg">
                            {withdrawType === 'chr' ? 'CHR' : 'stCHR'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-base">
                      {isPriceFetching ? (
                        <Skeleton className="h-5 w-20" />
                      ) : (
                        <CountUp
                          value={(currentPrice || 0) * Number(singleForm.watch('amount'))}
                          prefix="$"
                          className="text-base"
                        />
                      )}
                      <div
                        className="flex flex-row items-center gap-1 text-primary cursor-pointer"
                        onClick={handleMaxAmount}
                      >
                        <div className="flex flex-row items-center gap-1 cursor-pointer">
                          <Typography>Available: </Typography>
                          {isDashboardLoading ? (
                            <Skeleton className="h-5 w-20" />
                          ) : (
                            <Typography className="font-bold">
                              {getCurrentMaxAmount().toFixed(6)}
                            </Typography>
                          )}
                          <Typography className="font-bold text-primary">MAX</Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {singleForm.formState.errors.amount && (
                    <Typography className="text-destructive">
                      {singleForm.formState.errors.amount.message}
                    </Typography>
                  )}
                </div>

                {/* Important Notice for Single */}
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Notice</AlertTitle>
                  <AlertDescription>
                    {withdrawType === 'chr' ? (
                      <>
                        CHR withdraw requires a 14-day unbonding period from BSC staking. Your funds
                        will be locked during this time but you&apos;ll receive full staking
                        rewards.
                      </>
                    ) : (
                      <>
                        stCHR withdraw is immediate from the lending pool. Amount may be limited by
                        your collateral position.
                      </>
                    )}
                  </AlertDescription>
                </Alert>

                {/* Transaction Overview for Single */}
                <div className="space-y-4">
                  <Typography weight="semibold" className="text-lg">
                    Transaction overview
                  </Typography>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">Remaining supply</Typography>
                    <Typography weight="medium">
                      <CountUp
                        value={getCurrentMaxAmount() - Number(singleForm.watch('amount'))}
                        suffix={` ${withdrawType === 'chr' ? 'CHR' : 'stCHR'}`}
                        decimals={6}
                      />
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">Withdraw method</Typography>
                    <Typography weight="medium" className="capitalize">
                      {withdrawType === 'chr' ? 'CHR (14 days)' : 'stCHR (immediate)'}
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">
                      Health factor
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger type="button">
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Liquidation occurs when health factor is below 1.0</p>
                        </TooltipContent>
                      </Tooltip>
                    </Typography>

                    <div className="flex flex-row items-center justify-center gap-1">
                      {Number(currentHealthFactor) === -1 ? (
                        <Typography className="text-green-500 text-3xl text-bold">∞</Typography>
                      ) : (
                        <CountUp
                          value={Number(currentHealthFactor)}
                          decimals={2}
                          className={
                            Number(currentHealthFactor) === -1
                              ? 'text-green-500'
                              : Number(currentHealthFactor) <= 1.25
                                ? 'text-red-500'
                                : Number(currentHealthFactor) <= 1.5
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                          }
                        />
                      )}

                      <ArrowRight className="h-4 w-4 mb-1 text-muted-foreground" />

                      {!singleForm.watch('amount') || Number(singleForm.watch('amount')) === 0 ? (
                        <Typography className="text-muted-foreground font-medium">_</Typography>
                      ) : calculatedHealthFactor === -1 ? (
                        <Typography className="!text-green-500 text-3xl text-bold">∞</Typography>
                      ) : (
                        <CountUp
                          value={calculatedHealthFactor}
                          decimals={2}
                          className={
                            calculatedHealthFactor === -1
                              ? 'text-green-500'
                              : calculatedHealthFactor <= 1.25
                                ? 'text-red-500'
                                : calculatedHealthFactor <= 1.5
                                  ? 'text-amber-500'
                                  : 'text-green-500'
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography className="flex items-center gap-1">Withdraw amount</Typography>
                    <div className="font-medium text-base flex flex-row items-center gap-1">
                      <CountUp
                        value={Number(singleForm.watch('amount'))}
                        suffix={` ${withdrawType === 'chr' ? 'CHR' : 'stCHR'}`}
                        decimals={6}
                      />
                      ~{' '}
                      {isPriceFetching ? (
                        <Skeleton className="inline-block h-5 w-20" />
                      ) : (
                        <CountUp
                          value={(currentPrice || 0) * Number(singleForm.watch('amount'))}
                          prefix="$"
                          className="text-base"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button for single */}
              <div className="mt-4">
                {isSubmitting ? (
                  <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
                    Processing...
                  </Button>
                ) : !singleForm.watch('amount') || parseFloat(singleForm.watch('amount')) === 0 ? (
                  <Button disabled className="w-full text-lg py-6">
                    Enter an amount
                  </Button>
                ) : (
                  <Button variant="gradient" type="submit" className="w-full text-lg py-6">
                    Withdraw {withdrawType === 'chr' ? 'CHR' : 'stCHR'}
                  </Button>
                )}
              </div>
            </form>
          )}
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
