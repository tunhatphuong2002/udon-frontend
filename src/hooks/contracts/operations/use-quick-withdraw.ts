import { useCallback } from 'react';
import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface QuickWithdrawParams {
  assetId: Buffer<ArrayBufferLike>;
  amount: number | string;
  decimals: number;
  isUserWithdrawMax?: boolean;
}

interface QuickWithdrawResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook to initiate quick withdraw operations for LSD
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute quick withdraw operations
 */
export function useQuickWithdraw({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: QuickWithdrawResult, params: QuickWithdrawParams) => void;
  onError?: (error: Error, params: QuickWithdrawParams) => void;
} = {}) {
  const { account, client } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const quickWithdraw = useCallback(
    async (params: QuickWithdrawParams): Promise<QuickWithdrawResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting quick withdraw operation:', params);

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

        // Execute quick withdraw operation using the withdraw operation
        const result = await session
          .transactionBuilder()
          .add(
            op(
              'withdraw',
              account.id, // from account (asset owner)
              params.assetId, // underlying asset ID (tCHR)
              amountValue, // amount in stCHR to withdraw
              account.id, // to account (same as from)
              'quick', // withdraw_type
              Date.now()
            )
          )
          .buildAndSend();

        console.log('Quick withdraw operation result:', result);

        const quickWithdrawResult = {
          success: true,
        };

        onSuccess?.(quickWithdrawResult, params);
        return quickWithdrawResult;
      } catch (error) {
        console.error('Quick withdraw operation failed:', error);
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

  return quickWithdraw;
}
