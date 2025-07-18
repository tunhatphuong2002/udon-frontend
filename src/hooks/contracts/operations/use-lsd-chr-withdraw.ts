import { useCallback } from 'react';
import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface ChrWithdrawParams {
  assetId: string | Buffer;
  amount: number | string;
  decimals: number;
  isUserWithdrawMax?: boolean;
}

interface ChrWithdrawResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook for CHR withdraw operation (Option 1: Slow withdraw via BSC unstaking)
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute CHR withdraw operations
 */
export function useChrWithdraw({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: ChrWithdrawResult, params: ChrWithdrawParams) => void;
  onError?: (error: Error, params: ChrWithdrawParams) => void;
} = {}) {
  const { account } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const withdrawChr = useCallback(
    async (params: ChrWithdrawParams): Promise<ChrWithdrawResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting CHR withdraw operation:', params);

        // Execute CHR withdraw operation
        const result = await session
          .transactionBuilder()
          .add(
            op(
              'withdraw_chr',
              params.assetId,
              params.isUserWithdrawMax
                ? createAmount('999999999999999999999', params.decimals).value // Max withdraw
                : createAmount(params.amount, params.decimals).value
            )
          )
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
    [session, account, onSuccess, onError]
  );

  return withdrawChr;
}
