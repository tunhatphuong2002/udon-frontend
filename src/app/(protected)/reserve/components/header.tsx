import React from 'react';
import { Typography } from '@/components/common/typography';
import { StatCard } from '@/app/(protected)/reserve/components/stat-card';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/common/button';
import { UserReserveData } from '@/app/(protected)/dashboard/types';
import Link from 'next/link';
import CountUp from '@/components/common/count-up';

interface VaultHeaderProps {
  reserve?: UserReserveData;
}

export const VaultHeader: React.FC<VaultHeaderProps> = ({ reserve }) => {
  return (
    <div className="w-full">
      <div className="fcol gap-3">
        <Link href="/dashboard">
          <Button
            variant="secondary"
            className="w-10 h-10 p-0 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Button>
        </Link>
        <Typography variant="h1" weight="medium" className="text-3xl md:text-7xl lg:text-13xl">
          {reserve ? (
            <>
              {reserve.symbol} <span className="text-submerged">Reserve</span>
            </>
          ) : (
            'Loading...'
          )}
        </Typography>
      </div>

      <Typography className="mt-3 text-muted-foreground">
        {reserve
          ? `The ${reserve.symbol} reserve provides a set of liquid collateral markets with an optimized risk-adjusted return.`
          : 'Loading reserve details...'}
      </Typography>

      <div className="flex w-full flex-wrap gap-3 mt-6">
        <StatCard
          title="Total Supply"
          value={
            reserve ? (
              <>
                <CountUp value={reserve.totalSupply} decimals={2} className="font-medium" />
                <span className="text-muted-foreground ml-1">{reserve.symbol}</span>
              </>
            ) : (
              'Loading...'
            )
          }
          icon={reserve?.iconUrl || '/images/tokens/default.png'}
          className="bg-card border-border"
        />
        <StatCard
          title="Available Liquidity"
          value={
            reserve ? (
              <>
                <CountUp value={reserve.availableLiquidity} decimals={2} className="font-medium" />
                <span className="text-muted-foreground ml-1">{reserve.symbol}</span>
              </>
            ) : (
              'Loading...'
            )
          }
          icon={reserve?.iconUrl || '/images/tokens/default.png'}
          className="bg-card border-border"
        />
        <StatCard
          title="Price"
          value={
            reserve ? (
              <>
                <span className="font-medium">{reserve.price.toFixed(2)}</span>
                <span className="text-muted-foreground ml-1">USD</span>
              </>
            ) : (
              'Loading...'
            )
          }
          icon={reserve?.iconUrl || '/images/tokens/default.png'}
          className="bg-card border-border"
        />
        <StatCard
          title="Supply APY"
          value={
            reserve ? (
              <>
                <CountUp value={reserve.supplyAPY} decimals={2} className="font-medium" />
                <span className="text-muted-foreground ml-1">%</span>
              </>
            ) : (
              'Loading...'
            )
          }
          icon={reserve?.iconUrl || '/images/tokens/default.png'}
          className="bg-card border-border"
        />
      </div>
    </div>
  );
};
