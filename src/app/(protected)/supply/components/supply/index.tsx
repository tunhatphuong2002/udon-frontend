'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { ColumnDef, SortableTable } from '@/components/common/sortable-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';
import { SupplyDialog } from './dialog';

// Define type for supply assets
interface SupplyAsset {
  id: Buffer<ArrayBufferLike>;
  symbol: string;
  name: string;
  balance?: string;
  apy?: string;
  iconUrl: string;
  collateral?: boolean; // For collateral functionality
  maxAmount?: number;
  price?: number;
  decimals: number;
}

interface SupplyTableProps {
  title: string;
  showCollateral?: boolean;
  assets: SupplyAsset[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const SupplyTable: React.FC<SupplyTableProps> = ({
  title,
  showCollateral = false,
  assets,
  isLoading,
  onRefresh,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<SupplyAsset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // Prepare assets with supply-specific properties
  const supplyAssets = assets.map(asset => ({
    ...asset,
    balance: asset.balance || '0', // Default balance
    apy: asset.apy || '<0.001%', // Default APY
    maxAmount: asset.maxAmount || 10, // Default max amount
    collateral: asset.collateral || false, // Default collateral
  }));

  // Handle supply button click
  const handleSupplyClick = (asset: SupplyAsset) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  // Handle asset click (navigation)
  const handleAssetClick = (asset: string) => {
    router.push(`/vault/${asset}`);
  };

  // Render asset icon and symbol
  const renderAssetCell = (asset: SupplyAsset) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleAssetClick(asset.symbol)}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={asset.iconUrl} alt={asset.symbol} />
                <AvatarFallback>{asset.symbol.charAt(0)}</AvatarFallback>
              </Avatar>
              <Typography weight="medium">{asset.symbol}</Typography>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{asset.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Define columns for the supply table
  const supplyColumns: ColumnDef<SupplyAsset>[] = [
    {
      header: 'Assets',
      accessorKey: 'symbol',
      enableSorting: true,
      cell: ({ row }: { row: SupplyAsset }) => renderAssetCell(row),
    },
    {
      header: 'Wallet balance',
      accessorKey: 'balance',
      enableSorting: true,
      cell: ({ row }: { row: SupplyAsset }) => <Typography>{row.balance}</Typography>,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      enableSorting: true,
      cell: ({ row }: { row: SupplyAsset }) => (
        <Typography>${row.price != null ? row.price.toFixed(2) : '—'}</Typography>
      ),
    },
    {
      header: 'APY',
      accessorKey: 'apy',
      enableSorting: true,
      cell: ({ row }: { row: SupplyAsset }) => <Typography>{row.apy}</Typography>,
    },
    ...(showCollateral
      ? [
          {
            header: 'Collateral',
            accessorKey: 'collateral',
            enableSorting: false,
            cell: () => (
              <div className="flex flex-col items-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<svg width="70" height="19" viewBox="0 0 70 19" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 60px; height: 19px"> <circle cx="9" cy="9.5" r="9" fill="hsl(var(--muted))"></circle> <circle cx="22" cy="9.5" r="9" fill="hsl(var(--muted)/0.8)"></circle> <circle cx="35" cy="9.5" r="9" fill="hsl(var(--muted)/0.6)"></circle> <circle cx="48" cy="9.5" r="9" fill="hsl(var(--muted)/0.4)"></circle> <circle cx="61" cy="9.5" r="9" fill="hsl(var(--muted)/0.2)"></circle> </svg>`,
                  }}
                  className="mx-auto text-muted-foreground"
                />
                <Typography variant="small">+4</Typography>
              </div>
            ),
          } as ColumnDef<SupplyAsset>,
        ]
      : []),
    {
      header: '',
      accessorKey: 'symbol',
      enableSorting: false,
      cell: ({ row }: { row: SupplyAsset }) => (
        <div className="flex items-center w-full justify-end">
          <Button
            variant="default"
            size="default"
            onClick={e => {
              e.stopPropagation();
              handleSupplyClick(row);
            }}
            aria-label={`Supply ${row.symbol}`}
            className="rounded-full px-3 sm:px-5 py-2 sm:py-2.5"
          >
            Supply
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
        <div className="flex justify-between items-center">
          <Typography variant="h4" weight="semibold" className="text-lg sm:text-xl">
            {title}
          </Typography>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>

        {(!supplyAssets || supplyAssets.length === 0) && !isLoading && (
          <div className="rounded bg-accent/30 mt-2 sm:mt-2.5 p-2 sm:p-2.5">
            <Typography variant="small" color="submerged">
              Your Ethereum wallet is empty. Purchase or transfer assets.
            </Typography>
          </div>
        )}

        <div className="mt-3 sm:mt-5">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : supplyAssets.length > 0 ? (
            <SortableTable<SupplyAsset>
              data={supplyAssets}
              columns={supplyColumns}
              pageSize={5}
              className="p-0 border-none"
            />
          ) : null}
        </div>
      </div>

      {selectedAsset && (
        <SupplyDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          asset={{
            ...selectedAsset,
            balance: selectedAsset.balance || '0',
            apy: selectedAsset.apy || '<0.001%',
            maxAmount: selectedAsset.maxAmount || 10,
          }}
        />
      )}
    </>
  );
};
