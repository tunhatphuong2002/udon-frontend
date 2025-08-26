'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';
import { UnstakePosition } from '@/hooks/contracts/queries/use-unstaking-positions';

interface PendingClaimProps {
  dataStakingPos: UnstakePosition[];
  isLoading: boolean;
  refetchStakingPos: () => void;
}

export const PendingClaims: React.FC<PendingClaimProps> = ({
  dataStakingPos,
  // isLoading,
  // refetchStakingPos,
}) => {
  if (!dataStakingPos) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography weight="semibold" className="text-xl mb-2 text-center">
          No pending withdrawals
        </Typography>
        <Typography className="text-muted-foreground text-center                                                                                                                                                    ">
          Your pending withdrawal requests will appear here during the 14-day unbonding period.
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography weight="semibold" className="text-lg">
          Pending Withdrawals
        </Typography>
        <Badge variant="secondary" className="text-yellow-500">
          {dataStakingPos.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {dataStakingPos.map(position => (
          <div
            key={position.positionId.toString('hex')}
            className="bg-card border border-border rounded-xl p-4"
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
                    Create: {position.requestedAt}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="small" className="text-muted-foreground">
                  2 days left
                </Typography>
                <div className="w-24 h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] rounded-full transition-all"
                    style={{
                      width: `${Math.max(0, 100 - (2 / 14) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
