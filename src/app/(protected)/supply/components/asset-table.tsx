'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/common/table';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { useRouter } from 'next/navigation';

interface AssetTableProps {
  title: string;
  showCollateral?: boolean;
}

const demoRows = [
  { name: 'WBTC', balance: '0', apy: '<0.001%' },
  { name: 'ETH', balance: '0', apy: '<0.001%' },
  { name: 'USDC', balance: '0', apy: '<0.001%' },
  { name: 'DAI', balance: '0', apy: '<0.001%' },
  { name: 'LINK', balance: '0', apy: '<0.001%' },
  { name: 'ARB', balance: '0', apy: '<0.001%' },
];

export const AssetTable: React.FC<AssetTableProps> = ({ title, showCollateral = false }) => {
  const router = useRouter();

  const handleAssetClick = (asset: string) => {
    router.push(`/vault/${asset}`);
  };

  return (
    <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
      <Typography variant="h4" weight="semibold" className="text-lg sm:text-xl">
        {title}
      </Typography>
      <div className="rounded bg-accent/30 mt-2 sm:mt-2.5 p-2 sm:p-2.5">
        <Typography variant="small" color="submerged">
          Your Ethereum wallet is empty. Purchase or transfer assets.
        </Typography>
      </div>
      <div className="mt-3 sm:mt-5 overflow-x-auto -mx-3 sm:-mx-0 px-3 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center min-w-[90px] sm:min-w-[110px]">
                <Typography variant="small" color="submerged">
                  Assets
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography variant="small" color="submerged">
                  Wallet balance
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography variant="small" color="submerged">
                  APY
                </Typography>
              </TableHead>
              {showCollateral && (
                <TableHead className="text-center">
                  <Typography variant="small" color="submerged">
                    Collateral
                  </Typography>
                </TableHead>
              )}
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demoRows.map((asset, i) => (
              <TableRow key={i}>
                {/* Asset Icon & Name */}
                <TableCell className="text-center p-2 sm:p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<svg width="70" height="25" viewBox="0 0 80 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 70px; height: 25px"> <circle cx="12" cy="12.5" r="12" fill="currentColor"></circle> <text fill="currentColor" xml:space="preserve" style="white-space: pre" font-family="Inter" font-size="16"><tspan x="30" y="18.3182">${asset.name}</tspan></text> </svg>`,
                    }}
                    className="mx-auto text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleAssetClick(asset.name)}
                  />
                </TableCell>
                <TableCell className="text-center p-2 sm:p-4">
                  <Typography variant="small">{asset.balance}</Typography>
                </TableCell>
                <TableCell className="text-center p-2 sm:p-4">
                  <Typography variant="small">{asset.apy}</Typography>
                </TableCell>
                {showCollateral && (
                  <TableCell className="text-center p-2 sm:p-4">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<svg width="70" height="19" viewBox="0 0 70 19" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 60px; height: 19px"> <circle cx="9" cy="9.5" r="9" fill="hsl(var(--muted))"></circle> <circle cx="22" cy="9.5" r="9" fill="hsl(var(--muted)/0.8)"></circle> <circle cx="35" cy="9.5" r="9" fill="hsl(var(--muted)/0.6)"></circle> <circle cx="48" cy="9.5" r="9" fill="hsl(var(--muted)/0.4)"></circle> <circle cx="61" cy="9.5" r="9" fill="hsl(var(--muted)/0.2)"></circle> </svg>`,
                      }}
                      className="mx-auto text-muted-foreground"
                    />
                    <Typography variant="small">+4</Typography>
                  </TableCell>
                )}
                <TableCell className="text-center p-2 sm:p-4">
                  <Button
                    variant="default"
                    size="default"
                    onClick={e => {
                      e.stopPropagation();
                      handleAssetClick(asset.name);
                    }}
                    aria-label={`Supply ${asset.name}`}
                    className="rounded-full px-3 sm:px-5 py-2 sm:py-2.5"
                  >
                    Supply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
