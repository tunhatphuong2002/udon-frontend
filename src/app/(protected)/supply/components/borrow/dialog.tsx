'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Info, AlertCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import { Skeleton } from '@/components/common/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';

const borrowFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
});

type BorrowFormValues = z.infer<typeof borrowFormSchema>;

export interface BorrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: {
    id: Buffer<ArrayBufferLike>;
    symbol: string;
    name: string;
    iconUrl: string;
    available: string;
    maxAmount: number;
    apy: string;
    price?: number;
  };
}

// Create a debounced fetch function with lodash
const debouncedFn = debounce((callback: () => void) => {
  console.log('Lodash debounce triggered in borrow dialog');
  callback();
}, 1000);

export const BorrowDialog: React.FC<BorrowDialogProps> = ({ open, onOpenChange, asset }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | undefined>(asset.price);
  const [inputAmount, setInputAmount] = useState<string>('');
  const [isRefetchEnabled, setIsRefetchEnabled] = useState(false);

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      amount: '',
    },
  });

  // Use the asset price hook with TanStack Query
  const {
    data: priceData,
    isLoading: isPriceFetching,
    refetch: fetchPrice,
  } = useAssetPrice(asset.id, isRefetchEnabled);

  // Handle price fetch with lodash debounce
  const handleFetchPrice = useCallback(() => {
    debouncedFn(() => {
      console.log('Fetch price triggered via lodash debounce in borrow');
      setIsRefetchEnabled(true);
      fetchPrice();
    });
  }, [fetchPrice]);

  // Update price when data is fetched
  useEffect(() => {
    console.log('Borrow dialog: Price data changed:', priceData);
    if (priceData !== null && priceData !== undefined) {
      console.log('Borrow dialog: Setting current price to:', priceData.price);
      setCurrentPrice(priceData.price);
      // Disable refetching to prevent unnecessary calls
      setIsRefetchEnabled(false);
    }
  }, [priceData]);

  // Initialize with asset price
  useEffect(() => {
    setCurrentPrice(asset.price);
  }, [asset.price]);

  // Watch for input changes and fetch price
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('amount', value);
    setInputAmount(value);

    if (value && parseFloat(value) > 0) {
      handleFetchPrice();
    }
  };

  const handleMaxAmount = () => {
    form.setValue('amount', asset.maxAmount.toString());
    setInputAmount(asset.maxAmount.toString());
    handleFetchPrice();
  };

  const onSubmit = async (data: BorrowFormValues) => {
    setIsSubmitting(true);

    try {
      // Here would be the actual borrow transaction logic
      console.log('Borrow submitted:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Successfully borrowed ${data.amount} ${asset.symbol}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting borrow:', error);
      toast.error('Failed to submit borrow transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate USD amount based on current price if available
  const usdAmount = inputAmount
    ? `$${(parseFloat(inputAmount || '0') * (currentPrice || 0)).toFixed(2)}`
    : '$0';

  const healthFactor = 'Δ0.00';
  const liquidationAt = '<1.0';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <TooltipProvider delayDuration={300}>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold">Borrow {asset.symbol}</DialogTitle>
            </div>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      className="p-0 text-xl font-medium placeholder:text-submerged focus-visible:ring-tranparent focus-visible:outline-none focus-visible:ring-0"
                      inputMode="decimal"
                      onChange={handleAmountChange}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={asset.iconUrl} alt={asset.symbol} />
                        <AvatarFallback>{asset.symbol.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-lg">{asset.symbol}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-base">
                    <Typography>{usdAmount}</Typography>
                    <div
                      className="flex flex-row items-center gap-1 text-primary cursor-pointer"
                      onClick={handleMaxAmount}
                    >
                      <Typography>Available {asset.available}</Typography>
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

              <div className="space-y-4">
                <Typography weight="semibold" className="text-lg">
                  Transaction overview
                </Typography>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">
                    Health factor
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your account&apos;s health factor determines the risk of liquidation</p>
                      </TooltipContent>
                    </Tooltip>
                  </Typography>
                  <Typography weight="medium" className="text-green-500">
                    {healthFactor}
                  </Typography>
                </div>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">
                    Liquidation at
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The health factor threshold at which your position can be liquidated</p>
                      </TooltipContent>
                    </Tooltip>
                  </Typography>
                  <Typography weight="medium" className="text-destructive">
                    {liquidationAt}
                  </Typography>
                </div>

                <div className="flex justify-between items-center">
                  <Typography className="flex items-center gap-1">Borrow amount</Typography>
                  <Typography weight="medium">
                    {inputAmount || 0} {asset.symbol} ~{' '}
                    {isPriceFetching ? <Skeleton className="inline-block h-5 w-20" /> : usdAmount}
                  </Typography>
                </div>
              </div>

              {/* price fee */}
              {/* <div className="flex items-center gap-2 text-muted-foreground">
                <Typography className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  $0.06
                </Typography>
              </div> */}

              <Alert className="border border-primary">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertTitle className="text-base text-primary">Attention</AlertTitle>
                <AlertDescription className="text-sm">
                  Parameter changes via governance can alter your account health factor and risk of
                  liquidation. Follow the{' '}
                  <a href="#" className="text-primary underline">
                    governance forum
                  </a>{' '}
                  for updates.
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-4">
              {isSubmitting ? (
                <Button disabled className="w-full bg-muted text-muted-foreground text-lg py-6">
                  Approving {asset.symbol}...
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full text-lg py-6"
                  disabled={!form.watch('amount')}
                >
                  Borrow {asset.symbol}
                </Button>
              )}
            </div>
          </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
