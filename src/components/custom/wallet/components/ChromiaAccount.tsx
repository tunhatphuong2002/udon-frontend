'use client';

import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { Avatar } from 'connectkit';
import { useFtAccounts, useFtSession } from '@chromia/react';
import { publicClientConfig as clientConfig } from '@/configs/client';

export function ChromiaAccount() {
  const [copiedChromia, setCopiedChromia] = useState(false);
  const { data: ftAccounts } = useFtAccounts({ clientConfig });
  const { data: session } = useFtSession(
    ftAccounts?.length ? { clientConfig, account: ftAccounts[0] } : null
  );

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
    return `x${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  if (!session?.account.id) return null;

  const accountId = session.account.id.toString('hex');
  const truncatedAccountId = truncateAddress(accountId);

  return (
    <div className="flex flex-col items-center space-y-3">
      <h2 className="text-lg font-semibold">Chromia Account</h2>

      <div className="relative h-16 w-16">
        {/* <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-400 to-rose-200 blur-[1px]"></div> */}
        {/* <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-100 ring-1 ring-rose-200"> */}
        <Avatar size={60} address={`0x${accountId}`} />
        {/* </div> */}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{truncatedAccountId}</span>
        <button
          onClick={() => copyToClipboard(accountId)}
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
