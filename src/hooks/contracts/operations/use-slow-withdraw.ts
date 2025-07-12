import { useCallback } from 'react';
import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface SlowWithdrawParams {
  assetId: Buffer<ArrayBufferLike>;
  amount: number | string;
  decimals: number;
  isUserWithdrawMax?: boolean;
}

interface SlowWithdrawResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook to initiate slow withdraw operations for LSD
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute slow withdraw operations
 */
export function useSlowWithdraw({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: SlowWithdrawResult, params: SlowWithdrawParams) => void;
  onError?: (error: Error, params: SlowWithdrawParams) => void;
} = {}) {
  const { account, client } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const slowWithdraw = useCallback(
    async (params: SlowWithdrawParams): Promise<SlowWithdrawResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting slow withdraw operation:', params);

        let amountValue;
        // Signal for rell to recognize we want to withdraw with max amount
        if (params.isUserWithdrawMax) {
          if (!client) {
            throw new Error('Client not available');
          }
          amountValue = await client.query('get_u256_max_query', {});
        } else {
          amountValue = createAmount(params.amount, params.decimals).value;
        }

        console.log('Amount in decimals format:', amountValue);

        // Execute slow withdraw operation using the withdraw operation
        const result = await session
          .transactionBuilder()
          .add(
            op(
              'withdraw',
              account.id, // from account (asset owner)
              params.assetId, // underlying asset ID (tCHR)
              amountValue, // amount in stCHR to withdraw
              account.id, // to account (same as from)
              'slow', // withdraw_type
              Date.now()
            )
          )
          .buildAndSend();

        console.log('Slow withdraw operation result:', result);

        const slowWithdrawResult = {
          success: true,
        };

        onSuccess?.(slowWithdrawResult, params);
        return slowWithdrawResult;
      } catch (error) {
        console.error('Slow withdraw operation failed:', error);
        const errorObj = error instanceof Error ? error : new Error(String(error));
        onError?.(errorObj, params);
        return {
          success: false,
          error: errorObj,
        };
      }
    },
    [session, account, client, onSuccess, onError]
  );

  return slowWithdraw;
}
