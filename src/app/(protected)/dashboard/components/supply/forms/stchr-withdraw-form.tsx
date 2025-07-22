'use client';

import React, { useState, useCallback } from 'react';
import { CircleX, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';
import { useAssetPrice } from '@/hooks/contracts/queries/use-asset-price';
import { useStchrWithdraw } from '@/hooks/contracts/operations/use-lsd-stchr-withdraw';
import { useMaxAmount } from '@/hooks/contracts/queries/use-max-amount';
import { toast } from 'sonner';

import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Input } from '@/components/common/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Skeleton } from '@/components/common/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';
import { UserAccountData, UserReserveData } from '../../../types';
import CountUp from '@/components/common/count-up';
import { normalize, normalizeBN, valueToBigNumber } from '@/utils/bignumber';
import { calculateHFAfterWithdraw } from '@/utils/hf';

const stchrWithdrawFormSchema = z.object({
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

type StchrWithdrawFormValues = z.infer<typeof stchrWithdrawFormSchema>;

export interface StchrWithdrawFormProps {
  reserve: UserReserveData;
  accountData: UserAccountData;
  mutateAssets: () => void;
  onSuccess: () => void;
}

// Create a debounced fetch function with lodash
const debouncedFn = debounce((callback: () => void) => {
  callback();
}, 1000);

export const StchrWithdrawForm: React.FC<StchrWithdrawFormProps> = ({
  reserve,
  accountData,
  mutateAssets,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(reserve.price);
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);
  const [calculatedHealthFactor, setCalculatedHealthFactor] = useState<number>(-1);

  const form = useForm<StchrWithdrawFormValues>({
    resolver: zodResolver(stchrWithdrawFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  // Use the asset price hook with TanStack Query
  const {
    data: priceData,
    isLoading: isPriceFetching,
    refetch: fetchPrice,
  } = useAssetPrice(reserve.assetId, isRefetchEnabled);

  // Fetch max stCHR amount
  const { data: maxStchrAmount } = useMaxAmount(
    reserve.assetId,
    reserve.decimals,
    'get_max_stchr_withdraw_amount_query'
  );

  // Use the stCHR withdraw hook
  const stchrWithdraw = useStchrWithdraw({
    onSuccess: (result, params) => {
      console.log('stCHR withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('stCHR withdraw error:', { error, params });
    },
  });

  // Calculate health factor based on current input
  const calculateHealthFactor = useCallback(() => {
    if (accountData.healthFactor === -1) {
      setCalculatedHealthFactor(-1);
      return;
    }

    const withdrawAmount = Number(form.watch('amount')) || 0;

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
    form,
    reserve.liquidationThreshold,
    reserve.price,
    reserve.usageAsCollateralEnabled,
  ]);

  // Handle price fetch with lodash debounce
  const handleFetchPrice = useCallback(() => {
    debouncedFn(() => {
      // Don't allow value > max amount
      const maxAmount = maxStchrAmount || 0;
      const currentAmount = Number(form.watch('amount'));
      if (currentAmount > maxAmount) {
        form.setValue('amount', maxAmount.toString());
      }
      setIsRefetchEnabled(true);
      fetchPrice();
      calculateHealthFactor();
    });
  }, [fetchPrice, calculateHealthFactor, maxStchrAmount, form]);

  // Update price when data is fetched
  React.useEffect(() => {
    if (priceData !== null && priceData !== undefined) {
      setCurrentPrice(priceData);
      setIsRefetchEnabled(false);
    }
  }, [priceData]);

  // Initialize with asset price and calculate initial health factor
  React.useEffect(() => {
    setCurrentPrice(reserve.price);
    calculateHealthFactor();
  }, [reserve.price, calculateHealthFactor]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^$|^[0-9]+\.?[0-9]*$/;

    if (!regex.test(value)) {
      form.setValue('amount', '0');
      return;
    }

    form.setValue('amount', value);

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

  // Handle max amount click
  const handleMaxAmount = () => {
    form.setValue('amount', (maxStchrAmount || 0).toString());
    handleFetchPrice();
  };

  // Submit handler
  const onSubmit = async (data: StchrWithdrawFormValues) => {
    try {
      const amount = Number(data.amount);
      const maxAmount = maxStchrAmount || 0;

      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid positive number');
        return;
      }

      if (amount > maxAmount) {
        toast.error(`Amount exceeds maximum of ${maxAmount.toFixed(6)} stCHR`);
        return;
      }

      setIsSubmitting(true);

      const withdrawResult = await stchrWithdraw({
        assetId: reserve.assetId,
        amount: data.amount,
        decimals: reserve.decimals,
        isUserWithdrawMax: Number(data.amount) === maxAmount,
      });

      if (withdrawResult.success) {
        toast.success(`Successfully initiated stCHR withdraw of ${data.amount} stCHR`);
        onSuccess();
      } else {
        toast.error(`Failed to withdraw: ${withdrawResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting stCHR withdraw:', error);
      toast.error('Failed to submit stCHR withdraw transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHealthFactor =
    accountData.healthFactor === -1
      ? -1
      : normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography className="flex items-center gap-1">Amount (stCHR)</Typography>
          </div>

          <div className="border px-3 py-2 rounded-lg">
            <div className="relative">
              <Input
                {...form.register('amount')}
                autoComplete="off"
                placeholder="0.00"
                className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0 w-[60%]"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                min={0.0}
                max={maxStchrAmount}
                step="any"
                onChange={handleAmountChange}
              />
              <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                {form.watch('amount') && (
                  <Button
                    variant="none"
                    size="icon"
                    onClick={() => {
                      form.setValue('amount', '');
                      setCalculatedHealthFactor(
                        accountData.healthFactor === -1
                          ? -1
                          : Number(
                              normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18)
                            )
                      );
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
                  value={(currentPrice || 0) * Number(form.watch('amount'))}
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
                  <Typography className="font-bold">
                    <CountUp value={maxStchrAmount || 0} decimals={6} />
                  </Typography>
                  <Typography className="font-bold text-primary">MAX</Typography>
                </div>
              </div>
            </div>
          </div>

          {form.formState.errors.amount && (
            <Typography className="text-destructive">
              {form.formState.errors.amount.message}
            </Typography>
          )}
        </div>

        {/* Important Notice for stCHR */}
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            stCHR withdraw is immediate from the lending pool. Amount may be limited by your
            collateral position.
          </AlertDescription>
        </Alert>

        {/* Transaction Overview for stCHR */}
        <div className="space-y-4">
          <Typography weight="semibold" className="text-lg">
            Transaction overview
          </Typography>

          <div className="flex justify-between items-center">
            <Typography className="flex items-center gap-1">Remaining supply</Typography>
            <Typography weight="medium">
              <CountUp
                value={(maxStchrAmount || 0) - Number(form.watch('amount'))}
                suffix=" stCHR"
                decimals={6}
              />
            </Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography className="flex items-center gap-1">Withdraw method</Typography>
            <Typography weight="medium" className="capitalize">
              stCHR (immediate)
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

              {!form.watch('amount') || Number(form.watch('amount')) === 0 ? (
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
              <CountUp value={Number(form.watch('amount'))} suffix=" stCHR" decimals={6} />~{' '}
              {isPriceFetching ? (
                <Skeleton className="inline-block h-5 w-20" />
              ) : (
                <CountUp
                  value={(currentPrice || 0) * Number(form.watch('amount'))}
                  prefix="$"
                  className="text-base"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit button for stCHR */}
      <div className="mt-4">
        {isSubmitting ? (
          <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
            Processing...
          </Button>
        ) : !form.watch('amount') || parseFloat(form.watch('amount')) === 0 ? (
          <Button disabled className="w-full text-lg py-6">
            Enter an amount
          </Button>
        ) : (
          <Button variant="gradient" type="submit" className="w-full text-lg py-6">
            Withdraw stCHR
          </Button>
        )}
      </div>
    </form>
  );
};
