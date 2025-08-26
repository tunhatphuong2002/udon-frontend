import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { keysToCamelCase } from '@/utils/object';
import { normalizeBN } from '@/utils/bignumber';

export enum UnstakingStatus {
  PENDING_REQUEST,
  PENDING_UNSTAKING_14D,
  CROSS_TRANSFER_TO_UDON,
  UNSTAKED,
  CLAIMED,
}

export enum LsdFailureStatus {
  NO_FAILURE,
  STAKING_CROSS_TRANSFER_EC,
  STAKING_HANDLE,
  UNSTAKING_REQUEST,
  UNSTAKING_HANDLE,
  UNSTAKING_CROSS_TRANSFER_UDON,
}

export interface UnstakePosition {
  positionId: Buffer<ArrayBufferLike>;
  userId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  expectedAmount: number;
  netAmount: number;
  unstakingStatus: UnstakingStatus;
  failureStage: LsdFailureStatus;
  lsdErrorId: Buffer<ArrayBufferLike>;
  txStaking: string;
  txCrossChain: string;
  requestedAt: number;
  availableAt: number;
  completedAt: number;
  isActive: boolean;
}

/**
 * Hook to fetch user's  stake/unstake positions
 */
export function useUnstakingPositions(
  assetId: Buffer<ArrayBufferLike>,
  decimals: number,
  status: UnstakingStatus,
  enabled: boolean = true
) {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_unstaking_positions_by_status', account?.id, assetId, status],
    queryFn: async () => {
      if (!client || !account) {
        throw new Error('Missing client or account');
      }

      console.log('Fetching quick withdraw positions for user:', account.id);

      // query get_staking_positions_by_status(user_id: byte_array, underlying_asset_id: byte_array, staking_status: staking_status): list«staking_position_query> {
      // Fetch all quick withdraw positions for the user
      const positionsResult = await client.query('get_unstaking_positions_by_status', {
        user_id: account.id,
        underlying_asset_id: assetId,
        staking_status: status,
      });

      console.log('positions raw results:', positionsResult);

      const rawPositions = (Array.isArray(positionsResult) ? positionsResult : []).map(p =>
        keysToCamelCase(p)
      ) as UnstakePosition[];

      // Format positions with proper number conversion
      const positions = rawPositions.map(p => ({
        ...p,
        expectedAmount: Number(normalizeBN(p.expectedAmount.toString(), decimals)),
        netAmount: Number(normalizeBN(p.netAmount.toString(), decimals)),
      }));

      console.log('Stake Unstake positions:', positions);

      return positions;
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
