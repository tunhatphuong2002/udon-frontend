'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/common/button';
import { useTokenBalance } from '@/hooks/use-token-balance';
import { useTransferHistory } from '@/hooks/use-tranfer-history';
import Input from '@/components/chromia-ui-kit/input';
import { LoaderCubes, Chr } from '@/components/chromia-ui-kit/icons';
import { useTransferedSuccessModal } from '@/components/custom/modals/transfered-success-modal';
import { useTransactionFailedModal } from '@/components/custom/modals/transaction-failed-modal';
import { useTransferTokens } from '@/hooks/token-hooks';

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
      message: 'Max possible to transfer 100 000 tokens',
    }),
});

type TransferTokenValues = z.infer<typeof transferTokenSchema>;

export default function TransferForm({ onBack }: TransferFormProps) {
  const { balances, isLoading, refreshBalance } = useTokenBalance();
  const { refreshHistory } = useTransferHistory();

  const { show: showTransferedSuccessModal } = useTransferedSuccessModal();
  const { show: showTransferedErrorModal } = useTransactionFailedModal();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransferTokenValues>({
    resolver: zodResolver(transferTokenSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  // Use the proper hook for token transfers
  const transferTokens = useTransferTokens({
    onSuccess: async token => {
      // Show success modal
      showTransferedSuccessModal(token);

      // Refresh balances and transaction history
      await Promise.all([refreshBalance(), refreshHistory()]);

      // Go back to main view
      onBack();
    },
    onError: showTransferedErrorModal,
  });

  if (isLoading || !balances?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-5 w-5 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const currentBalance = Number(balances[0].amount.toString());
  const symbol = balances[0].asset?.symbol?.toUpperCase() || 'TOKEN';

  return (
    <form
      onSubmit={handleSubmit(values => transferTokens(values.recipient, values.amount))}
      className="space-y-6"
    >
      <Input label="Token" disabled value={symbol} rightElement={<Chr className="h-6 w-6" />} />

      <Input
        {...register('recipient')}
        label="Receiver"
        error={!!errors.recipient}
        info={errors.recipient?.message ?? ''}
      />

      <Input
        {...register('amount', { valueAsNumber: true })}
        label="Amount"
        error={!!errors.amount}
        rightElement={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('amount', currentBalance)}
            className="h-8 py-0 px-2 text-xs"
          >
            Max
          </Button>
        }
        info={
          errors.amount?.message ??
          `Balance: ${Intl.NumberFormat().format(currentBalance)} ${symbol}`
        }
      />

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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCubes /> : 'Request transfer'}
      </Button>
    </form>
  );
}
