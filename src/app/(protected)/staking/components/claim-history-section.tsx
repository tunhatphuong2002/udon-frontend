'use client';

import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';

import { UserReserveData } from '@/app/(protected)/dashboard/types';
import { getTxLink } from '@/utils/get-tx-link';
import { toast } from 'sonner';
import { useClaimHistory } from '@/hooks/contracts/queries/use-claim-history';

interface ClaimHistorySectionProps {
  chrAsset?: UserReserveData;
}

export const ClaimHistorySection = ({ chrAsset }: ClaimHistorySectionProps) => {
  const {
    data: claimHistory,
    // isLoading: isLoading,
    // refetch: refetchClaimHistory,
  } = useClaimHistory(
    chrAsset?.assetId || Buffer.from('', 'hex'),
    chrAsset?.decimals || 0,
    !!chrAsset
  );

  if (claimHistory?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography weight="semibold" className="text-xl mb-2 text-center">
          No completed withdrawals
        </Typography>
        <Typography className="text-muted-foreground text-center">
          Your claimed withdrawals will appear here for transaction history.
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography weight="semibold" className="text-lg">
          Claim Section
        </Typography>
        <Badge variant="secondary" className="text-primary-foreground">
          {claimHistory?.length} completed
        </Badge>
      </div>

      <div className="space-y-3">
        {claimHistory?.map(history => (
          <div
            key={history.id.toString('hex')}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chrAsset?.iconUrl} alt={chrAsset?.symbol} />
                  <AvatarFallback>{chrAsset?.symbol}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CountUp
                      value={history.rewardAmount}
                      suffix={` ${chrAsset?.symbol}`}
                      decimals={6}
                      className="font-medium"
                    />
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    Claimed:{' '}
                    {history.completedAt
                      ? new Date(history.completedAt).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : '-'}
                  </Typography>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!history.txCrossChain) {
                    toast.error('No transaction hash found');
                    return;
                  }
                  window.open(getTxLink(history.txCrossChain), '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
