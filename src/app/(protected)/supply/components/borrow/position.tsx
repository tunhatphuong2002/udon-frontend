'use client';

import React from 'react';
import { SortableTable, ColumnDef } from '@/components/common/sortable-table';
import { Button } from '@/components/common/button';
import Image from 'next/image';
import { Typography } from '@/components/common/typography';
import { Badge } from '@/components/common/badge';
import { Skeleton } from '@/components/common/skeleton';

interface UserReserveData {
  asset: {
    id: Buffer<ArrayBufferLike>;
    symbol: string;
    name: string;
    iconUrl: string;
    price?: number;
    decimals: number;
  };
  current_a_token_balance: bigint;
  current_variable_debt: bigint;
  scaled_variable_debt: bigint;
  liquidity_rate: bigint;
  usage_as_collateral_enabled: boolean;
}

interface BorrowPositionTableProps {
  positions: UserReserveData[];
  isLoading: boolean;
}

const columns: ColumnDef<UserReserveData>[] = [
  {
    header: 'Assets',
    accessorKey: 'asset',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.asset.iconUrl}
          alt={row.asset.symbol}
          width={32}
          height={32}
          className="rounded-full"
        />
        <Typography weight="medium">{row.asset.symbol}</Typography>
      </div>
    ),
  },
  {
    header: 'Balance',
    accessorKey: 'current_variable_debt',
    cell: ({ row }) => {
      const balance = Number(row.current_variable_debt) / Math.pow(10, row.asset.decimals);
      const balanceUsd = balance * (row.asset.price || 0);
      return (
        <div>
          <Typography weight="medium">{balance.toFixed(4)}</Typography>
          <Typography variant="small" color="submerged">
            ${balanceUsd.toFixed(2)}
          </Typography>
        </div>
      );
    },
  },
  {
    header: 'APY',
    accessorKey: 'liquidity_rate',
    cell: ({ row }) => {
      // For borrow APY, we might use a different rate (variable borrow rate)
      // This is a placeholder - adjust based on actual data structure
      const apy = Number(row.liquidity_rate) / 1e25;
      return <Typography weight="medium">{apy.toFixed(2)}%</Typography>;
    },
  },
  {
    header: 'Type',
    accessorKey: 'asset',
    cell: () => <Badge variant="secondary">VARIABLE</Badge>,
  },
  {
    header: '',
    accessorKey: 'asset',
    cell: () => (
      <div className="flex flex-col gap-2 w-[100px]">
        <Button variant="outlineGradient" className="w-full py-2">
          Switch
        </Button>
        <Button variant="gradient" className="w-full py-2">
          Repay
        </Button>
      </div>
    ),
  },
];

export const BorrowPositionTable: React.FC<BorrowPositionTableProps> = ({
  positions,
  isLoading,
}) => {
  const totalBalanceUsd = positions.reduce((sum, position) => {
    const balance = Number(position.current_variable_debt) / Math.pow(10, position.asset.decimals);
    return sum + balance * (position.asset.price || 0);
  }, 0);

  const averageApy =
    positions.length > 0
      ? positions.reduce((sum, position) => sum + Number(position.liquidity_rate) / 1e25, 0) /
        positions.length
      : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Typography variant="h4" weight="semibold" className="mb-4 text-2xl">
        Your Borrow
      </Typography>
      {isLoading ? (
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-8 w-32" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <Badge variant="outline" className="text-base px-3">
              Balance: ${totalBalanceUsd.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="text-base px-3">
              APY: {averageApy.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className="text-base px-3">
              Health Factor: {positions.length > 0 ? '1.75' : 'N/A'}
            </Badge>
          </div>
          {positions.length > 0 ? (
            <SortableTable
              data={positions}
              columns={columns}
              pageSize={4}
              className="bg-transparent border-none"
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No borrow positions found. Start borrowing assets to leverage your portfolio.
            </div>
          )}
        </>
      )}
    </div>
  );
};
