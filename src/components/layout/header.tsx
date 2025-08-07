import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectWallet } from '@/components/custom/wallet';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/tailwind';
import { DepositBadge } from '@/app/(protected)/dashboard/components/faucet-badge';
import { WithdrawBadge } from '@/app/(protected)/dashboard/components/withdraw-badge';
import { NetworkBadge } from '../custom/landing/network-badge';

export const Header: React.FC = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call once to set initial state
    handleScroll();

    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[20] flex flex-row sm:px-16 px-4 justify-between items-center py-4 transition-all duration-300',
        scrolled && 'bg-background/10 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="w-[94px] h-[46px] relative cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo/logo-shorttext.png" alt="Logo" fill className="object-contain" />
        <NetworkBadge network="mainnet" />
      </div>
      <div className="z-[100] flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3">
          <DepositBadge />
          <WithdrawBadge />
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
};
