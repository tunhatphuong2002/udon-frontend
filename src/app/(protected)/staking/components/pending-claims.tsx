'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';
import { UnstakingPosition } from '@/app/(protected)/dashboard/types';

interface PendingClaimProps {
  dataUnstakingPos: UnstakingPosition[];
  isLoading: boolean;
  refetchUnstakingPos: () => void;
}

export const PendingClaims: React.FC<PendingClaimProps> = ({
  dataUnstakingPos,
  // isLoading,
  // refetchStakingPos,
}) => {
  if (!dataUnstakingPos || dataUnstakingPos.length === 0) {
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
          {dataUnstakingPos.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {dataUnstakingPos.map(position => (
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
                      value={Number(position.netAmount)}
                      suffix=" CHR"
                      decimals={2}
                      className="font-medium"
                    />
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    Create: {new Date(Number(position.requestedAt)).toLocaleString()}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  // Use bigint or number for requestedAt/availableAt
                  const req = Number(position.requestedAt);
                  const avail = Number(position.availableAt);
                  // If timestamp is in seconds, convert to ms
                  const now = Date.now();
                  const isSec = req < 1e12;
                  const requestedAt = isSec ? req * 1000 : req;
                  const availableAt = avail
                    ? avail < 1e12
                      ? avail * 1000
                      : avail
                    : requestedAt + 14 * 24 * 60 * 60 * 1000;
                  const totalMs = availableAt - requestedAt;
                  const leftMs = Math.max(0, availableAt - now);
                  const daysLeft = Math.ceil(leftMs / (24 * 60 * 60 * 1000));
                  const progressPercent = Math.min(
                    100,
                    Math.max(0, ((now - requestedAt) / totalMs) * 100)
                  );
                  return (
                    <>
                      <Typography variant="small" className="text-muted-foreground">
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </Typography>
                      <div className="w-24 h-2 bg-muted rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
