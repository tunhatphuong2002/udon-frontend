'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
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
    id: '1',
    amount: 5.25,
    type: 'slow',
    status: 'ready',
    createdAt: new Date('2024-01-01'),
    completionDate: new Date('2024-01-15'),
  },
];

export const ReadyClaims: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const readyPositions = positions.filter(p => p.status === 'ready');

  const handleClaim = async (positionId: string, amount: number) => {
    setIsProcessing(positionId);
    try {
      // Mock claim operation - replace with real claim hook
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully claimed ${amount} CHR`);
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
        <Typography weight="semibold" className="text-xl mb-2">
          No withdrawals ready to claim
        </Typography>
        <Typography className="text-muted-foreground">
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
            key={position.id}
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
                      value={position.amount}
                      suffix=" CHR"
                      decimals={2}
                      className="font-medium"
                    />
                  </div>
                  <Typography variant="small" className="text-muted-foreground">
                    Completed: {position.createdAt.toLocaleDateString()}
                  </Typography>
                </div>
              </div>
              <Button
                variant="gradient"
                onClick={() => handleClaim(position.id, position.amount)}
                disabled={isProcessing === position.id}
                className="px-6"
              >
                {isProcessing === position.id ? 'Claiming...' : 'Claim'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
