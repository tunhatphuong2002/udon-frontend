'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';

import { Button } from '@/components/common/button';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { useChromiaAccount } from '@/hooks/chromia-hooks';
import { Chr } from '@/components/chromia-ui-kit/icons';

interface DepositFormProps {
  onBack: () => void;
}

const mintTokenSchema = z.object({
  ticker: z.string().min(1, { message: 'Ticker is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  amount: z
    .number({
      message: 'Amount is required',
    })
    .min(1, {
      message: 'Amount should be greater than 0',
    })
    .max(100_000, {
      message: 'Max possible to mint 100,000 tokens',
    }),
});

type MintTokenForm = z.infer<typeof mintTokenSchema>;

export default function DepositForm({ onBack }: DepositFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, refreshBalance } = useTokenBalance();
  const { account } = useChromiaAccount();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MintTokenForm>({
    resolver: zodResolver(mintTokenSchema),
    defaultValues: {
      ticker: 'POL',
      name: 'Polygon',
      amount: 1000,
    },
  });

  const handleMintToken = async (values: MintTokenForm) => {
    if (!account) return;

    setIsSubmitting(true);
    try {
      // Giả định một hàm mintToken
      // await account.mintToken(values.ticker, values.name, values.amount);
      await refreshBalance();
      alert(`Mint token functionality would be implemented here: ${JSON.stringify(values)}`);
      onBack(); // Go back to main view after successful operation
    } catch (error) {
      console.error('Operation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-5 w-5 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleMintToken)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Token Ticker</label>
        <div className="relative">
          <input
            {...register('ticker')}
            placeholder="Enter token ticker"
            className={`w-full rounded-md border ${
              errors.ticker ? 'border-destructive' : 'border-border'
            } bg-background px-3 py-2 text-sm pr-10`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Chr className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {errors.ticker && <span className="text-xs text-destructive">{errors.ticker.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Token Name</label>
        <input
          {...register('name')}
          placeholder="Enter token full name"
          className={`w-full rounded-md border ${
            errors.name ? 'border-destructive' : 'border-border'
          } bg-background px-3 py-2 text-sm`}
        />
        {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <input
          {...register('amount', { valueAsNumber: true })}
          placeholder="Enter amount"
          type="number"
          className={`w-full rounded-md border ${
            errors.amount ? 'border-destructive' : 'border-border'
          } bg-background px-3 py-2 text-sm`}
        />
        {errors.amount ? (
          <span className="text-xs text-destructive">{errors.amount.message}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Max possible to mint 100,000 tokens</span>
        )}
      </div>

      <Button type="submit" className="w-full rounded-md mt-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            Mint
            <Plus className="h-4 w-4 ml-2" />
          </div>
        )}
      </Button>
    </form>
  );
}
