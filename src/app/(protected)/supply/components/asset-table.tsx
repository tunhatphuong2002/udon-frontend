'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { useRouter } from 'next/navigation';
import { useChromiaQuery } from '@/hooks/configs/chromia-hooks';
import { Asset, PaginatedEntity } from '@chromia/ft4';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { SortableTable, type ColumnDef } from '@/components/common/sortable-table';

// Define types for supply and borrow assets
interface SupplyAsset {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  apy: string;
  iconUrl: string;
  collateral?: boolean; // For collateral functionality
}

interface BorrowAsset {
  id: string;
  symbol: string;
  name: string;
  available: string;
  apy: string;
  iconUrl: string;
}

interface AssetTableProps {
  title: string;
  type: 'supply' | 'borrow';
  showCollateral?: boolean;
}

export const AssetTable: React.FC<AssetTableProps> = ({ title, type, showCollateral = false }) => {
  // Query for supply assets
  const {
    data: supplyAssetsData,
    isLoading: isLoadingSupply,
    error: supplyError,
    mutate: refetchSupply,
  } = useChromiaQuery<string, Record<string, unknown>, PaginatedEntity<Asset>>({
    queryName: '.get_assets_by_type',
    queryParams: {
      type: 'ft4',
      page_size: null,
      page_cursor: null,
    },
  });

  // Query for borrow assets
  const {
    data: borrowAssetsData,
    isLoading: isLoadingBorrow,
    error: borrowError,
    mutate: refetchBorrow,
  } = useChromiaQuery<string, Record<string, unknown>, PaginatedEntity<Asset>>({
    queryName: 'ft4.get_assets_by_type', // This would be a different query in a real implementation
    queryParams: {
      type: 'ft4',
      page_size: null,
      page_cursor: null,
    },
  });

  // Combined loading and error states based on the active type
  const isLoading = type === 'supply' ? isLoadingSupply : isLoadingBorrow;
  const error = type === 'supply' ? supplyError : borrowError;

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load ${type} assets. Please try again.`);
    }
  }, [error, type]);

  const router = useRouter();

  // Handle refresh based on type
  const handleRefresh = () => {
    if (type === 'supply') {
      refetchSupply();
    } else {
      refetchBorrow();
    }
    toast(`Refreshing ${type} assets...`);
  };

  // Transform API data into the format needed by our table
  const transformData = () => {
    if (type === 'supply' && supplyAssetsData?.data) {
      return supplyAssetsData.data.map(asset => ({
        id: asset.id.toString(),
        symbol: asset.symbol,
        name: asset.name,
        balance: '0', // This would come from a balance API in a real implementation
        apy: '<0.001%', // This would come from an APY calculation in a real implementation
        iconUrl: asset.iconUrl,
        collateral: false, // Default value
      })) as SupplyAsset[];
    } else if (type === 'borrow' && borrowAssetsData?.data) {
      return borrowAssetsData.data.map(asset => ({
        id: asset.id.toString(),
        symbol: asset.symbol,
        name: asset.name,
        available: '$0', // This would come from availability calculation in a real implementation
        apy: '<0.001%', // This would come from an APY calculation in a real implementation
        iconUrl: asset.iconUrl,
      })) as BorrowAsset[];
    }
    return [];
  };

  // Handle asset click
  const handleAssetClick = (asset: string) => {
    router.push(`/vault/${asset}`);
  };

  // Render asset icon and symbol
  const renderAssetCell = (asset: SupplyAsset | BorrowAsset) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted-foreground">
          {asset.iconUrl ? (
            <img src={asset.iconUrl} alt={asset.symbol} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-background">
              {asset.symbol.charAt(0)}
            </div>
          )}
        </div>
        <div
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => handleAssetClick(asset.symbol)}
        >
          <Typography weight="medium">{asset.symbol}</Typography>
        </div>
      </div>
    );
  };

  // Define columns for the supply table
  const supplyColumns: ColumnDef<SupplyAsset>[] = [
    {
      header: 'Assets',
      accessorKey: 'symbol',
      enableSorting: true,
      cell: ({ row }) => renderAssetCell(row),
    },
    {
      header: 'Wallet balance',
      accessorKey: 'balance',
      enableSorting: true,
      cell: ({ row }) => <Typography>{row.balance}</Typography>,
    },
    {
      header: 'APY',
      accessorKey: 'apy',
      enableSorting: true,
      cell: ({ row }) => <Typography>{row.apy}</Typography>,
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
      cell: ({ row }) => (
        <div className="flex items-center w-full justify-end">
          <Button
            variant="default"
            size="default"
            onClick={e => {
              e.stopPropagation();
              handleAssetClick(row.symbol);
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

  // Define columns for the borrow table
  const borrowColumns: ColumnDef<BorrowAsset>[] = [
    {
      header: 'Assets',
      accessorKey: 'symbol',
      enableSorting: true,
      cell: ({ row }) => renderAssetCell(row),
    },
    {
      header: 'Available',
      accessorKey: 'available',
      enableSorting: true,
      cell: ({ row }) => <Typography>{row.available}</Typography>,
    },
    {
      header: 'APY',
      accessorKey: 'apy',
      enableSorting: true,
      cell: ({ row }) => <Typography>{row.apy}</Typography>,
    },
    {
      header: '',
      accessorKey: 'symbol',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center w-full justify-end">
          <Button
            variant="default"
            size="default"
            onClick={e => {
              e.stopPropagation();
              handleAssetClick(row.symbol);
            }}
            aria-label={`Borrow ${row.symbol}`}
            className="rounded-full px-3 sm:px-5 py-2 sm:py-2.5"
          >
            Borrow
          </Button>
        </div>
      ),
    },
  ];

  // Transform data
  const tableData = transformData();

  // Render the appropriate table based on type
  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!tableData.length) {
      return null;
    }

    if (type === 'supply') {
      return (
        <SortableTable<SupplyAsset>
          data={tableData as SupplyAsset[]}
          columns={supplyColumns}
          pageSize={5}
          className="p-0 border-none"
        />
      );
    } else {
      return (
        <SortableTable<BorrowAsset>
          data={tableData as BorrowAsset[]}
          columns={borrowColumns}
          pageSize={5}
          className="p-0 border-none"
        />
      );
    }
  };

  return (
    <div className="flex-1 border bg-card p-3 sm:p-5 rounded-[18px] border-solid border-border min-w-[320px] max-w-full">
      <div className="flex justify-between items-center">
        <Typography variant="h4" weight="semibold" className="text-lg sm:text-xl">
          {title}
        </Typography>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      {(!tableData || tableData.length === 0) && !isLoading && (
        <div className="rounded bg-accent/30 mt-2 sm:mt-2.5 p-2 sm:p-2.5">
          <Typography variant="small" color="submerged">
            {type === 'supply'
              ? 'Your Ethereum wallet is empty. Purchase or transfer assets.'
              : 'No assets available for borrowing at this time.'}
          </Typography>
        </div>
      )}

      <div className="mt-3 sm:mt-5">{renderTable()}</div>
    </div>
  );
};
