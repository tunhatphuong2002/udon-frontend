'use client';

import React, { useState, useMemo } from 'react';
import { CircleX, AlertTriangle } from 'lucide-react';
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
import { useChrWithdraw } from '@/hooks/contracts/operations/use-lsd-chr-withdraw';
import { useCompletedAssets } from '@/hooks/contracts/queries/use-completed-assets';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
import { useMaxAmount } from '@/hooks/contracts/queries/use-max-amount';

const withdrawFormSchema = z.object({
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

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

export const SlowWithdraw: React.FC = () => {
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
  } = useAssetPrice(chrAsset?.assetId || Buffer.from(''), isRefetchEnabled && !!chrAsset);

  // Fetch max CHR amount that can be withdrawn
  const { data: maxChrAmount } = useMaxAmount(
    chrAsset?.assetId || Buffer.from(''),
    chrAsset?.decimals || 6,
    'get_max_chr_withdraw_amount_query'
  );

  // Constants
  const exchangeRate = 1.0; // 1 stCHR = 1 CHR

  // Get real data or fallback to defaults
  const chrPrice = currentPrice || chrAsset?.price || 0.75;
  const maxStChrBalance = maxChrAmount || 0; // Available staked CHR to withdraw
  const isLoading = isLoadingAssets || isPriceFetching;

  const withdrawData = {
    maxAmount: maxStChrBalance,
    healthFactor: 2.5,
  };

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  const chrWithdraw = useChrWithdraw({
    onSuccess: (result, params) => {
      console.log('CHR withdraw success:', { result, params });
      toast.success('Successfully initiated slow withdraw');
      form.reset();
      refetchAssets();
    },
    onError: (error, params) => {
      console.error('CHR withdraw error:', { error, params });
      toast.error(`Failed to withdraw: ${error.message}`);
    },
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^$|^[0-9]+\.?[0-9]*$/;
    if (!regex.test(value)) {
      form.setValue('amount', '0');
      return;
    }

    // Don't allow value > maxStChrBalance
    const valueWithBalance = Number(value) > Number(maxStChrBalance) ? maxStChrBalance : value;
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
    form.setValue('amount', maxStChrBalance.toString());
    if (chrAsset) {
      setIsRefetchEnabled(true);
      fetchPrice();
    }
  };

  const onSubmit = async (data: WithdrawFormValues) => {
    try {
      const amount = Number(data.amount);

      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid positive number');
        return;
      }

      if (amount > withdrawData.maxAmount) {
        toast.error(`Amount exceeds your balance of ${withdrawData.maxAmount} CHR`);
        return;
      }

      setIsSubmitting(true);

      await chrWithdraw({
        assetId: chrAsset?.assetId || Buffer.from(''),
        amount: data.amount,
        decimals: chrAsset?.decimals || 6,
        isUserWithdrawMax: Number(data.amount) === withdrawData.maxAmount,
      });
    } catch (error) {
      console.error('Error submitting withdraw:', error);
      toast.error('Failed to submit withdraw transaction');
    } finally {
      setIsSubmitting(false);
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
              className="p-0 text-xl font-medium placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-none focus-visible:ring-0 w-[60%] bg-transparent border-none"
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              min={0.0}
              max={withdrawData.maxAmount}
              step="any"
              onChange={handleAmountChange}
            />
            <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
              {form.watch('amount') && (
                <Button
                  variant="none"
                  size="icon"
                  onClick={() => form.setValue('amount', '')}
                  className="hover:opacity-70"
                >
                  <CircleX className="h-6 w-6 text-muted-foreground" />
                </Button>
              )}
              <Avatar className="h-7 w-7">
                <AvatarImage src="/images/tokens/chr.png" alt="CHR" />
                <AvatarFallback>CHR</AvatarFallback>
              </Avatar>
              <Typography weight="medium" className="text-lg">
                CHR
              </Typography>
            </div>
          </div>

          <div className="flex justify-between items-center text-base mt-2">
            <div>
              {Number(form.watch('amount')) > 0 ? (
                isPriceFetching ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <CountUp
                    value={Number(form.watch('amount')) * chrPrice}
                    prefix="$"
                    decimals={2}
                  />
                )
              ) : (
                <Typography className="text-muted-foreground">$0.00</Typography>
              )}
            </div>
            <div
              className="flex items-center gap-1 text-primary cursor-pointer hover:text-primary/80"
              onClick={handleMaxAmount}
            >
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

        <div className="flex justify-between items-center">
          <Typography className="flex items-center gap-1">Remaining stCHR</Typography>
          <CountUp
            value={withdrawData.maxAmount - Number(form.watch('amount') || 0)}
            suffix=" stCHR"
            decimals={6}
            className="font-medium"
          />
        </div>

        <div className="flex justify-between items-center">
          <Typography className="flex items-center gap-1">Withdraw Amount</Typography>
          <div className="font-medium text-base flex items-center gap-1">
            <CountUp
              value={Number(form.watch('amount') || 0) * exchangeRate}
              suffix=" CHR"
              decimals={6}
            />
            ~
            {isPriceFetching ? (
              <Skeleton className="h-5 w-16 inline-block" />
            ) : (
              <CountUp
                value={Number(form.watch('amount') || 0) * exchangeRate * chrPrice}
                prefix="$"
                decimals={2}
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Typography className="flex items-center gap-1">Withdraw method</Typography>
          <Typography weight="medium">Slow Withdraw</Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography className="flex items-center gap-1">Processing time</Typography>
          <Typography weight="medium">14 days</Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography className="flex items-center gap-1">Exchange rate</Typography>
          <Typography weight="medium">1 stCHR = {exchangeRate} CHR</Typography>
        </div>
      </div>

      {/* Important Warning */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
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
        ) : !form.watch('amount') || parseFloat(form.watch('amount')) === 0 ? (
          <Button disabled className="w-full text-lg py-6">
            Enter an amount
          </Button>
        ) : (
          <Button
            variant="gradient"
            type="submit"
            className="w-full text-lg py-6"
            disabled={!form.watch('amount')}
          >
            Slow Withdraw CHR
          </Button>
        )}
      </div>
    </form>
  );
};
