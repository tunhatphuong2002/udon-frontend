import React from 'react';
import { Typography } from '@/components/common/typography';
import Image from 'next/image';
import { Button } from '@/components/common/button';
import { useRouter } from 'next/navigation';
import { NetworkBadge } from './network-badge';
import { ExternalLinkIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-[20] flex flex-row px-4 sm:px-16 justify-between items-center py-4 bg-white/0 backdrop-blur-md border-b border-border">
      <div className="w-[94px] h-[46px] relative cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo/logo-shorttext-black.png" alt="Logo" fill className="object-contain" />
        <NetworkBadge network="mainnet" />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="gradient"
          onClick={() => window.open('https://testnet.udonfi.xyz/', '_blank')}
          className="text-sm"
        >
          <ExternalLinkIcon className="w-4 h-4 mr-1" />
          Try Testnet
        </Button>
        <Button
          variant="gradient"
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          <Typography size="base" weight="medium">
            Launch App
          </Typography>
        </Button>
      </div>
    </div>
  );
};
