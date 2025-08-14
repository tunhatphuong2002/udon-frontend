'use client';

import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';
import { Badge } from '@/components/common/badge';
import CountUp from '@/components/common/count-up';
import { toast } from 'sonner';

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
    id: '3',
    amount: 2.5,
    type: 'quick',
    status: 'completed',
    createdAt: new Date('2024-01-05'),
    completionDate: new Date('2024-01-05'),
  },
];

export const CompletedClaims: React.FC = () => {
  const completedPositions = positions.filter(p => p.status === 'completed');

  if (completedPositions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography weight="semibold" className="text-xl mb-2">
          No completed withdrawals
        </Typography>
        <Typography className="text-muted-foreground">
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
          <div key={position.id} className="bg-card border border-border rounded-xl p-4 opacity-75">
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
                    Claimed: {position.completionDate?.toLocaleDateString()}
                  </Typography>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Open transaction explorer
                  toast.info('Opening transaction details...');
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
