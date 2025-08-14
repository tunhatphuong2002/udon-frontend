'use client';

import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import Link from 'next/link';

// Pool data for Quick Withdraw
const quickWithdrawPools = [
  {
    id: 'color-pool',
    name: 'Color Pool DEX',
    shortName: 'CP',
    rate: '~ 0.9950 APT',
    tvl: '$4,852,187',
    action: 'Go to Color Pool DEX',
    gradient: 'from-purple-500 to-purple-600',
    textColor: 'text-white',
  },
];

export const QuickWithdraw: React.FC = () => {
  return (
    <div className="space-y-6">
      <Typography weight="semibold" className="text-lg">
        Available Pools
      </Typography>

      {/* Pool Options */}
      <div className="space-y-3">
        {quickWithdrawPools.map(pool => (
          <div
            key={pool.id}
            className="bg-card rounded-xl p-4 border border-border hover:border-muted-foreground/30 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/logo/color-pool-dex.svg" alt="color-pool-dex" />
                  <AvatarFallback>{pool.shortName}</AvatarFallback>
                </Avatar>
                <div>
                  <Typography weight="semibold">{pool.name}</Typography>
                  <Link
                    href={pool.action}
                    className="flex flex-row items-center gap-1 text-primary hover:text-primary/80"
                  >
                    <Typography className="text-primary hover:text-primary/80" variant="small">
                      {pool.action}
                    </Typography>
                    <ExternalLink className="h-4 w-4 mb-1" />
                  </Link>
                </div>
              </div>
              <div className="text-right">
                <Typography className="text-muted-foreground">{pool.rate}</Typography>
                <Typography variant="small" className="text-muted-foreground">
                  TVL: {pool.tvl}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info for Quick Withdraw */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Quick Withdraw via DEX</AlertTitle>
        <AlertDescription>
          Quick withdraw uses decentralized exchanges for instant liquidity. Rates may vary based on
          market conditions and available liquidity in each pool.
        </AlertDescription>
      </Alert>
    </div>
  );
};
