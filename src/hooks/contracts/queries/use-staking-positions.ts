import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { keysToCamelCase } from '@/utils/object';
import { normalizeBN } from '@/utils/bignumber';
import { StakingPosition, StakingStatus } from '@/app/(protected)/dashboard/types';

/**
 * Hook to fetch user's  stake/unstake positions
 */
export function useStakingPositions(
  assetId: Buffer<ArrayBufferLike>,
  decimals: number,
  status: StakingStatus,
  timeStaked: number,
  enabled: boolean = true
) {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_staking_positions_by_status', account?.id, assetId, status],
    queryFn: async () => {
      if (!client || !account) {
        throw new Error('Missing client or account');
      }

      console.log('Fetching quick withdraw positions for user:', account.id);

      // query get_staking_positions_by_status(user_id: byte_array, underlying_asset_id: byte_array, staking_status: staking_status): list«staking_position_query> {
      // Fetch all quick withdraw positions for the user
      const positionsResult = await client.query('get_staking_positions_by_status', {
        user_id: account.id,
        underlying_asset_id: assetId,
        staking_status: status,
      });

      console.log('positions raw results get_staking_positions_by_status:', positionsResult);

      const rawPositions = (Array.isArray(positionsResult) ? positionsResult : []).map(p =>
        keysToCamelCase(p)
      ) as StakingPosition[];

      // Format positions with proper number conversion
      const timeStakedBigInt = BigInt(timeStaked);
      console.log('timeStakedBigInt', timeStakedBigInt);

      const positionsFilter = rawPositions.filter(p => p.completedAt >= timeStakedBigInt);

      console.log('positionsFilter', positionsFilter);
      const positions = positionsFilter.map(p => ({
        ...p,
        expectedAmount: Number(normalizeBN(p.expectedAmount.toString(), decimals)),
        netAmount: Number(normalizeBN(p.netAmount.toString(), decimals)),
      }));

      console.log(
        'Stake Unstake positions get_staking_positions_by_status: with timeStaked',
        timeStaked,
        positions
      );

      return positions;
    },
    refetchInterval: 3000, // refetch 3s
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
