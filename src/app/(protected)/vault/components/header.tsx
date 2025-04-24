import React from 'react';
import { Typography } from '@/components/common/typography';
import { StatCard } from '@/app/(protected)/vault/components/stat-card';
import { ChevronLeft } from 'lucide-react';

export const VaultHeader: React.FC = () => {
  return (
    <div className="w-full">
      <div className="gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </div>
        <Typography variant="h1" weight="medium" className="text-3xl md:text-4xl lg:text-5xl">
          Capital <span className="text-muted-foreground">Usual USDC</span>
        </Typography>
      </div>

      <Typography className="mt-3 text-muted-foreground">
        The Capital Usual USDC provides a set of liquid collateral markets with an optimized
        risk-adjusted return through an active rebalancing strategy.
      </Typography>

      <div className="flex w-full flex-wrap gap-3 mt-6">
        <StatCard
          title="Total Deposits (USDC)"
          value={
            <>
              <span className="font-medium">197.45</span>
              <span className="text-muted-foreground">M</span>
            </>
          }
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/b0aeedec6c658b74b47cecaa86ccdec5a16a8bdf?placeholderIfAbsent=true"
          className="bg-card border-border"
        />
        <StatCard
          title="Liquidity (USDC)"
          value={
            <>
              <span className="font-medium">197.45</span>
              <span className="text-muted-foreground">M</span>
            </>
          }
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/9eafa2550084771d0d96d97f96542a64278ae991?placeholderIfAbsent=true"
          className="bg-card border-border"
        />
        <StatCard
          title="Disclosures"
          value={
            <>
              <span className="font-medium">197.45</span>
              <span className="text-muted-foreground">M</span>
            </>
          }
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/7517c99d64c1641ac825fa0e87531d245c9e4df7?placeholderIfAbsent=true"
          className="bg-card border-border"
        />
        <StatCard
          title="APY"
          value={
            <>
              <span className="font-medium">7.07</span>
              <span className="text-muted-foreground">%</span>
            </>
          }
          icon="https://cdn.builder.io/api/v1/image/assets/a49eb3d9dab54612b6a60c9b4c26d13d/817d9cae4136aebc4e41b61fdb0664c287188928?placeholderIfAbsent=true"
          className="bg-card border-border"
        />
      </div>
    </div>
  );
};
