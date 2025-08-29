'use client';

import React, { useState } from 'react';
import { CircleX, Info, ArrowDown } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Input } from '@/components/common/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';
import CountUp from '@/components/common/count-up';
import { Skeleton } from '@/components/common/skeleton';
import { useStaking } from '@/hooks/contracts/operations/use-staking';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
import { useGetStakingUser } from '@/hooks/contracts/queries/use-get-staking-user';
import { UserReserveData } from '../../dashboard/types';

interface StakeSectionProps {
  chrAsset: UserReserveData | undefined;
  stAsset: UserReserveData | undefined;
  refetchAssets: () => void;
  isLoadingAssets: boolean;
}

function makeStakeFormSchema(creationFee: number) {
  return z.object({
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
      )
      .refine(
        val => {
          const num = Number(val);
          return num > creationFee;
        },
        {
          message: `Amount must be greater than the creation fee`,
        }
      ),
  });
}

type StakeFormValues = {
  amount: string;
};

export const StakeSection: React.FC<StakeSectionProps> = ({
  chrAsset,
  stAsset,
  refetchAssets,
  isLoadingAssets,
}: StakeSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);

  // Constants - TODO: Replace with real data from hooks
  const stakingAPY = 3; // Staking APY percentage
  const stakingFeePercent = 0.3; // Fee percentage

  // Query if user has staked before
  const { data: isFirstTimeStaking, isLoading: isLoadingStakingUser } = useGetStakingUser();

  // Creating account staking fee logic
  const creationFee = isFirstTimeStaking ? 10 : 0;

  // Use the asset price hook for real-time price updates
  const {
    data: currentPrice,
    isLoading: isPriceFetching,
    refetch: fetchPrice,
  } = useAssetPrice(chrAsset?.assetId || '', isRefetchEnabled && !!chrAsset);

  // Get real data or fallback to defaults
  const chrPrice = currentPrice || 0;
  const maxBalance = chrAsset?.balance || 0;
  const isLoading = isLoadingAssets || isPriceFetching || isLoadingStakingUser;

  const form = useForm<StakeFormValues>({
    resolver: zodResolver(makeStakeFormSchema(creationFee)),
    defaultValues: {
      amount: '',
    },
  });

  const staking = useStaking({
    onSuccess: (result, params) => {
      console.log('Staking success:', { result, params });
      toast.success(`Successfully staked ${params.amount} CHR`);
      form.reset();
      refetchAssets(); // Refresh assets after successful staking
    },
    onError: (error, params) => {
      console.error('Staking error:', { error, params });
      toast.error(`Failed to stake: ${error.message}`);
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^$|^[0-9]+\.?[0-9]*$/;
    if (!regex.test(value)) {
      form.setValue('amount', '0');
      return;
    }

    // Don't allow value > maxBalance (similar to supply-dialog.tsx)
    const valueWithBalance = Number(value) > Number(maxBalance) ? maxBalance : value;
    const needToChangeValue = valueWithBalance !== value;

    if (needToChangeValue) {
      form.setValue('amount', valueWithBalance.toString());
    } else {
      form.setValue('amount', value);
    }

    // Trigger price refetch if there's an amount and we have asset
    if (valueWithBalance && parseFloat(valueWithBalance.toString()) > 0 && chrAsset) {
      setIsRefetchEnabled(true);
      fetchPrice();
    }
  };

  const handleMaxAmount = () => {
    form.setValue('amount', maxBalance.toString());
    if (chrAsset) {
      setIsRefetchEnabled(true);
      fetchPrice();
    }
  };

  const onSubmit = async (data: StakeFormValues) => {
    try {
      const amount = Number(data.amount);

      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid positive number');
        return;
      }

      if (amount > maxBalance) {
        toast.error(`Amount exceeds your available balance of ${maxBalance} CHR`);
        return;
      }

      if (!chrAsset) {
        toast.error('CHR asset not found');
        return;
      }

      setIsSubmitting(true);

      await staking({
        assetId: chrAsset.assetId,
        amount: data.amount,
        decimals: chrAsset.decimals,
      });
    } catch (error) {
      console.error('Error submitting stake:', error);
      toast.error('Failed to submit stake transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputAmount = Number(form.watch('amount')) || 0;
  // Calculate staking fee based on new formula
  const stakingBase = Math.max(inputAmount - creationFee, 0);
  const stakingFee = stakingBase * (stakingFeePercent / 100);
  const stCHRReceived = Math.max(inputAmount - creationFee - stakingFee, 0);

  // Show loading state if no CHR asset data yet
  if (isLoadingAssets && !chrAsset) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="flex justify-center">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Show error if CHR asset not found
  if (!isLoadingAssets && !chrAsset) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Typography variant="h3" className="text-destructive mb-4">
            CHR Asset Not Found
          </Typography>
          <Typography className="text-muted-foreground mb-4">
            Unable to load CHR asset data. Please try refreshing the page.
          </Typography>
          <Button onClick={refetchAssets} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staking Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="space-y-6">
          {/* Amount Input - CHR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Typography className="flex items-center gap-1">Amount</Typography>
            </div>

            <div className="px-4 py-3 rounded-xl bg-card border border-border">
              <div className="relative">
                <Input
                  {...form.register('amount')}
                  autoComplete="off"
                  placeholder="0.00"
                  className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-transparent focus-visible:outline-none focus-visible:ring-0 w-[70%] bg-transparent border-none"
                  inputMode="decimal"
                  pattern="[0-9]*[.]?[0-9]*"
                  min={0.0}
                  step="any"
                  onChange={handleAmountChange}
                  disabled={isLoading}
                />
                <div className="flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
                  {form.watch('amount') && (
                    <Button
                      variant="none"
                      size="icon"
                      onClick={() => form.setValue('amount', '')}
                      className="hover:opacity-70"
                    >
                      <CircleX className="h-5 w-5 text-submerged" />
                    </Button>
                  )}
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={chrAsset?.iconUrl} alt={chrAsset?.symbol} />
                    <AvatarFallback>{chrAsset?.symbol}</AvatarFallback>
                  </Avatar>
                  <Typography weight="medium" className="text-lg">
                    {chrAsset?.symbol}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between items-center text-base mt-2">
                {inputAmount > 0 ? (
                  isPriceFetching ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <CountUp value={inputAmount * chrPrice} prefix="$" decimals={2} />
                  )
                ) : (
                  <Typography>$0.00</Typography>
                )}
                <div
                  className="flex items-center gap-1 text-primary cursor-pointer hover:text-primary/80"
                  onClick={handleMaxAmount}
                >
                  <Typography>Balance: </Typography>
                  {isLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <CountUp value={maxBalance} decimals={2} />
                  )}
                  <Typography className="font-bold text-primary">MAX</Typography>
                </div>
              </div>
            </div>

            {form.formState.errors.amount && (
              <Typography className="text-destructive text-sm">
                {form.formState.errors.amount.message}
              </Typography>
            )}
          </div>

          {/* Conversion Arrow */}
          <div className="flex items-center justify-center">
            <div className="p-2 rounded-full bg-card border border-border">
              <ArrowDown className="h-5 w-5" />
            </div>
          </div>

          {/* Output Display - stCHR */}
          <div className="space-y-2">
            <div className="px-4 py-4 rounded-xl bg-card border border-border">
              <div className="relative">
                <div className="p-0 w-[70%]">
                  {stCHRReceived > 0 ? (
                    <CountUp className="text-xl font-medium" value={stCHRReceived} decimals={4} />
                  ) : (
                    '0.00'
                  )}
                </div>
                <div className="flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={stAsset?.iconUrl} alt={stAsset?.symbol} />
                    <AvatarFallback>{stAsset?.symbol}</AvatarFallback>
                  </Avatar>
                  <Typography weight="medium" className="text-lg">
                    {stAsset?.symbol}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-between items-center text-base mt-2">
                {stCHRReceived > 0 ? (
                  isPriceFetching ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <CountUp value={stCHRReceived * chrPrice} prefix="$" decimals={2} />
                  )
                ) : (
                  <Typography>$0.00</Typography>
                )}
                <Typography>- 0.3% fee staking</Typography>
              </div>
            </div>
          </div>

          {/* Transaction Overview */}
          <div className="space-y-4 mt-6">
            <Typography weight="semibold" className="text-lg">
              Transaction overview
            </Typography>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                Staking APY
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Annual Percentage Yield for staking {chrAsset?.symbol} tokens</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <CountUp
                value={stakingAPY}
                suffix="% + Shared Rewards"
                className="font-medium"
                decimals={1}
              />
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                Creating account staking fee
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>
                      When you stake for the first time, a fee of 10 {chrAsset?.symbol} will be
                      charged to create your staking account. If you have already staked, this fee
                      is 0.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <CountUp
                className="font-medium text-base"
                value={creationFee}
                prefix="- "
                suffix=" CHR"
                decimals={0}
              />
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                Staking fee
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Staking fee: {stakingFeePercent}% of (amount - creation_fee)</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <div className="flex items-center gap-2">
                <CountUp
                  className="font-medium"
                  value={stakingFee}
                  suffix={` CHR (${stakingFeePercent}%)`}
                  prefix="-"
                  decimals={4}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                You will stake
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Amount of {chrAsset?.symbol} tokens you will stake</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={chrAsset?.iconUrl} alt={chrAsset?.symbol} />
                  <AvatarFallback>{chrAsset?.symbol}</AvatarFallback>
                </Avatar>
                <CountUp
                  value={stCHRReceived}
                  suffix={` ${chrAsset?.symbol}`}
                  decimals={4}
                  className="font-medium"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                You will reveive
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Amount of {stAsset?.symbol} tokens you will receive after staking</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={stAsset?.iconUrl} alt={stAsset?.symbol} />
                  <AvatarFallback>{stAsset?.symbol}</AvatarFallback>
                </Avatar>
                <CountUp
                  value={stCHRReceived}
                  suffix={` ${stAsset?.symbol}`}
                  decimals={4}
                  className="font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            {isSubmitting ? (
              <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
                Processing...
              </Button>
            ) : !form.watch('amount') ||
              parseFloat(form.watch('amount')) === 0 ||
              parseFloat(form.watch('amount')) <= creationFee ? (
              <Button disabled className="w-full text-lg py-6 bg-primary">
                Enter an amount
              </Button>
            ) : (
              <Button
                variant="gradient"
                type="submit"
                className="w-full text-lg py-6"
                disabled={!form.watch('amount') || isLoading}
              >
                Stake {chrAsset?.symbol}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
