'use client';

import React from 'react';
import { Layers, Gift, Receipt, ArrowDown, Info } from 'lucide-react';
import { format } from 'date-fns';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/dialog';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import { Skeleton } from '@/components/common/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common/tooltip';
import { cn } from '@/utils/tailwind';
import {
  useStchrWithdrawTransactions,
  getStchrWithdrawTransactionsForAsset,
  StchrWithdrawTransaction,
} from '@/hooks/contracts/queries/use-stchr-withdraw-transactions';
import { UserReserveData } from '../../types';

export interface StchrWithdrawTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserve: UserReserveData;
}

export const StchrWithdrawTransactionDialog: React.FC<StchrWithdrawTransactionDialogProps> = ({
  open,
  onOpenChange,
  reserve,
}) => {
  // Fetch stCHR withdraw transactions
  const { data: transactionData, isLoading } = useStchrWithdrawTransactions(open);

  const { transactions, hasTransactions, totalWithdrawn } = getStchrWithdrawTransactionsForAsset(
    reserve.symbol,
    transactionData
  );

  const renderTransactionCard = (transaction: StchrWithdrawTransaction, index: number) => {
    // Determine withdraw type badge color and text
    const getWithdrawTypeBadge = () => {
      switch (transaction.withdrawType) {
        case 'lending_only':
          return { color: 'bg-blue-500/10 text-blue-400', text: 'Lending Pool' };
        case 'hybrid':
          return { color: 'bg-purple-500/10 text-purple-400', text: 'Hybrid' };
        case 'max':
          return { color: 'bg-green-500/10 text-green-400', text: 'Max Withdraw' };
        default:
          return { color: 'bg-gray-500/10 text-gray-400', text: 'Unknown' };
      }
    };

    const typeBadge = getWithdrawTypeBadge();

    return (
      <div
        key={transaction.transactionId.toString('hex')}
        className="group p-4 rounded-xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-muted/20 hover:shadow-lg hover:shadow-[#52E5FF]/10 transition-all duration-300 hover:border-[#52E5FF]/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#52E5FF]/10 border border-[#52E5FF]/20">
              <ArrowDown className="w-4 h-4 text-[#52E5FF]" />
            </div>
            <div>
              <Typography variant="small" className="font-semibold text-foreground">
                Withdraw #{String(transactions.length - index).padStart(3, '0')}
              </Typography>
              <Typography variant="small" className="text-muted-foreground text-xs">
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </div>
          </div>
          <Badge className={cn('text-xs font-medium', typeBadge.color)}>{typeBadge.text}</Badge>
        </div>

        {/* Main Amount */}
        <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border/20">
          <div className="flex items-center justify-between">
            <Typography variant="small" className="text-muted-foreground">
              Total Withdrawn
            </Typography>
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={reserve.iconUrl} alt={reserve.symbol} />
                <AvatarFallback className="text-xs">
                  {reserve.symbol?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Typography variant="small" className="font-bold text-[#52E5FF]">
                {transaction.totalStchrAmount.toFixed(6)} stCHR
              </Typography>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 mb-4">
          <Typography variant="small" className="text-muted-foreground font-medium">
            Source Breakdown:
          </Typography>

          {/* From Lending Pool */}
          {transaction.amountFromLending > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <Typography variant="small" className="text-blue-400">
                  Lending Pool
                </Typography>
              </div>
              <Typography variant="small" className="font-medium text-blue-400">
                {transaction.amountFromLending.toFixed(6)} stCHR
              </Typography>
            </div>
          )}

          {/* From Staking Rewards */}
          {transaction.amountFromStakingRewards > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <Typography variant="small" className="text-purple-400">
                  Staking Rewards
                </Typography>
              </div>
              <Typography variant="small" className="font-medium text-purple-400">
                {transaction.amountFromStakingRewards.toFixed(6)} stCHR
              </Typography>
            </div>
          )}
        </div>

        {/* Portfolio State Before Withdraw */}
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <div className="p-3 rounded-lg bg-muted/10 border border-border/10 cursor-help">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <Typography variant="small" className="text-muted-foreground font-medium">
                    Portfolio Before Withdraw
                  </Typography>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Principal:</span>
                    <span className="font-medium">
                      {transaction.stakingPrincipalBefore.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{transaction.totalStchrBefore.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Staking:</span>
                    <span className="font-medium">
                      {transaction.stakingRewardsBefore.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lending:</span>
                    <span className="font-medium">
                      {transaction.lendingRewardsBefore.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-1 text-xs">
                <p>
                  <strong>Principal:</strong> Original CHR staked amount
                </p>
                <p>
                  <strong>Staking Rewards:</strong> Rewards from BSC staking
                </p>
                <p>
                  <strong>Lending Rewards:</strong> Rewards from lending pool
                </p>
                <p>
                  <strong>Total:</strong> Sum of all stCHR holdings before this withdrawal
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-auto max-h-[90vh] overflow-y-auto rounded-xl">
        <TooltipProvider delayDuration={300}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#52E5FF]/10 border border-[#52E5FF]/20">
                <Receipt className="w-5 h-5 text-[#52E5FF]" />
              </div>
              <div>
                <Typography variant="h3" className="text-foreground">
                  stCHR Withdraw History
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  {reserve.name} • {reserve.symbol}
                </Typography>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Summary Section */}
          {hasTransactions && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#52E5FF]/5 to-purple-500/5 border border-[#52E5FF]/20">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="small" className="text-muted-foreground">
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" className="text-foreground font-bold">
                    {transactions.length}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="small" className="text-muted-foreground">
                    Total Withdrawn
                  </Typography>
                  <Typography variant="h4" className="text-[#52E5FF] font-bold">
                    {totalWithdrawn.toFixed(6)} stCHR
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading State
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-full h-16 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-8" />
                      <Skeleton className="w-full h-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasTransactions ? (
              // Transaction List
              <div className="space-y-4">
                {transactions
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((transaction, index) => renderTransactionCard(transaction, index))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <Receipt className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <Typography variant="h4" className="text-muted-foreground mb-2">
                  No Withdraw History
                </Typography>
                <Typography variant="small" className="text-muted-foreground/70 max-w-sm">
                  You haven&apos;t made any stCHR withdrawals yet. Your future withdraw transactions
                  will appear here.
                </Typography>
              </div>
            )}
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
