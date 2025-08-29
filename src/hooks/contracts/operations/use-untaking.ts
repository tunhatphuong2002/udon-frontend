import { useCallback } from 'react';
import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface UnstakingParams {
  assetId: string | Buffer;
  amount: number | string;
  decimals: number;
  isUserWithdrawMax?: boolean;
}

interface UnstakingResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook for CHR withdraw operation (Option 1: Slow withdraw via BSC unstaking)
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute CHR withdraw operations
 */
export function useUnstaking({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: UnstakingResult, params: UnstakingParams) => void;
  onError?: (error: Error, params: UnstakingParams) => void;
} = {}) {
  const { account, client } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const withdrawChr = useCallback(
    async (params: UnstakingParams): Promise<UnstakingResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting CHR withdraw operation:', params);

        // let amountValue;
        // Signal for rell to recognize we want to withdraw with max amount
        // if (params.isUserWithdrawMax) {
        //   if (!client) {
        //     throw new Error('Client not available');
        //   }
        //   amountValue = await client.query('get_u256_max_query', {});
        // } else {
        const amountValue = createAmount(params.amount, params.decimals).value;
        // }

        // Execute CHR withdraw operation
        const result = await session
          .transactionBuilder()
          .add(op('unstake', account.id, params.assetId, amountValue, Date.now()))
          .buildAndSend();

        console.log('CHR withdraw transaction result:', result);

        if (result) {
          const successResult = { success: true };
          onSuccess?.(successResult, params);
          return successResult;
        } else {
          throw new Error('CHR withdraw transaction failed');
        }
      } catch (error) {
        console.error('Error in CHR withdraw operation:', error);
        const errorResult = {
          success: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        };
        onError?.(errorResult.error, params);
        return errorResult;
      }
    },
    [session, account, client, onSuccess, onError]
  );

  return withdrawChr;
}
