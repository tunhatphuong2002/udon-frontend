'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';
import { toast } from 'sonner';

import { UnstakingPosition, UnstakingStatus } from '@/app/(protected)/dashboard/types';

interface ReadyClaimsProps {
  positions: UnstakingPosition[];
  onClaim: (position: UnstakingPosition) => Promise<void>;
}

export const ReadyClaims: React.FC<ReadyClaimsProps> = ({ positions, onClaim }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  // Only show positions that are ready to claim
  const readyPositions = positions.filter(p => p.unstakingStatus === UnstakingStatus.UNSTAKED);

  const handleClaim = async (position: UnstakingPosition) => {
    setIsProcessing(position.positionId.toString('hex'));
    try {
      await onClaim(position);
    } catch {
      toast.error('Failed to claim withdrawal');
    } finally {
      setIsProcessing(null);
    }
  };

  if (readyPositions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography weight="semibold" className="text-xl mb-2 text-center">
          No withdrawals ready to claim
        </Typography>
        <Typography className="text-muted-foreground text-center">
          Completed withdrawals that are ready to claim will appear here.
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography weight="semibold" className="text-lg">
          Ready to Claim
        </Typography>
        <Badge variant="secondary" className="text-green-500">
          {readyPositions.length} ready
        </Badge>
      </div>

      <div className="space-y-3">
        {readyPositions.map(position => (
          <div
            key={position.positionId.toString('hex')}
            className="bg-card border border-border rounded-xl p-4 hover:border-green-500/30 transition-colors"
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
                    Completed:{' '}
                    {position.completedAt
                      ? new Date(position.completedAt).toLocaleDateString()
                      : '-'}
                  </Typography>
                </div>
              </div>
              <Button
                variant="gradient"
                onClick={() => handleClaim(position)}
                disabled={isProcessing === position.positionId.toString('hex')}
                className="px-6"
              >
                {isProcessing === position.positionId.toString('hex') ? 'Claiming...' : 'Claim'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
