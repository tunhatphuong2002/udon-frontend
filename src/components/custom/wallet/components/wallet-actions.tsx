'use client';

import { useState } from 'react';
import { ArrowRightLeft, Wallet, LogOut, ArrowLeft } from 'lucide-react';
import { useDisconnect } from 'wagmi';

import { Button } from '@/components/common/button';
import TransferForm from '../form/transfer-form';
import DepositForm from '../form/deposit-form';
import { ChromiaAccount } from './chromia-account';
import { TokenList } from './token-list';
import { TransactionHistory } from './transaction-history';
import { Typography } from '@/components/common/typography';

export function WalletActions() {
  const [activeView, setActiveView] = useState<'account' | 'transfer' | 'deposit'>('account');
  const { disconnect } = useDisconnect();

  const handleBack = () => {
    setActiveView('account');
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* Account Dashboard View */}
      <div
        className={`${
          activeView === 'account'
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full absolute inset-0 opacity-0 pointer-events-none'
        } transform transition-all duration-300 ease-in-out w-full`}
      >
        <div className="space-y-4 w-full">
          <ChromiaAccount />
          <TokenList />
          <TransactionHistory />

          <div className="mt-6 pt-4 border-t border-border/40">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={() => setActiveView('transfer')}
                className="w-full rounded-full py-5 font-medium text-base"
                variant="secondary"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Transfer
              </Button>
              <Button
                onClick={() => setActiveView('deposit')}
                className="w-full rounded-full py-5 font-medium text-base"
                variant="secondary"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Deposit
              </Button>
            </div>

            <Button
              onClick={() => disconnect()}
              className="w-full rounded-full py-5 font-medium text-base !flex items-center justify-center gap-2 border-rose-500 hover:bg-rose-500/10 text-rose-500"
              variant="outline"
            >
              Disconnect <LogOut className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Transfer Form View */}
      <div
        className={`${
          activeView === 'transfer'
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full absolute inset-0 opacity-0 pointer-events-none'
        } transform transition-all duration-300 ease-in-out w-full`}
      >
        <div className="w-full space-y-4">
          <div className="flex items-center">
            <Button onClick={handleBack} variant="secondary" size="icon" className="mr-auto">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Typography variant="h4" weight="medium" className="flex-1 text-center">
              Transfer
            </Typography>
            <div className="w-9"></div> {/* Placeholder for symmetry */}
          </div>

          <TransferForm onBack={handleBack} />
        </div>
      </div>

      {/* Deposit Form View */}
      <div
        className={`${
          activeView === 'deposit'
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full absolute inset-0 opacity-0 pointer-events-none'
        } transform transition-all duration-300 ease-in-out w-full`}
      >
        <div className="w-full space-y-4">
          <div className="flex items-center">
            <Button onClick={handleBack} variant="secondary" size="icon" className="mr-auto">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Typography variant="h4" weight="medium" className="flex-1 text-center">
              Deposit
            </Typography>
            <div className="w-9"></div> {/* Placeholder for symmetry */}
          </div>

          <DepositForm onBack={handleBack} />
        </div>
      </div>
    </div>
  );
}
