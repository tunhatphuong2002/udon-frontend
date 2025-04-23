'use client';

import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { Avatar } from 'connectkit';
import { useEnsName, useAccount } from 'wagmi';

export function WalletInfo() {
  const [copiedWallet, setCopiedWallet] = useState(false);
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (copiedWallet) {
      const timer = setTimeout(() => setCopiedWallet(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedWallet]);

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(true);
    }
  };

  // Function to truncate address
  const truncateAddress = (address: string, startChars = 6, endChars = 4) => {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  if (!address) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-primary/50 to-primary/30 p-4 shadow-sm backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground/80">Wallet Address</p>
            <div className="h-1.5 w-1.5 rounded-full bg-success/80 ring-2 ring-success/20"></div>
          </div>
          <button
            onClick={() => copyToClipboard(address)}
            className="text-primary/70 hover:text-primary transition-colors cursor-pointer"
          >
            {copiedWallet ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Avatar address={address} size={24} />
          <p className="text-sm font-medium tracking-tight">
            {ensName || truncateAddress(address)}
          </p>
        </div>
      </div>
    </div>
  );
}
