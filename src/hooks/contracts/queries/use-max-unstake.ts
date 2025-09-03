import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { normalizeBN } from '@/utils/bignumber';

/**
 * Hook to fetch the max stCHR withdraw amount based on a known CHR amount
 * @param assetId The asset ID (Buffer)
 * @param decimals The asset decimals
 * @param chrAmount The CHR amount to base the calculation on
 * @param enabled Whether the query should be enabled
 * @returns Query result with data (number, human units), isLoading, error, and refetch function
 */
export function useMaxUnstakedStAssetAmount(
  assetId: Buffer<ArrayBufferLike>,
  decimals: number,
  enabled: boolean = true
) {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_max_unstaked_st_asset_amount', account?.id, assetId, decimals],
    queryFn: async () => {
      console.log('useMaxStchrAmountWithChr - queryFn called with:', {
        enabled,
        accountId: account?.id?.toString('hex'),
        assetId: assetId.toString('hex'),
      });
      if (!client || !account?.id || !assetId) {
        throw new Error('Missing client, user/asset ID, or invalid CHR amount');
      }

      // Call Chromia contract for max stCHR amount (returns big integer string)
      const maxStchrRaw = (await client.query('get_max_unstaked_st_asset_amount', {
        user_id: account?.id,
        underlying_asset_id: assetId,
      })) as unknown as bigint;

      console.log('account?.id', account?.id);
      console.log('assetId', assetId.toString('hex'));

      console.log('maxStchrRaw', maxStchrRaw);

      // Convert to human readable number
      const result = Number(normalizeBN(maxStchrRaw.toString(), decimals));
      console.log('useMaxStchrAmountWithChr - result:', result.toString());
      return result;
    },
    enabled: !!client && !!account?.id && !!assetId && assetId.length > 0 && enabled,
    retry: 2,
  });

  return {
    data: Number(query.data) || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
