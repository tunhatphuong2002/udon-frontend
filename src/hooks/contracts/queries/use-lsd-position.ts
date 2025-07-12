import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { keysToCamelCase } from '@/utils/object';

// Enum staking status từ Rell
export enum StakingStatus {
  PENDING_STAKING = 0,
  CROSS_CHAIN_TRANSFERRING_TO_ECONOMY = 1,
  BRIDGING_TO_BSC = 2,
  TRANSFER_TO_USER = 3,
  APPROVE_ERC20 = 4,
  STAKED = 5,
}

// Enum failure stage từ Rell
export enum LsdFailureStage {
  NO_FAILURE = 0,
  STAKING_TRANSFER_ECONOMY = 1,
  STAKING_BRIDGING_BSC = 2,
  STAKING_TRANSFER_USER_BSC = 3,
  STAKING_APPROVE_ERC20_BSC = 4,
  STAKING_HANDLE = 5,
  S_WITHDRAW_REQUEST = 6,
  S_WITHDRAW_HANDLE = 7,
  S_WITHDRAW_BRIDGE_ASSET = 8,
  S_WITHDRAW_TRANSFER_UDON = 9,
  Q_WITHDRAW_TRANSFER_DEX = 10,
  Q_WITHDRAW_HANDLE_SWAP = 11,
  Q_WITHDRAW_TRANSFER_UDON = 12,
}

export interface UserLsdPosition {
  userAccountId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  status: LsdFailureStage | string; // Can be enum number or string from backend
  totalStAssetStaking: number;
  totalStAssetStakingAndReward: number;
  currentTotalStAssetStaking: number;
  currentTotalStAssetStakingAndReward: number;
  availableForWithdraw: number;
  pendingWithdrawals: number;
  createdAt: string;
  lastSupplyAt: string;
}

export interface UserSupplyRecord {
  positionId: Buffer<ArrayBufferLike>;
  userAccountId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  expectedAmount: number;
  netAmount: number;
  stAssetAmount: number;
  supplyFee: number;
  bscStakingAddress: string;
  stakingStatus: StakingStatus | string; // Can be enum number or string from backend
  createdAt: string;
  completedAt: string;
}

export interface UserAccumulatedRewards {
  userAccountId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  totalAssetCollected: number;
  totalLendingRewards: number;
  currentStakingRewards: number;
  totalStakingRewards: number;
  bscStakingAddress: string;
  bscStakeAmount: number;
  bscRewardAmount: number;
  lastUpdateTimestamp: string;
}

/**
 * Hook to fetch user's LSD position data
 */
export function useLsdPosition() {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['lsd-position', account?.id],
    queryFn: async () => {
      if (!client || !account) {
        throw new Error('Missing client or account');
      }

      console.log('Fetching LSD position for user:', account.id);

      // Fetch user LSD position
      const positionResult = await client.query('get_user_lsd_position', {
        user_account_id: account.id,
      });

      // Fetch user supply records (staking positions)
      const supplyRecordsResult = await client.query('get_user_supply_records', {
        user_account_id: account.id,
      });

      // Fetch user accumulated rewards
      const rewardsResult = await client.query('get_user_accumulated_rewards', {
        user_account_id: account.id,
      });

      console.log('LSD Position raw results:', {
        position: positionResult,
        supplyRecords: supplyRecordsResult,
        rewards: rewardsResult,
      });

      const positions = (Array.isArray(positionResult) ? positionResult : []).map(p =>
        keysToCamelCase(p)
      ) as UserLsdPosition[];

      const supplyRecords = (Array.isArray(supplyRecordsResult) ? supplyRecordsResult : []).map(s =>
        keysToCamelCase(s)
      ) as UserSupplyRecord[];

      const rewards = (Array.isArray(rewardsResult) ? rewardsResult : []).map(r =>
        keysToCamelCase(r)
      ) as UserAccumulatedRewards[];

      return {
        positions,
        supplyRecords,
        rewards,
      };
    },
    enabled: !!client && !!account?.id,
    refetchInterval: 3000, // Refetch every 3 seconds to track staking progress
    staleTime: 2000, // 2 seconds
    retry: 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Helper function to get staking status for a specific asset
 */
export function getStakingStatusForAsset(
  assetSymbol: string,
  lsdData?: {
    positions: UserLsdPosition[];
    supplyRecords: UserSupplyRecord[];
    rewards: UserAccumulatedRewards[];
  }
): {
  stakingStatus: StakingStatus | string | null;
  hasError: boolean;
  errorStage: LsdFailureStage | string | null;
  stakingAPY: number;
  isStaked: boolean;
} {
  if (!lsdData || assetSymbol !== 'tCHR') {
    return {
      stakingStatus: null,
      hasError: false,
      errorStage: null,
      stakingAPY: 0,
      isStaked: false,
    };
  }

  const { positions, supplyRecords, rewards } = lsdData;

  // Find position for CHR asset (assuming tCHR maps to CHR in the backend)
  const position = positions[0]; // Since we only support CHR for LSD
  const supplyRecord = supplyRecords[0]; // Latest supply record
  const reward = rewards[0]; // Accumulated rewards

  if (!position || !supplyRecord) {
    return {
      stakingStatus: null,
      hasError: false,
      errorStage: null,
      stakingAPY: 0,
      isStaked: false,
    };
  }

  // Check if has error - handle both string and enum
  const hasError =
    position.status !== LsdFailureStage.NO_FAILURE && position.status !== 'NO_FAILURE';

  // Check if staked - handle both string and enum
  const isStaked =
    supplyRecord.stakingStatus === StakingStatus.STAKED || supplyRecord.stakingStatus === 'STAKED';

  // Calculate staking APY from rewards (simplified calculation)
  let stakingAPY = 0;
  if (isStaked && reward && reward.totalStakingRewards > 0 && reward.bscStakeAmount > 0) {
    // This is a simplified calculation - in real implementation you might want to
    // calculate based on time periods and compound interest
    // stakingAPY = (reward.totalStakingRewards / reward.bscStakeAmount) * 100;
    stakingAPY = 3;
  }

  return {
    stakingStatus: supplyRecord.stakingStatus,
    hasError,
    errorStage: hasError ? position.status : null,
    stakingAPY,
    isStaked,
  };
}
