'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Input } from '@/components/common/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import CountUp from '@/components/common/count-up';
import { Skeleton } from '@/components/common/skeleton';
import { useUnstaking } from '@/hooks/contracts/operations/use-untaking';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
import { useMaxUnstakedStAssetAmount } from '@/hooks/contracts/queries/use-max-unstake';
import { UserReserveData } from '../../dashboard/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';

interface SlowWithdrawSectionProps {
  chrAsset: UserReserveData | undefined;
  stAsset: UserReserveData | undefined;
  refetchAssets: () => void;
  isLoadingAssets: boolean;
}

const withdrawFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required!'), // No need refine, input is readonly with default
});

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

export const SlowWithdraw: React.FC<SlowWithdrawSectionProps> = ({
  chrAsset,
  stAsset,
  refetchAssets,
  isLoadingAssets,
}: SlowWithdrawSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);

  // Fetch max CHR amount that can be withdrawn
  const {
    data: maxChrAmount,
    isLoading: isLoadingMaxChrAmount,
    refetch: refetchMaxUnstakedAmount,
  } = useMaxUnstakedStAssetAmount(
    chrAsset?.assetId || Buffer.from(''),
    chrAsset?.decimals || 6,
    !!chrAsset && !!chrAsset.assetId
  );

  // Use the asset price hook for real-time price updates
  const { data: currentPrice, isLoading: isPriceFetching } = useAssetPrice(
    chrAsset?.assetId || Buffer.from(''),
    isRefetchEnabled && !!chrAsset
  );

  // Get real data or fallback to defaults
  const chrPrice = currentPrice || chrAsset?.price || 0;
  const maxStChrBalance = maxChrAmount !== undefined && maxChrAmount > 0 ? maxChrAmount : 0; // Available staked CHR to withdraw
  const isLoading = isLoadingAssets || isPriceFetching || isLoadingMaxChrAmount;

  const withdrawData = {
    maxAmount: maxStChrBalance,
    healthFactor: 2.5,
  };

  // Initialize form with default amount = maxStChrBalance.toString()
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: maxStChrBalance ? maxStChrBalance.toString() : '',
    },
  });

  // --- Fee and amount calculations ---
  const amount = Number(form.watch('amount')) || 0;
  // Unstaking Fee (0.3%)
  const unstakingFeePercent = 0.3;
  const unstakingFee = amount * (unstakingFeePercent / 100);
  const burnAmount = amount;
  const receiveAmount = amount - unstakingFee;

  const chrWithdraw = useUnstaking({
    onSuccess: (result, params) => {
      console.log('CHR withdraw success:', { result, params });
      toast.success('Successfully initiated slow withdraw');
      form.reset({ amount: maxStChrBalance ? maxStChrBalance.toString() : '' });
      refetchAssets();
      setIsRefetchEnabled(false);
    },
    onError: (error, params) => {
      console.error('CHR withdraw error:', { error, params });
      toast.error(`Failed to withdraw: ${error.message}`);
    },
  });

  // No handleAmountChange needed, input is readonly

  // On submit handler
  const onSubmit = async (data: WithdrawFormValues) => {
    try {
      const amount = Number(data.amount);

      if (isNaN(amount) || amount <= 0) {
        toast.error('Invalid amount to withdraw');
        return;
      }

      if (amount > withdrawData.maxAmount) {
        toast.error(`Amount exceeds your balance of ${withdrawData.maxAmount} CHR`);
        return;
      }

      setIsSubmitting(true);

      await chrWithdraw({
        assetId: stAsset?.assetId || Buffer.from(''),
        amount: data.amount,
        decimals: stAsset?.decimals || 6,
        isUserWithdrawMax: Number(data.amount) === withdrawData.maxAmount,
      });
    } catch (error) {
      console.error('Error submitting withdraw:', error);
      toast.error('Failed to submit withdraw transaction');
    } finally {
      setIsSubmitting(false);
      refetchMaxUnstakedAmount();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
      {/* Amount Input */}
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
              readOnly
              // Disabled onChange and no clear button because user cannot edit
              className="p-0 text-xl font-medium placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-none focus-visible:ring-0 w-[60%] bg-transparent border-none cursor-not-allowed"
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              min={0.0}
              max={withdrawData.maxAmount}
              step="any"
            />
            <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
              {/* Remove clear button because user cannot clear */}
              <Avatar className="h-7 w-7">
                <AvatarImage src={stAsset?.iconUrl} alt={stAsset?.symbol} />
                <AvatarFallback>{stAsset?.symbol}</AvatarFallback>
              </Avatar>
              <Typography weight="medium" className="text-lg">
                {stAsset?.symbol}
              </Typography>
            </div>
          </div>

          <div className="flex justify-between items-center text-base mt-2">
            <div>
              {amount > 0 ? (
                isPriceFetching ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <CountUp value={amount * chrPrice} prefix="$" decimals={2} />
                )
              ) : (
                <Typography className="text-muted-foreground">$0.00</Typography>
              )}
            </div>
            {/* Remove MAX clickable label since user cannot change amount */}
            <div className="flex items-center gap-1 text-primary">
              <Typography>Available: </Typography>
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <Typography className="font-bold">{withdrawData.maxAmount}</Typography>
              )}
              <Typography className="font-bold text-primary">MAX</Typography>
            </div>
          </div>
        </div>

        {form.formState.errors.amount && (
          <Typography className="text-destructive">
            {form.formState.errors.amount.message}
          </Typography>
        )}
      </div>

      {/* Transaction Overview */}
      <div className="space-y-4">
        <Typography weight="semibold" className="text-lg">
          Transaction overview
        </Typography>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Typography className="flex items-center gap-1">Remaining stCHR</Typography>
            <div className="flex items-center gap-2">
              <CountUp
                value={withdrawData.maxAmount - amount}
                suffix={` ${stAsset?.symbol || 'stCHR'}`}
                decimals={6}
                className="font-medium"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Typography className="flex items-center gap-1">
              Unstaking Fee
              <Tooltip delayDuration={100}>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Unstaking fee: {unstakingFeePercent}% of withdrawal amount</p>
                </TooltipContent>
              </Tooltip>
            </Typography>
            <div className="flex items-center gap-2">
              <CountUp
                className="font-medium"
                value={unstakingFee}
                suffix={` ${chrAsset?.symbol} (${unstakingFeePercent}%)`}
                prefix="-"
                decimals={6}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Typography className="flex items-center gap-1">
              You will burn
              <Tooltip delayDuration={100}>
                <TooltipTrigger type="button">
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Amount of stCHR tokens you will burn for this withdrawal</p>
                </TooltipContent>
              </Tooltip>
            </Typography>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={stAsset?.iconUrl} alt={stAsset?.symbol} />
                <AvatarFallback>{stAsset?.symbol}</AvatarFallback>
              </Avatar>
              <CountUp
                className="font-medium"
                value={burnAmount}
                suffix={` ${stAsset?.symbol || 'stCHR'}`}
                decimals={6}
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
                  <p>Net amount of CHR tokens you will receive after fee</p>
                </TooltipContent>
              </Tooltip>
            </Typography>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={chrAsset?.iconUrl} alt={chrAsset?.symbol} />
                <AvatarFallback>{chrAsset?.symbol}</AvatarFallback>
              </Avatar>
              <CountUp
                className="font-medium"
                value={receiveAmount}
                suffix={` ${chrAsset?.symbol || 'CHR'}`}
                decimals={6}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <Alert variant="default" className="space-y-2">
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Slow withdraw requires a 14-day unbonding period. Your funds will be locked during this
          time but you&apos;ll receive full staking rewards.
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <div className="mt-6">
        {isSubmitting ? (
          <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
            Processing...
          </Button>
        ) : !chrAsset ? (
          <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
            {isLoadingAssets ? 'Loading assets...' : 'CHR asset not found'}
          </Button>
        ) : amount <= 0 ? (
          <Button disabled className="w-full text-lg py-6">
            No amount to withdraw
          </Button>
        ) : maxStChrBalance <= 0 ? (
          <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
            {isLoading ? 'Loading...' : 'No staked CHR available'}
          </Button>
        ) : (
          <Button
            variant="gradient"
            type="submit"
            className="w-full text-lg py-6"
            disabled={amount <= 0}
          >
            Slow Withdraw CHR
          </Button>
        )}
      </div>
    </form>
  );
};
