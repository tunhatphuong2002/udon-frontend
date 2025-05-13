'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatCard } from './components/stat-card';
import { Typography } from '@/components/common/typography';
import { SupplyTable } from './components/supply';
import { BorrowTable } from './components/borrow';
import { Asset, PaginatedEntity } from '@chromia/ft4';
import { useChromiaAccount, useChromiaQuery } from '@/hooks/configs/chromia-hooks';
import { toast } from 'sonner';
import { SupplyPositionTable } from './components/supply/position';
import { BorrowPositionTable } from './components/borrow/position';

// Define asset price interface
interface AssetPrice {
  stork_asset_id: string;
  price: number;
  timestamp: string;
}

// Define the common asset structure both components will use
interface CommonAsset {
  id: Buffer<ArrayBufferLike>;
  symbol: string;
  name: string;
  iconUrl: string;
  price?: number;
  decimals: number;
}

interface UserReserveData {
  asset: CommonAsset;
  current_a_token_balance: bigint;
  current_variable_debt: bigint;
  scaled_variable_debt: bigint;
  liquidity_rate: bigint;
  usage_as_collateral_enabled: boolean;
}

export default function SupplyPage() {
  const { client, account } = useChromiaAccount();
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [isLoadingReserves, setIsLoadingReserves] = useState(false);
  const [supplyPositions, setSupplyPositions] = useState<UserReserveData[]>([]);
  const [borrowPositions, setBorrowPositions] = useState<UserReserveData[]>([]);

  // Query for assets
  const {
    data: assetsData,
    isLoading: isLoadingAssets,
    error: assetsError,
  } = useChromiaQuery<string, Record<string, unknown>, PaginatedEntity<Asset>>({
    queryName: 'ft4.get_assets_by_type',
    queryParams: {
      type: 'ft4',
      page_size: null,
      page_cursor: null,
    },
    swrConfiguration: {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    },
  });

  // Extract asset IDs for price query
  const assetIds = useMemo(() => {
    if (assetsData?.data) {
      return assetsData.data.map(asset => asset.id);
    }
    return [];
  }, [assetsData]);

  // Store processed assets with prices
  const [processedAssets, setProcessedAssets] = useState<CommonAsset[]>([]);

  // Fetch prices using client directly
  const fetchPrices = useCallback(async () => {
    if (!client || !assetIds.length) return;

    try {
      setIsLoadingPrices(true);

      const prices = (await client.query('get_latest_price_by_asset_ids', {
        asset_ids: assetIds,
      })) as unknown as AssetPrice[];

      console.log('prices', prices);

      if (assetsData?.data) {
        const assetsWithPriceData = assetsData.data.map(asset => {
          const assetPrice = prices.find(p => p.stork_asset_id === asset.symbol);
          console.log('assetPrice', assetPrice);
          console.log('assetPrice', assetPrice?.price);

          return {
            id: asset.id,
            symbol: asset.symbol,
            name: asset.name,
            iconUrl: asset.iconUrl,
            price: Number(assetPrice?.price) || 0,
            decimals: 8,
          };
        });
        setProcessedAssets(assetsWithPriceData);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      toast.error('Failed to load asset prices. Please try again.');
    } finally {
      setIsLoadingPrices(false);
    }
  }, [client, assetIds, assetsData?.data]);

  // Fetch prices when assets data changes
  useEffect(() => {
    if (assetsData?.data && assetIds.length > 0) {
      fetchPrices();
    }
  }, [assetsData, assetIds, fetchPrices]);

  // Show error toast if API calls fail
  useEffect(() => {
    if (assetsError) {
      toast.error('Failed to load assets. Please try again.');
    }
  }, [assetsError]);

  // Fetch user reserves data
  const fetchUserReserves = useCallback(async () => {
    if (!client || !account || !processedAssets.length) return;

    try {
      setIsLoadingReserves(true);

      // Create an array of promises for all asset queries
      const reservePromises = processedAssets.map(asset =>
        client
          .query('get_user_reserve_data', {
            asset_id: asset.id,
            user_id: account.id,
          })
          .then(reserveData => ({
            asset,
            ...(reserveData as {
              current_a_token_balance: bigint;
              current_variable_debt: bigint;
              scaled_variable_debt: bigint;
              liquidity_rate: bigint;
              usage_as_collateral_enabled: boolean;
            }),
          }))
      );

      // Wait for all queries to complete
      const userReserves = await Promise.all(reservePromises);

      // Filter positions
      const supplyData = userReserves.filter(
        reserve => reserve.current_a_token_balance > BigInt(0)
      );

      const borrowData = userReserves.filter(reserve => reserve.current_variable_debt > BigInt(0));

      setSupplyPositions(supplyData);
      setBorrowPositions(borrowData);
    } catch (error) {
      console.error('Failed to fetch user reserves:', error);
      toast.error('Failed to load your positions. Please try again.');
    } finally {
      setIsLoadingReserves(false);
    }
  }, [client, account, processedAssets]);

  // Fetch reserves when processed assets change
  useEffect(() => {
    if (processedAssets.length > 0) {
      fetchUserReserves();
    }
  }, [processedAssets, fetchUserReserves]);

  const isLoading = isLoadingAssets || isLoadingPrices || isLoadingReserves;

  return (
    <main className="container mx-auto px-4 sm:px-5 py-[180px]">
      <section className="flex flex-col items-center gap-2 sm:gap-2.5">
        <div
          dangerouslySetInnerHTML={{
            __html: `<svg id="384:1283" width="152" height="36" viewBox="0 0 152 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="title-icon w-32 h-8 sm:w-40 sm:h-10" style="max-width: 152px"> <circle cx="18" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="47" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="76" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="105" cy="18" r="17.5" stroke="currentColor"></circle> <circle cx="134" cy="18" r="17.5" stroke="currentColor"></circle> </svg>`,
          }}
          className="mb-2 text-foreground"
        />
        <Typography
          variant="h2"
          weight="normal"
          align="center"
          className="text-2xl sm:text-3xl md:text-[40px] font-light"
        >
          Streamline your
        </Typography>
        <Typography
          variant="h2"
          weight="normal"
          align="center"
          className="text-2xl sm:text-3xl md:text-[40px] font-light"
        >
          crypto investment on Chromia
        </Typography>
      </section>

      <section className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-6 sm:mt-10">
        <StatCard
          value="$4,232,090,563"
          label="Your Deposit"
          iconUrl="/images/supply/coin-stack.gif"
        />
        <StatCard
          value="$4,232,090,563"
          label="Your Borrows"
          iconUrl="/images/supply/saving-piggy.gif"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-10 p-4 border border-solid rounded-3xl border-border">
        <SupplyPositionTable positions={supplyPositions} isLoading={isLoading} />
        <BorrowPositionTable positions={borrowPositions} isLoading={isLoading} />
        <SupplyTable
          title="Assets to supply"
          showCollateral={false}
          assets={processedAssets}
          isLoading={isLoading}
        />
        <BorrowTable title="Assets to borrow" assets={processedAssets} isLoading={isLoading} />
      </section>
    </main>
  );
}
