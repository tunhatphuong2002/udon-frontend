import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';
import { normalizeBN } from '@/utils/bignumber';
import { createClient } from 'postchain-client';

/**
 * Hook to fetch reward info of a user
 */
export function useRewardInfo(
  assetId: Buffer<ArrayBufferLike>,
  decimals: number,
  enabled: boolean = true
) {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_reward_info', account?.id, assetId],
    queryFn: async () => {
      if (!client || !account) {
        throw new Error('Missing client or account');
      }

      console.log('Fetching reward info for user:', account.id);

      // Fetch user id on EC who mapping with current udon user
      const userEcId = (await client.query('get_user_ec_id', {
        user_id: account.id,
      })) as unknown as Buffer<ArrayBufferLike>;

      console.log(userEcId.toString('hex'), 'userEcId');

      // if (!userEcId.toString('hex'))
      //   return {
      //     upcommingRewards: 0,
      //     accumulatedRewards: 0,
      //   };

      // 0. create client
      const clientEc = await createClient({
        directoryNodeUrlPool: 'https://dapps0.chromaway.com',
        blockchainRid: '15C0CA99BEE60A3B23829968771C50E491BD00D2E3AE448580CD48A8D71E7BBA',
      });
      // 1. fetch upcoming rewards
      const upcomingRewardsRaw = (await clientEc.query('staking_rewards_claimable_for', {
        account_id: userEcId,
      })) as number;

      console.log('upcomingRewardsRaw', upcomingRewardsRaw);

      const upcommingRewards = Number(normalizeBN(upcomingRewardsRaw, decimals));
      console.log('upcommingRewards', upcommingRewards);

      // 2. fetch accumulated rewards
      // get total reward paid on economy chian
      const stakingGetRewardsPaidRaw = (await clientEc.query('staking_get_rewards_paid', {
        account_id: userEcId,
      })) as number;

      const sharedRewardsPaidRaw = (await clientEc.query('staking_get_shared_rewards_paid', {
        account_id: userEcId,
        provider_pubkey: null,
        since: null,
      })) as number;

      const accumulatedRewards = Number(
        normalizeBN(stakingGetRewardsPaidRaw + sharedRewardsPaidRaw, decimals)
      );

      return {
        upcommingRewards,
        accumulatedRewards,
      };
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
