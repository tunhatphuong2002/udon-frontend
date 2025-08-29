import { useQuery } from '@tanstack/react-query';
import { useChromiaAccount } from '../../configs/chromia-hooks';

/**
 * React hook to check if a user has already staked (has a staking account on-chain)
 * @param enabled Whether to run the query
 * @returns { data: boolean, isLoading, error, refetch }
 */
export function useGetStakingUser() {
  const { client, account } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['get_staking_user', account?.id],
    queryFn: async () => {
      if (!client || !account?.id) {
        throw new Error('Missing client or user account ID');
      }

      // Call Chromia contract to check if user has a staking account
      const result = await client.query('check_if_first_staking', {
        user_id: account.id,
      });
      console.log('get_staking_user result', result);
      console.log('get_staking_user !!result', !!result);

      return !!result;
    },
    enabled: !!client && !!account?.id,
    retry: 2,
  });

  return {
    data: !!query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
