'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SortableTable, type ColumnDef } from '@/components/common/sortable-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';
import { BorrowDialog } from './borrow-dialog';

// Define type for borrow assets
interface BorrowAsset {
  id: Buffer<ArrayBufferLike>;
  symbol: string;
  name: string;
  available?: string;
  apy?: string;
  iconUrl: string;
  maxAmount?: number;
  price?: number;
  canBeCollateral?: boolean;
  decimals?: number;
}

interface BorrowTableProps {
  title: string;
  assets: BorrowAsset[];
  isLoading: boolean;
  mutateAssets: () => void;
}

export const BorrowTable: React.FC<BorrowTableProps> = ({
  title,
  assets,
  isLoading,
  mutateAssets,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<BorrowAsset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // Prepare assets with borrow-specific properties
  const borrowAssets = assets.map(asset => ({
    ...asset,
    available: asset.available || '0.0045852', // Default available
    apy: asset.apy || '<0.001%', // Default APY
    maxAmount: asset.maxAmount || 0.0045852, // Default max amount
  }));

  // Handle borrow button click
  const handleBorrowClick = (asset: BorrowAsset) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  // Handle asset click
  const handleAssetClick = (asset: string) => {
    router.push(`/vault/${asset}`);
  };

  // Render asset icon and symbol
  const renderAssetCell = (asset: BorrowAsset) => {
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

  // Define columns for the borrow table
  const borrowColumns: ColumnDef<BorrowAsset>[] = [
    {
      header: 'Assets',
      accessorKey: 'symbol',
      enableSorting: true,
      cell: ({ row }: { row: BorrowAsset }) => renderAssetCell(row),
    },
    {
      header: 'Available',
      accessorKey: 'available',
      enableSorting: true,
      cell: ({ row }: { row: BorrowAsset }) => <Typography>{row.available}</Typography>,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      enableSorting: true,
      cell: ({ row }: { row: BorrowAsset }) => (
        <Typography>${row.price != null ? row.price.toFixed(2) : '—'}</Typography>
      ),
    },
    {
      header: 'APY',
      accessorKey: 'apy',
      enableSorting: true,
      cell: ({ row }: { row: BorrowAsset }) => <Typography>{row.apy}</Typography>,
    },
    {
      header: '',
      accessorKey: 'symbol',
      enableSorting: false,
      cell: ({ row }: { row: BorrowAsset }) => (
        <div className="flex justify-end">
          <div className="flex flex-col gap-2">
            <Button
              variant="gradient"
              onClick={e => {
                e.stopPropagation();
                handleBorrowClick(row);
              }}
              aria-label={`Borrow ${row.symbol}`}
              className="w-[100px]"
            >
              Borrow
            </Button>

            <Button
              variant="outlineGradient"
              onClick={() => handleAssetClick(row.symbol)}
              aria-label={`Borrow ${row.symbol}`}
              className="w-[100px]"
            >
              Details
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
        <div className="flex justify-between items-center">
          <Typography variant="h4" weight="semibold" className="mb-4 text-2xl">
            {title}
          </Typography>
        </div>

        {(!borrowAssets || borrowAssets.length === 0) && !isLoading && (
          <div className="rounded bg-accent/30 mt-2 sm:mt-2.5 p-2 sm:p-2.5">
            <Typography variant="small" color="submerged">
              No assets available for borrowing at this time.
            </Typography>
          </div>
        )}

        <div className="mt-3 sm:mt-5">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : borrowAssets.length > 0 ? (
            <SortableTable<BorrowAsset>
              data={borrowAssets}
              columns={borrowColumns}
              pageSize={5}
              className="p-0 border-none"
            />
          ) : null}
        </div>
      </div>

      {selectedAsset && dialogOpen && (
        <BorrowDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          asset={{
            ...selectedAsset,
            available: selectedAsset.available || '0.0045852',
            apy: selectedAsset.apy || '<0.001%',
            maxAmount: selectedAsset.maxAmount || 0.0045852,
            decimals: selectedAsset.decimals || 18,
          }}
          mutateAssets={mutateAssets}
        />
      )}
    </>
  );
};
