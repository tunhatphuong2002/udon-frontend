import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { useMemo } from 'react';
import { normalizeBN } from '@/utils/bignumber';

// Define liquidation interface based on the log entity
export interface LiquidationCall {
  collateralAssetId: Buffer<ArrayBufferLike>;
  debtAssetId: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  debtToCover: number;
  liquidatedCollateralAmount: number;
  liquidatorId: Buffer<ArrayBufferLike>;
  receiveAAsset: boolean;
  timestamp: number;
}

/**
 * Hook to fetch liquidated data from the Chromia blockchain using TanStack Query
 * @returns Query result with data, isLoading, error, and refetch function
 */
export function useGetLiquidated() {
  const { client, account } = useChromiaAccount();

  // Use TanStack Query to fetch and cache liquidated data
  const query = useQuery({
    queryKey: ['get_liquidated', account?.id],
    queryFn: async () => {
      if (!client || !account?.id) {
        console.log('Fetch liquidated data skipped:', {
          hasClient: !!client,
          hasAccountId: !!account?.id,
        });
        throw new Error('Missing client or account ID');
      }

      console.log('Fetching liquidated data ... ');

      const liquidatedRaw = await client.query('get_liquidated_by_user_id', {
        // user_id: account.id,
        user_id: Buffer.from(
          '01A3D3913C462100B060B1C5FEB1FFDD79E0FC6DFA89756A5DCA55EA4C66B02C',
          'hex'
        ),
      });

      console.log('liquidatedRaw', liquidatedRaw);

      const liquidated = (Array.isArray(liquidatedRaw) ? liquidatedRaw : []).map(r => {
        return {
          collateralAssetId: r.collateral_asset_id.toString('hex'),
          debtAssetId: r.debt_asset_id.toString('hex'),
          userId: r.user_id.toString('hex'),
          liquidatorId: r.liquidator_id.toString('hex'),
          debtToCover: Number(normalizeBN(r.debt_to_cover.toString(), 6)),
          liquidatedCollateralAmount: Number(
            normalizeBN(r.liquidated_collateral_amount.toString(), 6)
          ),
          receiveAAsset: !!r.receive_a_asset,
          timestamp: Number(r.timestamp),
        } as LiquidationCall;
      });

      const debtAsset = await account.connection.getAssetById(liquidated[0].debtAssetId);
      console.log('debtAsset', debtAsset);

      const collateralAsset = await account.connection.getAssetById(
        liquidated[0].collateralAssetId
      );
      console.log('collateralAsset', collateralAsset);

      console.log('Received liquidated data:', liquidated);
      return {
        liquidated: liquidated as LiquidationCall[],
        debtAsset,
        collateralAsset,
      };
    },
    enabled: !!client && !!account?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2, // Retry failed requests twice
  });

  const liquidatedCount = useMemo(() => {
    return query.data?.liquidated?.length || 0;
  }, [query.data]);

  return {
    data: query.data,
    liquidatedCount,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
