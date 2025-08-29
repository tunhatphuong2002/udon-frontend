'use client';

import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';
import { toast } from 'sonner';

import { UnstakingPosition, UnstakingStatus } from '@/app/(protected)/dashboard/types';

interface CompletedClaimsProps {
  positions: UnstakingPosition[];
  onViewTx?: (position: UnstakingPosition) => void;
}

export const CompletedClaims: React.FC<CompletedClaimsProps> = ({ positions, onViewTx }) => {
  const completedPositions = positions.filter(p => p.unstakingStatus === UnstakingStatus.CLAIMED);

  if (completedPositions.length === 0) {
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
          Completed Withdrawals
        </Typography>
        <Badge variant="secondary" className="text-primary-foreground">
          {completedPositions.length} completed
        </Badge>
      </div>

      <div className="space-y-3">
        {completedPositions.map(position => (
          <div
            key={position.positionId.toString('hex')}
            className="bg-card border border-border rounded-xl p-4 opacity-75"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/tokens/chr.png" alt="CHR" />
                  <AvatarFallback>CHR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CountUp
                      value={position.netAmount}
                      suffix=" CHR"
                      decimals={2}
                      className="font-medium"
                    />
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    Claimed:{' '}
                    {position.completedAt
                      ? new Date(position.completedAt).toLocaleDateString()
                      : '-'}
                  </Typography>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (onViewTx) onViewTx(position);
                  else toast.info('Opening transaction details...');
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
