'use client';

import React, { useState, useMemo } from 'react';
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
import { useCompletedAssets } from '@/hooks/contracts/queries/use-completed-assets';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';

const stakeFormSchema = z.object({
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

type StakeFormValues = z.infer<typeof stakeFormSchema>;

export const StakeSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);

  // Fetch all assets to get CHR data
  const {
    assets: processedAssets,
    isLoading: isLoadingAssets,
    refresh: refetchAssets,
  } = useCompletedAssets();

  // Find CHR asset from the assets list
  const chrAsset = useMemo(() => {
    return processedAssets.find(asset => asset.symbol === 'CHR' || asset.symbol === 'tCHR');
  }, [processedAssets]);

  // Use the asset price hook for real-time price updates
  const {
    data: currentPrice,
    isLoading: isPriceFetching,
    refetch: fetchPrice,
  } = useAssetPrice(chrAsset?.assetId || '', isRefetchEnabled && !!chrAsset);

  // Constants - TODO: Replace with real data from hooks
  const exchangeRate = 1.0; // 1 CHR = 1 stCHR
  const stakingAPY = 12.5; // Staking APY percentage
  const stakingFee = 0.3; // Fee percentage

  // Get real data or fallback to defaults
  const chrPrice = currentPrice || chrAsset?.price || 0.75;
  const maxBalance = chrAsset?.balance || 0;
  const isLoading = isLoadingAssets || isPriceFetching;

  const form = useForm<StakeFormValues>({
    resolver: zodResolver(stakeFormSchema),
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
  const feeAmount = inputAmount * (stakingFee / 100);
  const netAmount = inputAmount - feeAmount;
  const stCHRReceived = netAmount * exchangeRate;

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
                    <AvatarImage src={chrAsset?.iconUrl || '/images/tokens/chr.png'} alt="CHR" />
                    <AvatarFallback>CHR</AvatarFallback>
                  </Avatar>
                  <Typography weight="medium" className="text-lg">
                    {chrAsset?.symbol || 'CHR'}
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
                    <AvatarImage src={chrAsset?.iconUrl || '/images/tokens/chr.png'} alt="stCHR" />
                    <AvatarFallback>stCHR</AvatarFallback>
                  </Avatar>
                  <Typography weight="medium" className="text-lg">
                    st{chrAsset?.symbol || 'CHR'}
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
                <Typography>1 CHR = 1 stCHR</Typography>
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
                    <p>Annual Percentage Yield for staking CHR tokens</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <CountUp value={stakingAPY} suffix="%" className="font-medium" decimals={1} />
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                Exchange rate
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>1 CHR = 1 stCHR</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <CountUp
                className="font-medium text-base"
                value={exchangeRate}
                suffix=" stCHR"
                prefix="1 CHR = "
                decimals={0}
              />
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                Fee staking
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Staking fee: {stakingFee}% of staked amount</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <div className="flex items-center gap-2">
                <CountUp className="font-medium" value={stakingFee} suffix="%" decimals={1} />
                <CountUp
                  className="font-medium"
                  value={feeAmount}
                  suffix=" CHR"
                  prefix="~ "
                  decimals={4}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Typography className="flex items-center gap-1">
                You will receive
                <Tooltip delayDuration={100}>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Amount of stCHR tokens you will receive after fees</p>
                  </TooltipContent>
                </Tooltip>
              </Typography>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={chrAsset?.iconUrl || '/images/tokens/chr.png'} alt="stCHR" />
                  <AvatarFallback>stCHR</AvatarFallback>
                </Avatar>
                <CountUp
                  value={stCHRReceived}
                  suffix=" stCHR"
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
            ) : !form.watch('amount') || parseFloat(form.watch('amount')) === 0 ? (
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
                Stake {chrAsset?.symbol || 'CHR'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
