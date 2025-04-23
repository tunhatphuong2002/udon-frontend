'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/common/dialog';
import { Button } from '@/components/common/button';
import { Typography } from '@/components/common/typography';
import { Info } from 'lucide-react';

interface SupplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetName?: string;
}

export const SupplyModal: React.FC<SupplyModalProps> = ({ open, onOpenChange, assetName }) => {
  const [amount, setAmount] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleConfirm = () => {
    // Here we would process the supply transaction
    console.log(`Supplying ${amount} ${assetName}`);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setAmount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full mx-auto text-left rounded-2xl bg-card p-5 sm:p-7 border-border">
        <DialogHeader className="space-y-2">
          <DialogTitle asChild>
            <Typography variant="h3" weight="semibold" className="text-xl sm:text-2xl">
              Supply {assetName}
            </Typography>
          </DialogTitle>
          <DialogDescription asChild>
            <Typography variant="small" color="submerged" className="text-sm sm:text-md">
              To supply <span className="font-bold">{assetName}</span>, enter the amount and click
              &apos;Confirm&apos;.
            </Typography>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4 sm:mt-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2" htmlFor="supply-amount">
              <Typography variant="small" weight="medium">
                Amount
              </Typography>
              <span
                className="inline-flex items-center"
                title="Enter the amount you want to supply"
              >
                <Info className="h-4 w-4 text-primary cursor-help" />
              </span>
            </label>
            <input
              id="supply-amount"
              type="number"
              className="w-full rounded-xl border border-border bg-secondary py-2 px-3 text-base sm:text-lg text-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Enter amount"
              min={0}
              value={amount}
              onChange={handleAmountChange}
              aria-label={`Amount of ${assetName} to supply`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              variant="default"
              onClick={handleConfirm}
              className="w-full rounded-xl px-4 py-3 font-semibold text-sm sm:text-base order-1 sm:order-1"
              disabled={!amount}
              aria-label={`Confirm supplying ${amount} ${assetName}`}
            >
              Confirm
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full rounded-xl text-muted-foreground border-border hover:bg-accent order-2 sm:order-2"
                aria-label="Cancel supply operation"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
