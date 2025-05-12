import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TransferHistoryEntry, PaginatedEntity, TransferHistoryEntryResponse } from '@chromia/ft4';
import { useChromiaAccount } from '../../configs/chromia-hooks';

export const mockTransfers: TransferHistoryEntryResponse[] = [
  {
    rowid: 1,
    id: 1,
    delta: BigInt(-1000),
    asset: {
      id: Buffer.from('1'),
      name: 'Chromia',
      symbol: 'CHR',
      decimals: 6,
      blockchain_rid: Buffer.from('1'),
      icon_url: '/mock/chr.png',
      type: 'native',
      supply: BigInt(1000000),
    },
    is_input: 0,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    block_height: 100,
    tx_rid: Buffer.from('tx1'),
    tx_data: '',
    operation_name: 'supply',
    op_index: 0,
    is_crosschain: 0,
  },
  {
    rowid: 2,
    id: 2,
    delta: BigInt(2000),
    asset: {
      id: Buffer.from('2'),
      name: 'Tether',
      symbol: 'USDT',
      decimals: 2,
      blockchain_rid: Buffer.from('2'),
      icon_url: '/mock/usdt.png',
      type: 'erc20',
      supply: BigInt(100000000),
    },
    is_input: 1,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    block_height: 101,
    tx_rid: Buffer.from('tx2'),
    tx_data: '',
    operation_name: 'withdraw',
    op_index: 0,
    is_crosschain: 0,
  },
  {
    rowid: 3,
    id: 3,
    delta: BigInt(500),
    asset: {
      id: Buffer.from('3'),
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8,
      blockchain_rid: Buffer.from('3'),
      icon_url: '/mock/btc.png',
      type: 'native',
      supply: BigInt(21000000),
    },
    is_input: 1,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    block_height: 102,
    tx_rid: Buffer.from('tx3'),
    tx_data: '',
    operation_name: 'borrow',
    op_index: 0,
    is_crosschain: 0,
  },
  {
    rowid: 4,
    id: 4,
    delta: BigInt(-500),
    asset: {
      id: Buffer.from('4'),
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8,
      blockchain_rid: Buffer.from('3'),
      icon_url: '/mock/btc.png',
      type: 'native',
      supply: BigInt(21000000),
    },
    is_input: 0,
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    block_height: 103,
    tx_rid: Buffer.from('tx4'),
    tx_data: '',
    operation_name: 'repay',
    op_index: 0,
    is_crosschain: 0,
  },
  {
    rowid: 5,
    id: 5,
    delta: BigInt(-300),
    asset: {
      id: Buffer.from('5'),
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      blockchain_rid: Buffer.from('5'),
      icon_url: '/mock/matic.png',
      type: 'erc20',
      supply: BigInt(1000000000),
    },
    is_input: 0,
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    block_height: 104,
    tx_rid: Buffer.from('tx5'),
    tx_data: '',
    operation_name: 'transfer',
    op_index: 0,
    is_crosschain: 0,
  },
  {
    rowid: 6,
    id: 6,
    delta: BigInt(0),
    asset: {
      id: Buffer.from('6'),
      name: 'Unknown',
      symbol: 'UNK',
      decimals: 2,
      blockchain_rid: Buffer.from('6'),
      icon_url: '/mock/unk.png',
      type: 'erc20',
      supply: BigInt(0),
    },
    is_input: 0,
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    block_height: 105,
    tx_rid: Buffer.from('tx6'),
    tx_data: '',
    operation_name: 'something-else',
    op_index: 0,
    is_crosschain: 0,
  },
  // ...thêm nhiều nếu muốn
];

export const TRANSFER_HISTORY_QUERY_KEY = ['transfer-history'] as const;

export function useTransferHistory() {
  const { account } = useChromiaAccount();
  const queryClient = useQueryClient();

  const {
    data: history,
    isLoading,
    error,
  } = useQuery<PaginatedEntity<TransferHistoryEntry>>({
    queryKey: TRANSFER_HISTORY_QUERY_KEY,
    queryFn: async () => {
      if (!account) {
        throw new Error('No account found');
      }
      return account.getTransferHistory();
    },
    refetchInterval: 20000, // Refetch every 20 seconds
    enabled: !!account, // Only run query if account exists
  });

  // Function to manually refresh history
  const refreshHistory = async () => {
    await queryClient.invalidateQueries({ queryKey: TRANSFER_HISTORY_QUERY_KEY });
  };

  return {
    transfers: history?.data ?? [],
    isLoading,
    error,
    refreshHistory,
  };
}
