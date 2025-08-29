import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { keysToCamelCase } from '@/utils/object';
import { normalizeBN } from '@/utils/bignumber';
import { ClaimHistory } from '@/app/(protected)/dashboard/types';

/**
 * Hook to fetch user's  stake/unstake positions
 */
export function useClaimHistory(
  assetId: Buffer<ArrayBufferLike>,
  decimals: number,
  enabled: boolean = true
) {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_claim_histories', account?.id, assetId],
    queryFn: async () => {
      if (!client || !account) {
        throw new Error('Missing client or account');
      }

      console.log('Fetching claim history for user:', account.id);

      // query get_staking_positions_by_status(user_id: byte_array, underlying_asset_id: byte_array, staking_status: staking_status): list«staking_position_query> {
      // Fetch all quick withdraw positions for the user
      const historyResult = await client.query('get_claim_histories', {
        user_id: account.id,
        underlying_asset_id: assetId,
      });

      console.log('history raw results:', historyResult);

      const rawHistory = (Array.isArray(historyResult) ? historyResult : []).map(p =>
        keysToCamelCase(p)
      ) as ClaimHistory[];

      // Format positions with proper number conversion
      const history = rawHistory.map(p => ({
        ...p,
        rewardAmount: Number(normalizeBN(p.rewardAmount.toString(), decimals)),
      }));

      console.log('Claim history:', history);

      return history;
    },
    enabled: enabled && !!client && !!account?.id,
    retry: 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
