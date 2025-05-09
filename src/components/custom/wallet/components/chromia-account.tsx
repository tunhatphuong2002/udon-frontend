'use client';

import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { Avatar } from 'connectkit';
import { Typography } from '@/components/common/typography';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';

export function ChromiaAccount() {
  const [copiedChromia, setCopiedChromia] = useState(false);
  const { account } = useChromiaAccount();

  // Reset copy state after 3 seconds
  useEffect(() => {
    if (copiedChromia) {
      const timer = setTimeout(() => setCopiedChromia(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copiedChromia]);

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedChromia(true);
    }
  };

  // Hàm rút gọn chuỗi (như hex address)
  const truncateAddress = (address: string, startChars = 6, endChars = 4) => {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  if (!account?.id) return null;

  const accountId = account?.id.toString('hex');
  const truncatedAccountId = truncateAddress(accountId.toUpperCase());

  return (
    <div className="flex flex-col items-center space-y-3">
      <Typography variant="h4" className="font-semibold">
        Chromia Account
      </Typography>

      <div className="relative h-16 w-16">
        <Avatar size={60} address={`0x${accountId}`} />
      </div>

      <div className="flex items-center space-x-2">
        <Typography variant="p" className="font-bold">
          {truncatedAccountId}
        </Typography>
        <button
          onClick={() => copyToClipboard(accountId.toUpperCase())}
          className="text-primary/70 hover:text-primary transition-colors cursor-pointer"
        >
          {copiedChromia ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
