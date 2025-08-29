import { useCallback } from 'react';
import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface StakingParams {
  assetId: string | Buffer;
  amount: number | string;
  decimals: number;
}

interface StakingResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook to stake assets to the protocol
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute staking operations
 */
export function useStaking({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: StakingResult, params: StakingParams) => void;
  onError?: (error: Error, params: StakingParams) => void;
} = {}) {
  const { account } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const stake = useCallback(
    async (params: StakingParams): Promise<StakingResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting staking operation:', params);

        // Execute staking operation
        const result = await session
          .transactionBuilder()
          .add(
            op(
              'stake',
              account.id, // from account
              params.assetId, // underlying asset ID
              createAmount(params.amount, params.decimals).value, // amount
              Date.now()
            )
          )
          .buildAndSend();

        console.log('Staking operation result:', result);

        const stakingResult = {
          success: true,
        };

        onSuccess?.(stakingResult, params);
        return stakingResult;
      } catch (error) {
        console.error('Staking operation failed:', error);
        const errorObj = error instanceof Error ? error : new Error(String(error));
        onError?.(errorObj, params);
        return {
          success: false,
          error: errorObj,
        };
      }
    },
    [session, account, onSuccess, onError]
  );

  return stake;
}
