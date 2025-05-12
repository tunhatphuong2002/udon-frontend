'use client';

import React from 'react';
import { SortableTable, ColumnDef } from '@/components/common/sortable-table';
import { Button } from '@/components/common/button';
import Image from 'next/image';
import { Typography } from '@/components/common/typography';
import { Badge } from '@/components/common/badge';

interface BorrowPosition {
  iconUrl: string;
  asset: string;
  walletBalance: number;
  walletBalanceUsd: number;
  apy: number;
  collateral: boolean;
}

const columns: ColumnDef<BorrowPosition>[] = [
  {
    header: 'Assets',
    accessorKey: 'asset',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image src={row.iconUrl} alt={row.asset} width={32} height={32} className="rounded-full" />
        <Typography weight="medium">{row.asset}</Typography>
      </div>
    ),
  },
  {
    header: 'Balance',
    accessorKey: 'walletBalance',
    cell: ({ row }) => (
      <div>
        <Typography weight="medium">{row.walletBalance.toFixed(2)}</Typography>
        <Typography variant="small" color="submerged">
          ${row.walletBalanceUsd.toFixed(2)}
        </Typography>
      </div>
    ),
  },
  {
    header: 'APY',
    accessorKey: 'apy',
    cell: ({ row }) => <Typography weight="medium">{row.apy.toFixed(2)}%</Typography>,
  },
  {
    header: 'Collateral',
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

const mockData: BorrowPosition[] = [
  {
    iconUrl: '/images/wbtc.png',
    asset: 'WBTC',
    walletBalance: 10,
    walletBalanceUsd: 10,
    apy: 2.37,
    collateral: true,
  },
  {
    iconUrl: '/images/wbtc.png',
    asset: 'WBTC',
    walletBalance: 10,
    walletBalanceUsd: 10,
    apy: 2.37,
    collateral: false,
  },
];

export const BorrowPositionTable: React.FC = () => (
  <div className="rounded-2xl border border-border bg-card p-6">
    <Typography variant="h4" weight="semibold" className="mb-4 text-2xl">
      Your Borrow
    </Typography>
    <div className="flex gap-3 mb-4">
      <Badge variant="outline" className="text-base px-3">
        Balance: $10.00
      </Badge>
      <Badge variant="outline" className="text-base px-3">
        APY: 2.71%
      </Badge>
      <Badge variant="outline" className="text-base px-3">
        Collateral: $10.00
      </Badge>
    </div>
    <SortableTable
      data={mockData}
      columns={columns}
      pageSize={4}
      className="bg-transparent border-none"
    />
  </div>
);
