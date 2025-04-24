'use client';

import { useState, useEffect, useRef } from 'react';
import { ConnectKitButton, Avatar } from 'connectkit';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/common/button';
import { WalletActions } from './components/wallet-actions';
import { useChromiaAccount } from '@/hooks/chromia-hooks';

interface ConnectedButtonProps {
  className?: string;
  address?: `0x${string}`;
  ensName?: string;
  isOpen: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function ConnectedButton({
  className,
  ensName,
  isOpen,
  onClick,
  onMouseEnter,
}: ConnectedButtonProps) {
  const { account } = useChromiaAccount();
  const truncatedAddress = account?.id.toString('hex')
    ? `${account?.id.toString('hex').toUpperCase().slice(0, 6)}...${account?.id.toString('hex').toUpperCase().slice(-4)}`
    : '';

  return (
    <Button
      //   variant="outline"
      className={`group py-5 border bg-gradient-to-b from-primary/80 to-background hover:shadow-md ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="relative flex h-7 w-7 items-center justify-center">
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ring-1 ring-primary/20">
          <Avatar
            address={`${account?.id.toString('hex')}` as `0x${string}`}
            name={ensName || undefined}
            size={24}
          />
        </div>
      </div>
      <span className="font-medium tracking-tight">{ensName || truncatedAddress}</span>
      <ChevronDown
        className={`ml-1 h-4 w-4 text-muted-foreground/70 transition-all group-hover:text-primary ${isOpen ? 'rotate-180' : ''}`}
      />
    </Button>
  );
}

export function ConnectWallet() {
  //   const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { account } = useChromiaAccount();

  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Not render content until the client is mounted
  // But still maintain the space on the UI to avoid layout shift
  //   if (!mounted) {
  //     return <div className="h-9 w-44" />;
  //   }

  if (!account?.id.toString('hex')) {
    return <></>;
  }

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, isConnecting, ensName, address }) => {
        if (isConnected) {
          return (
            <div className="relative" ref={popoverRef}>
              {/* Mobile view */}
              <ConnectedButton
                className="w-full"
                address={address}
                ensName={ensName}
                isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
              />

              {/* Popover Content */}
              {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] z-[9999] border rounded-xl shadow-lg">
                  <div className="rounded-2xl bg-background/70 backdrop-blur-md shadow-lg border border-primary/10 p-5">
                    <WalletActions />
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Button
            variant="default"
            size="default"
            onClick={show}
            disabled={isConnecting}
            className="group relative min-w-44 overflow-hidden bg-gradient-to-r from-primary via-primary to-primary hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform group-hover:translate-x-full"></div>
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <span className="font-medium tracking-tight">Connecting...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 font-medium tracking-tight">
                Connect Wallet
              </span>
            )}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
