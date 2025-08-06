'use client';

import React from 'react';
import { Typography } from '@/components/common/typography';
import { Skeleton } from '@/components/common/skeleton';
import { LiquidationCall } from '@/hooks/contracts/queries/use-get-liquidated';
import { formatDistanceToNow } from 'date-fns';
import { ColumnDef, SortableTable } from '@/components/common/sortable-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { getAccountId } from '@/utils/get-tx-link';

interface LiquidatedTableProps {
  liquidatedData: LiquidationCall[];
  debtAsset?: { symbol?: string; name?: string; iconUrl?: string } | null;
  collateralAsset?: { symbol?: string; name?: string; iconUrl?: string } | null;
  isLoading: boolean;
}

export const LiquidatedTable: React.FC<LiquidatedTableProps> = ({
  liquidatedData,
  debtAsset,
  collateralAsset,
  isLoading,
}) => {
  // Define columns for the liquidated table
  const liquidatedColumns: ColumnDef<LiquidationCall>[] = [
    {
      header: 'Event',
      accessorKey: 'timestamp',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Typography weight="semibold" className="text-primary">
              Liquidation
            </Typography>
            <Typography variant="small" color="submerged">
              {formatDistanceToNow(new Date(row.timestamp), { addSuffix: true })}
            </Typography>
          </div>
        </div>
      ),
      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
        ),
      },
    },
    {
      header: 'Debt Asset',
      accessorKey: 'debtAssetId',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={debtAsset?.iconUrl} alt={debtAsset?.symbol || 'Asset'} />
            <AvatarFallback>{debtAsset?.symbol?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography weight="medium">{debtAsset?.symbol || 'Unknown'}</Typography>
            <Typography variant="small" color="submerged">
              {row.debtToCover.toFixed(6)} repaid
            </Typography>
          </div>
        </div>
      ),
      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
        ),
      },
    },
    {
      header: 'Collateral Asset',
      accessorKey: 'collateralAssetId',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={collateralAsset?.iconUrl} alt={collateralAsset?.symbol || 'Asset'} />
            <AvatarFallback>{collateralAsset?.symbol?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography weight="medium">{collateralAsset?.symbol || 'Unknown'}</Typography>
            <Typography variant="small" color="submerged">
              {row.liquidatedCollateralAmount.toFixed(6)} liquidated
            </Typography>
          </div>
        </div>
      ),
      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
        ),
      },
    },
    {
      header: 'Liquidator',
      accessorKey: 'liquidatorId',
      enableSorting: true,
      cell: ({ row }) => (
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <a
              href={getAccountId(row.liquidatorId.toString('hex'))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Typography variant="small" className="font-mono">
                {row.liquidatorId.toString('hex').slice(0, 8)}...
              </Typography>
              <ExternalLink className="w-3 h-3" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>View on Explorer</p>
          </TooltipContent>
        </Tooltip>
      ),
      meta: {
        skeleton: (
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-3 h-3" />
          </div>
        ),
      },
    },
    {
      header: 'Liquidator Received',
      accessorKey: 'receiveAAsset',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={row.receiveAAsset ? debtAsset?.iconUrl : collateralAsset?.iconUrl}
              alt={row.receiveAAsset ? debtAsset?.symbol : collateralAsset?.symbol || 'Asset'}
            />
            <AvatarFallback>
              {row.receiveAAsset
                ? debtAsset?.symbol?.charAt(0)
                : collateralAsset?.symbol?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography weight="medium">{row.receiveAAsset ? 'aTokens' : 'Underlying'}</Typography>
            <Typography variant="small" color="submerged">
              {row.receiveAAsset ? debtAsset?.symbol : collateralAsset?.symbol || 'Unknown'}
            </Typography>
          </div>
        </div>
      ),
      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
        ),
      },
    },
    // {
    //   header: 'Transaction',
    //   accessorKey: 'timestamp',
    //   enableSorting: true,
    //   cell: ({ row }) => (
    //     <Tooltip delayDuration={100}>
    //       <TooltipTrigger asChild>
    //         <a
    //           href={getAssetLink(row.debtAssetId.toString('hex'))}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
    //         >
    //           <Typography variant="small" className="font-mono">
    //             {row.debtAssetId.toString('hex').slice(0, 8)}...
    //           </Typography>
    //           <ExternalLink className="w-3 h-3" />
    //         </a>
    //       </TooltipTrigger>
    //       <TooltipContent side="bottom">
    //         <p>View on Explorer</p>
    //       </TooltipContent>
    //     </Tooltip>
    //   ),
    //   meta: {
    //     skeleton: (
    //       <div className="flex items-center gap-2">
    //         <Skeleton className="w-16 h-4" />
    //         <Skeleton className="w-3 h-3" />
    //       </div>
    //     ),
    //   },
    // },
  ];

  if (!liquidatedData || liquidatedData.length === 0) {
    return (
      <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" weight="semibold" className="text-2xl">
            Liquidation History
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <Typography variant="h4" weight="semibold" className="mb-2">
            No Liquidations
          </Typography>
          <Typography variant="p" color="submerged" className="max-w-md text-center">
            You haven&apos;t been liquidated. Keep your health factor above 1 to avoid liquidation.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" weight="semibold" className="text-2xl">
          Liquidation History
        </Typography>
      </div>

      <div className="mt-3 sm:mt-5">
        <SortableTable<LiquidationCall>
          data={liquidatedData}
          columns={liquidatedColumns}
          className="p-0 border-none"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
