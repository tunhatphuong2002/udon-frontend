'use client';

import React from 'react';
import { Info, ExternalLink, ArrowRight } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/common/alert';
import Link from 'next/link';
import { cn } from '@/utils/tailwind';
import { getWithdrawOptions } from '@/utils/bridge-constants';

// Pool data for Quick Withdraw
const quickWithdrawPools = [
  {
    id: 'color-pool',
    name: 'Color Pool DEX',
    shortName: 'CP',
    rate: '~ 0.9950 CHR',
    tvl: '$4,852,187',
    action: 'https://dex.colorpool.xyz',
    gradient: 'from-purple-500 to-purple-600',
    textColor: 'text-white',
  },
];

export const QuickWithdraw: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Info for Quick Withdraw */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Quick Withdraw via DEX</AlertTitle>
        <AlertDescription>
          Quick withdraw uses decentralized exchanges for instant liquidity. Rates may vary based on
          market conditions and available liquidity in each pool.
        </AlertDescription>
      </Alert>
      {/* Step-by-Step Guide */}
      <Typography variant="h4" weight="semibold" className="text-xl tracking-tight">
        Quick Withdraw Guideline
      </Typography>
      <div
        className="space-y-4 cursor-pointer"
        onClick={() => {
          const withdrawColorPool = getWithdrawOptions('CHR')[1];
          window.open(withdrawColorPool.url, '_blank');
        }}
      >
        {/* Step 1 */}
        <div
          className={cn(
            'group relative p-4 rounded-lg border border-border/50',
            'bg-gradient-to-r from-card/20 to-card/10 backdrop-blur-sm',
            'hover:border-primary/30 hover:from-primary/5 hover:to-primary/10',
            'transition-all duration-300 ease-out shadow-sm'
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] text-black font-medium '
              )}
            >
              <Typography className="text-bold text-black">1</Typography>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div>
                <Typography weight="semibold" className="text-base">
                  Transfer stCHR to Color Pool DEX
                </Typography>
                <Typography color="submerged" className="mt-1 text-sm">
                  Use cross-chain transfer to move your stCHR from UdonFi to Color Pool DEX.
                </Typography>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end w-20">
                <div className="text-xs px-2 py-1 rounded-md font-medium bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] text-black">
                  Cross-chain
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          </div>
        </div>
        {/* Step 2 */}
        <div
          className={cn(
            'group relative p-4 rounded-lg border border-border/50',
            'bg-gradient-to-r from-card/20 to-card/10 backdrop-blur-sm',
            'hover:border-primary/30 hover:from-primary/5 hover:to-primary/10',
            'transition-all duration-300 ease-out shadow-sm  cursor-pointer'
          )}
          onClick={() => window.open('https://dex.colorpool.xyz/swap', '_blank')}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                'bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] text-black font-medium '
              )}
            >
              <Typography className="text-bold text-black">2</Typography>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div>
                <Typography weight="semibold" className="text-base">
                  Swap stCHR to CHR
                </Typography>
                <Typography color="submerged" className="mt-1 text-sm">
                  Swap your stCHR for CHR directly on the Color Pool DEX.
                </Typography>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end w-20">
                <div className="text-xs px-2 py-1 rounded-md font-medium bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] text-black">
                  Swap Asset
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pool Options */}
      <div className="space-y-3">
        <Typography variant="h4" weight="semibold" className="text-xl tracking-tight">
          Quick Withdraw Info
        </Typography>
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
    </div>
  );
};
