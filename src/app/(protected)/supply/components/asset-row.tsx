'use client';

import React from 'react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';

interface AssetRowProps {
  name: string;
  balance: string;
  apy: string;
  showCollateral?: boolean;
  onSupply?: (asset: string) => void;
}

export const AssetRow: React.FC<AssetRowProps> = ({
  name,
  balance,
  apy,
  showCollateral = false,
  onSupply,
}) => {
  return (
    <div className="flex items-center px-0 py-2.5">
      <div className="flex-1 text-center text-muted-foreground">
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg id="384:1325" width="80" height="25" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="asset-icon" style="width: 80px; height: 25px"> <circle cx="12" cy="12.5" r="12" fill="currentColor"></circle> <text fill="currentColor" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="16" letter-spacing="0em"><tspan x="30" y="18.3182">${name}</tspan></text> </svg>`,
          }}
        />
      </div>
      <div className="flex-1 text-center">
        <Typography variant="p" color="submerged">
          {balance}
        </Typography>
      </div>
      <div className="flex-1 text-center">
        <Typography variant="p" color="submerged">
          {apy}
        </Typography>
      </div>
      {showCollateral && (
        <div className="flex-1 text-center">
          <div
            dangerouslySetInnerHTML={{
              __html: `<svg id="384:1331" width="70" height="19" viewBox="0 0 70 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="collateral-icon" style="width: 70px; height: 19px"> <circle cx="9" cy="9.5" r="9" fill="hsl(var(--muted))"></circle> <circle cx="22" cy="9.5" r="9" fill="hsl(var(--muted)/0.8)"></circle> <circle cx="35" cy="9.5" r="9" fill="hsl(var(--muted)/0.6)"></circle> <circle cx="48" cy="9.5" r="9" fill="hsl(var(--muted)/0.4)"></circle> <circle cx="61" cy="9.5" r="9" fill="hsl(var(--muted)/0.2)"></circle> </svg>`,
            }}
          />
          <Typography variant="p" color="submerged">
            +4
          </Typography>
        </div>
      )}
      <div className="flex-1 text-center">
        <Button
          variant="default"
          size="default"
          onClick={() => onSupply && onSupply(name)}
          className="rounded-full"
        >
          Supply
        </Button>
      </div>
    </div>
  );
};
