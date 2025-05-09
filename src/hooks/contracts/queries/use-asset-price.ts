import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';

// Define asset price interface
export interface AssetPrice {
  stork_asset_id: string;
  price: number;
  timestamp: string;
}

/**
 * Hook to fetch a single asset price from the Chromia blockchain using TanStack Query
 * @param assetId The asset ID to fetch the price for
 * @param enabled Whether to enable the query
 * @returns Query result with data, isLoading, error, and refetch function
 */
export function useAssetPrice(
  assetId: string | Buffer | number | Record<string, unknown>,
  enabled = true
) {
  const { client } = useChromiaAccount();

  // Format asset ID for API call
  const getFormattedAssetId = () => {
    if (!assetId) return null;

    if (typeof assetId === 'string') {
      return assetId;
    } else if (Buffer.isBuffer(assetId)) {
      return assetId.toString('hex');
    } else if (assetId && typeof assetId.toString === 'function') {
      return assetId.toString();
    }

    return assetId;
  };

  const formattedAssetId = getFormattedAssetId();

  // Use TanStack Query to fetch and cache price data
  const query = useQuery({
    queryKey: ['asset-price', formattedAssetId],
    queryFn: async () => {
      if (!client || !formattedAssetId) {
        console.log('Price fetch skipped:', {
          hasClient: !!client,
          hasAssetId: !!formattedAssetId,
        });
        throw new Error('Missing client or asset ID');
      }

      console.log('Fetching price for asset:', {
        originalAssetId: assetId,
        formattedAssetId,
        type: typeof assetId,
      });

      const price = (await client.query('get_latest_price_by_asset_id', {
        asset_id: formattedAssetId,
      })) as unknown as AssetPrice;

      console.log('Received price data:', price);
      return price;
    },
    enabled: enabled && !!client && !!formattedAssetId,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2, // Retry failed requests twice
    networkMode: 'offlineFirst',
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
