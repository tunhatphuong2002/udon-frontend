'use client';

import { ArrowUpRight, ArrowDownRight, Calendar, Clock } from 'lucide-react';
import { useTransferHistory } from '@/hooks/use-tranfer-history';
import { format } from 'date-fns';

export function TransactionHistory() {
  const { transfers, isLoading } = useTransferHistory();

  // Hàm rút gọn chuỗi (như hex address)
  const truncateHash = (hash: string, startChars = 6, endChars = 3) => {
    if (!hash) return '';
    if (hash.length <= startChars + endChars) return hash;
    return `x${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
  };

  // Format số lượng token với số lẻ thập phân
  const formatAmount = (amount: unknown) => {
    if (!amount) return '0';
    try {
      return String(amount);
    } catch {
      return '0';
    }
  };

  return (
    <div className="w-full mt-6">
      <h3 className="text-md font-semibold mb-2">Your Activity</h3>

      <div className="relative">
        {isLoading && (
          <div className="absolute right-0 top-0">
            <div className="h-3 w-3 rounded-full border-2 border-primary/60 border-t-transparent animate-spin"></div>
          </div>
        )}

        <div className="max-h-[130px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {transfers && transfers.length > 0 ? (
            <div className="space-y-3">
              {transfers.map((transfer, index) => {
                // Tạo hash giả để hiển thị dựa trên index nếu không có transactionId
                const transactionHash = transfer.transactionId
                  ? transfer.transactionId.toString('hex')
                  : `tx${Date.now()}${index}`;

                const isReceived = transfer.isInput;
                const amount = formatAmount(transfer.delta);
                const symbol = transfer.asset?.symbol || 'TOKEN';

                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/30 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            {truncateHash(transactionHash)}
                          </span>
                          <span
                            className={`ml-2 text-xs ${isReceived ? 'text-green-500' : 'text-blue-500'}`}
                          >
                            {transfer.operationName || (isReceived ? 'Received' : 'Sent')}
                          </span>
                        </div>
                        {isReceived ? (
                          <ArrowDownRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-blue-500" />
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {transfer.timestamp
                              ? format(new Date(transfer.timestamp), 'dd/MM/yy')
                              : '-'}
                          </span>
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          <span>
                            {transfer.timestamp
                              ? format(new Date(transfer.timestamp), 'HH:mm')
                              : '-'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {isReceived ? '+' : '-'}
                          {amount} {symbol}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/30 via-secondary/50 to-secondary/30 p-4 shadow-sm backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
              <div className="relative text-center">
                <p className="text-sm text-muted-foreground">No transactions found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
