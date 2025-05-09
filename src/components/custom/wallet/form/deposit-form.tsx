'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/common/button';
import { useTokenBalance } from '@/hooks/contracts/queries/use-token-balance';
import { useTransferHistory } from '@/hooks/contracts/queries/use-tranfer-history';
import { Chr, LoaderCubes, Plus } from '@/components/chromia-ui-kit/icons';
import Input from '@/components/chromia-ui-kit/input';
import { useMintedSuccessModal } from '@/components/custom/modals/minted-success-modal';
import { useTransactionFailedModal } from '@/components/custom/modals/transaction-failed-modal';
import { useMintToken } from '@/hooks/contracts/operations/token-hooks';

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
      message: 'Max possible to mint 100 000 tokens',
    }),
});

type MintTokenForm = z.infer<typeof mintTokenSchema>;

export default function DepositForm({ onBack }: DepositFormProps) {
  const { isLoading, refreshBalance } = useTokenBalance();
  const { refreshHistory } = useTransferHistory();

  const { show: showMintedSuccessModal } = useMintedSuccessModal();
  const { show: showMintedErrorModal } = useTransactionFailedModal();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<MintTokenForm>({
    resolver: zodResolver(mintTokenSchema),
    defaultValues: {
      ticker: '',
      name: '',
      amount: 0,
    },
  });

  // Use the useMintToken hook instead of manual handling
  const registerAsset = useMintToken({
    onSuccess: async token => {
      // Show success modal
      showMintedSuccessModal(token);

      // Refresh balances and transaction history
      await Promise.all([refreshBalance(), refreshHistory()]);

      // Go back to main view
      onBack();
    },
    onError: showMintedErrorModal,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-5 w-5 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(values => registerAsset(values))} className="space-y-6">
      <Input
        {...register('ticker')}
        label="Enter token ticker"
        error={!!errors.ticker}
        info={errors.ticker?.message ?? ''}
        rightElement={<Chr className="h-6 w-6" />}
      />
      <Input
        {...register('name')}
        label="Enter token full name"
        error={!!errors.name}
        info={errors.name?.message ?? ''}
      />
      <Input
        {...register('amount', { valueAsNumber: true })}
        label="Enter amount"
        error={!!errors.amount}
        info={errors.amount?.message ?? 'Max possible to mint 100 000 tokens'}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCubes />
        ) : (
          <>
            Mint
            <Plus className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
