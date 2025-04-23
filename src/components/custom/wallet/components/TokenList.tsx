'use client';

import { Balance } from '@chromia/ft4';
import { useTokenBalance } from '@/hooks/use-token-balance';

// Extend the Balance type with additional properties
interface TokenBalance extends Balance {
  tokenId?: string;
  tokenName?: string;
  availableAmount?: string | number;
}

export function TokenList() {
  const { balances, isLoading: isLoadingBalances } = useTokenBalance();

  return (
    <div className="w-full mt-4">
      <h3 className="text-md font-semibold mb-2">Your Assets</h3>

      <div className="relative">
        {isLoadingBalances && (
          <div className="absolute right-0 top-0">
            <div className="h-3 w-3 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
          </div>
        )}

        <div className="max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {balances.length > 0 ? (
            <div className="space-y-3">
              {balances.map((balance, index) => {
                const tokenBalance = balance as TokenBalance;
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/30 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {tokenBalance.tokenId?.substring(0, 2).toUpperCase() || 'TK'}
                          </span>
                        </div>
                        <span className="text-md font-medium">
                          {tokenBalance.tokenName || `POL`}
                        </span>
                      </div>
                      <span className="text-lg font-semibold">
                        {tokenBalance.availableAmount || balance.amount.toString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/30 p-4 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative text-center">
                <p className="text-sm text-muted-foreground">No assets found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
