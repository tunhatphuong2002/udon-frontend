import { useChromiaAccount } from '@/hooks/configs/chromia-hooks';
import { normalizeBN } from '@/utils/bignumber';
import { useQuery } from '@tanstack/react-query';

export type PeriodType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type DepositHistoryDataPoint = {
  timestamp: number;
  value: number;
};

export function useTotalDepositHistory(assetId: string, periodType: PeriodType = 'monthly') {
  const { client } = useChromiaAccount();

  const query = useQuery({
    queryKey: ['total_deposit_history', assetId, periodType],
    queryFn: async () => {
      if (!client) return null;

      const result = await client.query('get_total_deposit_history', {
        reserve_id: Buffer.from(assetId, 'hex'),
        period_type: periodType,
      });

      if (!result || !Array.isArray(result)) return [];

      // Convert result to an array of data points with timestamp and value
      return result.map(item => ({
        timestamp: Number(item.timestamp),
        value: Number(normalizeBN(item.value.toString(), item.decimals || 18)),
      }));
    },
    enabled: !!client && !!assetId,
    retry: 2,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
