'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import LinkIconButton from '@/components/chromia-ui-kit/link-icon-button';
import { CardLoading } from '@/components/custom/card-loading';
import { Card, CardTitle } from '@/components/common/card';
import TransferTokenForm from '@/forms/transfer';
import { useTokenBalance } from '@/hooks/use-token-balance';

export default function TransferToken() {
  const router = useRouter();
  const { balances, isLoading, refreshBalance } = useTokenBalance();

  const handleSuccess = async () => {
    await refreshBalance();
    router.push('/token');
  };

  if (isLoading || !balances?.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <CardLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-lg p-6">
        <div className="mb-8 flex items-center">
          <Link href="/token" passHref legacyBehavior>
            <LinkIconButton Icon={<ArrowLeft />} variant="ghost" />
          </Link>
          <CardTitle className="mx-auto text-center text-xl">Transfer</CardTitle>
        </div>
        <TransferTokenForm balance={balances[0]} onTransfered={handleSuccess} />
      </Card>
    </div>
  );
}
