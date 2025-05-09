import { useCallback } from 'react';

import { createAmount, op } from '@chromia/ft4';
import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { ensureBuffer } from '@/utils/ensure-buffer';
import { publicClientConfig } from '@/configs/client';
import { useFtSession } from '@chromia/react';
import { useTokenBalance } from '../queries/use-token-balance';

interface MintTokenParams {
  ticker: string;
  name: string;
  amount: number;
}

export function useMintToken({
  onSuccess,
  onError,
}: {
  onSuccess?: (token: MintTokenParams) => void;
  onError?: (token: MintTokenParams) => void;
} = {}) {
  const { account } = useChromiaAccount();
  const { refreshBalance } = useTokenBalance();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const registerAsset = useCallback(
    async (token: MintTokenParams) => {
      if (!session) return;

      try {
        await session
          .transactionBuilder()
          .add(
            op(
              'register_and_mint_asset',
              token.name,
              token.ticker,
              8,
              BigInt(token.amount),
              'https://res.cloudinary.com/dgjnyr47e/image/upload/v1745380825/icon_2_rxylmm.png'
            )
          )
          .buildAndSend();

        await refreshBalance();
        onSuccess?.(token);
      } catch (error) {
        console.error(error);
        onError?.(token);
      }
    },
    [session, refreshBalance, onSuccess, onError]
  );

  return registerAsset;
}

export function useTransferTokens({
  onSuccess,
  onError,
}: {
  onSuccess?: (token: MintTokenParams) => void;
  onError?: (token: MintTokenParams) => void;
}) {
  const { account } = useChromiaAccount();
  const { balances, refreshBalance } = useTokenBalance();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const transferTokens = useCallback(
    async (recipient: string, amount: number) => {
      try {
        if (!balances?.length) return;
        const asset = balances[0].asset;

        await session?.account.transfer(
          ensureBuffer(recipient),
          ensureBuffer(asset.id),
          createAmount(amount)
        );

        await refreshBalance();
        onSuccess?.({ ticker: asset.symbol, name: asset.name, amount });
      } catch (error) {
        console.error(error);
        onError?.({ ticker: '', name: '', amount });
      }
    },
    [balances, session?.account, refreshBalance, onSuccess, onError]
  );

  return transferTokens;
}

export function useBurnTokens({
  onSuccess,
  onError,
}: {
  onSuccess?: (token: MintTokenParams) => void;
  onError?: (token: MintTokenParams) => void;
}) {
  const { balances, refreshBalance } = useTokenBalance();
  const { account } = useChromiaAccount();
  const { data: session } = useFtSession(
    account ? { clientConfig: publicClientConfig, account } : null
  );

  const burnTokens = useCallback(
    async (amount: number) => {
      try {
        if (!balances?.length) return;
        const asset = balances[0].asset;

        await session?.account.burn(asset.id, createAmount(amount));

        await refreshBalance();
        onSuccess?.({ ticker: asset.symbol, name: asset.name, amount });
      } catch (error) {
        console.error(error);
        onError?.({ ticker: '', name: '', amount });
      }
    },
    [balances, session?.account, refreshBalance, onSuccess, onError]
  );

  return burnTokens;
}
