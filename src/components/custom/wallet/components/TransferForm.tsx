'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/common/button';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { useChromiaAccount } from '@/hooks/chromia-hooks';
import { Chr } from '@/components/chromia-ui-kit/icons';

interface TransferFormProps {
  onBack: () => void;
}

const transferTokenSchema = z.object({
  recipient: z.string().min(1, {
    message: 'Recipient is required',
  }),
  amount: z
    .number({
      message: 'Amount is required',
    })
    .min(1, {
      message: 'Amount should be greater than 0',
    })
    .max(100_000, {
      message: 'Max possible to transfer 100,000 tokens',
    }),
});

type TransferTokenValues = z.infer<typeof transferTokenSchema>;

export default function TransferForm({ onBack }: TransferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { balances, isLoading, refreshBalance } = useTokenBalance();
  const { account } = useChromiaAccount();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TransferTokenValues>({
    resolver: zodResolver(transferTokenSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  async function handleTransfer(values: TransferTokenValues) {
    if (!account || !balances || balances.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Giả định một hàm transfer
      // await account.transfer(balances[0].asset.id, BigInt(values.amount), values.recipient);
      await refreshBalance();
      alert(`Transfer functionality would be implemented here: ${JSON.stringify(values)}`);
      onBack(); // Go back to main view after successful transfer
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !balances?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-5 w-5 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const currentBalance = Number(balances[0].amount.toString());

  return (
    <form onSubmit={handleSubmit(handleTransfer)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Token</label>
        <div className="relative">
          <input
            disabled
            value={balances[0].asset?.symbol?.toUpperCase() || 'TOKEN'}
            className="w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Chr className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient Address</label>
        <input
          {...register('recipient')}
          placeholder="Enter recipient address"
          className={`w-full rounded-md border ${
            errors.recipient ? 'border-destructive' : 'border-border'
          } bg-background px-3 py-2 text-sm`}
        />
        {errors.recipient && (
          <span className="text-xs text-destructive">{errors.recipient.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <div className="relative">
          <input
            {...register('amount', { valueAsNumber: true })}
            placeholder={`Enter amount`}
            type="number"
            className={`w-full rounded-md border ${
              errors.amount ? 'border-destructive' : 'border-border'
            } bg-background px-3 py-2 text-sm pr-20`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Button
              onClick={() => setValue('amount', currentBalance)}
              variant="outline"
              size="sm"
              className="h-7 py-0 px-2 text-xs"
            >
              Max
            </Button>
          </div>
        </div>
        {errors.amount ? (
          <span className="text-xs text-destructive">{errors.amount.message}</span>
        ) : (
          <span className="text-xs text-muted-foreground">
            Balance: {currentBalance} {balances[0].asset?.symbol?.toUpperCase() || 'TOKEN'}
          </span>
        )}
      </div>

      <div className="space-y-4 mt-6 pt-4 border-t border-border/40">
        <div className="flex justify-between gap-2 text-sm leading-none">
          <p className="text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Arrival time
          </p>
          <hr className="flex-1 self-end border-0 border-t border-dotted border-muted" />
          <p className="font-medium">Instantly</p>
        </div>
        <div className="flex justify-between gap-2 text-sm leading-none">
          <p className="text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Network fee
          </p>
          <hr className="flex-1 self-end border-0 border-t border-dotted border-muted" />
          <p className="font-medium">0.00 CHR</p>
        </div>
      </div>

      <Button type="submit" className="w-full rounded-md mt-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Request Transfer'
        )}
      </Button>
    </form>
  );
}
