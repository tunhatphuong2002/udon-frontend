'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CircleX, Info, ArrowRight, Clock, Zap, AlertTriangle } from 'lucide-react';
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
import { useSlowWithdraw } from '@/hooks/contracts/operations/use-slow-withdraw';
import { useQuickWithdraw } from '@/hooks/contracts/operations/use-quick-withdraw';

const lsdWithdrawFormSchema = z.object({
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

type LsdWithdrawFormValues = z.infer<typeof lsdWithdrawFormSchema>;

export interface LsdWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserve: UserReserveData;
  accountData: UserAccountData;
  mutateAssets: () => void;
}

type WithdrawType = 'slow' | 'quick';

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
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('slow');

  const form = useForm<LsdWithdrawFormValues>({
    resolver: zodResolver(lsdWithdrawFormSchema),
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

  //   const { data: maxWithdrawAmount, isLoading: isMaxWithdrawFetching } = useMaxAmount(
  //     reserve.assetId,
  //     reserve.decimals,
  //     'get_max_withdraw_amount'
  //   );

  const maxWithdrawAmount = reserve.currentATokenBalance || 0;
  const isMaxWithdrawFetching = false;

  // Use the withdraw hooks
  const slowWithdraw = useSlowWithdraw({
    onSuccess: (result, params) => {
      console.log('Slow withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('Slow withdraw error:', { error, params });
    },
  });

  const quickWithdraw = useQuickWithdraw({
    onSuccess: (result, params) => {
      console.log('Quick withdraw success:', { result, params });
      mutateAssets();
    },
    onError: (error, params) => {
      console.error('Quick withdraw error:', { error, params });
    },
  });

  // Calculate health factor based on current input
  const calculateHealthFactor = useCallback(() => {
    if (accountData.healthFactor === -1) {
      setCalculatedHealthFactor(-1);
      return;
    }

    const amount = form.watch('amount');
    if (!amount || Number(amount) <= 0) {
      setCalculatedHealthFactor(
        Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
      );
      return;
    }

    const hf = calculateHFAfterWithdraw(
      valueToBigNumber(accountData.totalCollateralBase.toString()),
      valueToBigNumber(normalize(reserve.price.toString(), 18)).multipliedBy(
        valueToBigNumber(amount)
      ),
      (Number(accountData.currentLiquidationThreshold) / 100).toString(),
      reserve.liquidationThreshold.toString(),
      valueToBigNumber(accountData.totalDebtBase.toString()),
      valueToBigNumber(accountData.healthFactor.toString()),
      reserve.usageAsCollateralEnabled
    );

    console.log('hf after withdraw', hf.toString());
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
      // Don't allow value > supply balance
      const valueWithBalance =
        Number(form.watch('amount')) > Number(maxWithdrawAmount)
          ? maxWithdrawAmount
          : form.watch('amount');
      const needToChangeValue = valueWithBalance !== form.watch('amount');
      if (needToChangeValue) {
        form.setValue('amount', valueWithBalance.toString());
      }
      setIsRefetchEnabled(true);
      fetchPrice();
      // Calculate health factor after debounce
      calculateHealthFactor();
    });
  }, [fetchPrice, form, maxWithdrawAmount, calculateHealthFactor]);

  // Update price when data is fetched
  useEffect(() => {
    if (priceData !== null && priceData !== undefined) {
      setCurrentPrice(priceData);
      // Disable refetching to prevent unnecessary calls
      setIsRefetchEnabled(false);
    }
  }, [priceData]);

  // Initialize with asset price and calculate initial health factor
  useEffect(() => {
    setCurrentPrice(reserve.price);
    calculateHealthFactor();
  }, [reserve.price, calculateHealthFactor]);

  // Watch for input changes and fetch price
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and a single decimal point
    const regex = /^$|^[0-9]+\.?[0-9]*$/;
    if (!regex.test(value)) {
      // if don't pass set input with 0
      form.setValue('amount', '0');
      return;
    }

    form.setValue('amount', value);

    if (value && parseFloat(value) > 0) {
      handleFetchPrice();
    } else {
      // If amount is empty or 0, reset health factor to current
      setCalculatedHealthFactor(
        accountData.healthFactor === -1
          ? -1
          : Number(normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18))
      );
    }
  };

  const handleMaxAmount = () => {
    // Use supply balance as the max amount
    form.setValue('amount', maxWithdrawAmount.toString());
    handleFetchPrice();
  };

  const onSubmit = async (data: LsdWithdrawFormValues) => {
    try {
      const amount = Number(data.amount);

      // Final validation checks before submission
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid positive number');
        return;
      }

      const balance = Number(maxWithdrawAmount);
      if (amount > balance) {
        toast.error(
          `Amount exceeds your supply balance of ${balance.toFixed(6)} ${reserve.symbol}`
        );
        return;
      }

      setIsSubmitting(true);

      let withdrawResult;
      if (withdrawType === 'slow') {
        withdrawResult = await slowWithdraw({
          assetId: reserve.assetId,
          amount: data.amount,
          decimals: reserve.decimals,
          isUserWithdrawMax: Number(form.watch('amount')) === Number(maxWithdrawAmount),
        });
      } else {
        withdrawResult = await quickWithdraw({
          assetId: reserve.assetId,
          amount: data.amount,
          decimals: reserve.decimals,
          isUserWithdrawMax: Number(form.watch('amount')) === Number(maxWithdrawAmount),
        });
      }

      console.log('LSD Withdraw submitted:', {
        amount: data.amount,
        type: withdrawType,
        result: withdrawResult,
      });

      if (withdrawResult.success) {
        toast.success(
          `Successfully initiated ${withdrawType} withdraw of ${data.amount} ${reserve.symbol}`
        );
        // Close dialog after successful operation
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

  const currentHealthFactor =
    accountData.healthFactor === -1
      ? -1
      : normalizeBN(valueToBigNumber(accountData.healthFactor.toString()), 18);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[40vw] w-auto max-h-[90vh] overflow-y-auto rounded-xl">
        <TooltipProvider delayDuration={300}>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">
                LSD Withdraw {reserve.symbol}
              </DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Typography className="flex items-center gap-1">Amount</Typography>
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
                      max={maxWithdrawAmount}
                      step="any"
                      onChange={handleAmountChange}
                    />
                    <div className="flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
                      {/* clear icon */}
                      {form.watch('amount') && (
                        <Button
                          variant="none"
                          size="icon"
                          onClick={() => {
                            form.setValue('amount', '');
                            // Reset health factor when clearing input
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
                        <span className="font-medium text-lg">{reserve.symbol}</span>
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
                        {isMaxWithdrawFetching ? (
                          <Skeleton className="h-5 w-20" />
                        ) : (
                          <Typography className="font-bold">{maxWithdrawAmount}</Typography>
                        )}
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

              {/* Withdraw Type Selection */}
              <div className="space-y-2">
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
                            Slow Withdraw
                          </Typography>
                          <Typography variant="small" className="text-muted-foreground">
                            14 days waiting period
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Typography variant="small" className="text-muted-foreground">
                          ✓ Lower fees
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground">
                          ✓ Full staking rewards
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
                            Quick Withdraw
                          </Typography>
                          <Typography variant="small" className="text-muted-foreground">
                            Instant withdrawal
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Typography variant="small" className="text-muted-foreground">
                          • Higher fees
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground">
                          • Market-based rates
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="h-[1px] bg-border/50 rounded-full"></div>

              <div className="space-y-4">
                <Typography weight="semibold" className="text-lg">
                  Transaction overview
                </Typography>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">Remaining supply</Typography>
                  <Typography weight="medium">
                    <CountUp
                      value={maxWithdrawAmount - Number(form.watch('amount'))}
                      suffix={` ${reserve.symbol}`}
                      decimals={6}
                    />
                  </Typography>
                </div>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">Withdraw method</Typography>
                  <Typography weight="medium" className="capitalize">
                    {withdrawType} withdraw
                  </Typography>
                </div>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">Processing time</Typography>
                  <Typography weight="medium">
                    {withdrawType === 'slow' ? '14 days' : 'Instant'}
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

                    {/* icon arrow left to right */}
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
                    <CountUp
                      value={Number(form.watch('amount'))}
                      suffix={` ${reserve.symbol}`}
                      decimals={6}
                    />
                    ~{' '}
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

            {/* Important Warning */}
            <div className="my-6">
              <Alert variant={withdrawType === 'slow' ? 'warning' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  {withdrawType === 'slow' ? (
                    <>
                      Slow withdraw requires a 14-day unbonding period. Your funds will be locked
                      during this time but you&apos;ll receive full staking rewards.
                    </>
                  ) : (
                    <>
                      Quick withdraw uses DEX swaps for instant liquidity. Final amount may vary
                      based on market conditions and slippage.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </div>

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
                <Button
                  variant="gradient"
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={!form.watch('amount')}
                >
                  {withdrawType === 'slow' ? 'Slow' : 'Quick'} Withdraw {reserve.symbol}
                </Button>
              )}
            </div>
          </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
