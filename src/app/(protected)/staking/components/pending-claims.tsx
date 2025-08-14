'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';

interface WithdrawPosition {
  id: string;
  amount: number;
  type: 'slow' | 'quick';
  status: 'pending' | 'ready' | 'completed';
  createdAt: Date;
  completionDate?: Date;
  remainingDays?: number;
}

// Mock data - replace with real data hooks
const positions: WithdrawPosition[] = [
  {
    id: '2',
    amount: 10.0,
    type: 'slow',
    status: 'pending',
    createdAt: new Date('2024-01-10'),
    remainingDays: 7,
  },
  {
    id: '4',
    amount: 15.75,
    type: 'slow',
    status: 'pending',
    createdAt: new Date('2024-01-12'),
    remainingDays: 12,
  },
];

export const PendingClaims: React.FC = () => {
  const pendingPositions = positions.filter(p => p.status === 'pending');

  if (pendingPositions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography weight="semibold" className="text-xl mb-2">
          No pending withdrawals
        </Typography>
        <Typography className="text-muted-foreground">
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
          {pendingPositions.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {pendingPositions.map(position => (
          <div key={position.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/tokens/chr.png" alt="CHR" />
                  <AvatarFallback>CHR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CountUp
                      value={position.amount}
                      suffix=" CHR"
                      decimals={2}
                      className="font-medium"
                    />
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    Create: {position.createdAt.toLocaleDateString()}
                  </Typography>
                </div>
              </div>
              <div className="text-right">
                <Typography variant="small" className="text-muted-foreground">
                  {position.remainingDays} days left
                </Typography>
                <div className="w-24 h-2 bg-muted rounded-full mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#52E5FF] via-[#36B1FF] to-[#E4F5FF] rounded-full transition-all"
                    style={{
                      width: `${Math.max(0, 100 - ((position.remainingDays || 0) / 14) * 100)}%`,
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
