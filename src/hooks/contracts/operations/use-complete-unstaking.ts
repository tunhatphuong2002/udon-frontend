import { useCallback } from 'react';
import { op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';

interface CompleteUnstakingParams {
  positionId: Buffer<ArrayBufferLike>;
  underlyingAssetId: Buffer<ArrayBufferLike>;
  stAssetAmount: number;
}

interface CompleteUnstakingResult {
  success: boolean;
  error?: Error;
}

/**
 * Hook to complete slow withdraw operations when they are ready (after 14 days)
 * @param callbacks Optional callbacks for success and error scenarios
 * @returns A function to execute complete slow withdraw operations
 */
export function useCompleteUnstaking({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: CompleteUnstakingResult, params: CompleteUnstakingParams) => void;
  onError?: (error: Error, params: CompleteUnstakingParams) => void;
} = {}) {
  const { account } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const completeUnstaking = useCallback(
    async (params: CompleteUnstakingParams): Promise<CompleteUnstakingResult> => {
      if (!session || !account) {
        const error = new Error('Session or account not available');
        onError?.(error, params);
        return { success: false, error };
      }

      try {
        console.log('Starting complete slow withdraw operation:', params);

        // Execute complete slow withdraw operation
        const result = await session
          .transactionBuilder()
          .add(op('complete_unstaking', params.positionId, params.underlyingAssetId, Date.now()))
          .buildAndSend();

        console.log('Complete slow withdraw operation result:', result);

        // update
        op('update_tx_admin_to_user', params.positionId, result.receipt.transactionRid);

        const completeUnstakingResult = {
          success: true,
        };

        onSuccess?.(completeUnstakingResult, params);
        return completeUnstakingResult;
      } catch (error) {
        console.error('Complete slow withdraw operation failed:', error);
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

  return completeUnstaking;
}
