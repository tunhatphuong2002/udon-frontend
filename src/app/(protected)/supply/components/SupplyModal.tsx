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
      <DialogContent className="max-w-md w-full mx-auto text-left rounded-2xl bg-[#1A1F2C] p-5 sm:p-7 border-[#33334a]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-white">
            Supply {assetName}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-md text-[#c3c3c3]">
            To supply <span className="font-bold">{assetName}</span>, enter the amount and click
            &apos;Confirm&apos;.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4 sm:mt-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#d9d9d9] flex items-center gap-2"
              htmlFor="supply-amount"
            >
              Amount
              <span
                className="inline-flex items-center"
                title="Enter the amount you want to supply"
              >
                <Info className="h-4 w-4 text-[#9b87f5] cursor-help" />
              </span>
            </label>
            <input
              id="supply-amount"
              type="number"
              className="w-full rounded-xl border border-[#33334a] bg-[#23263c] py-2 px-3 text-base sm:text-lg text-white outline-none focus:ring-1 focus:ring-[#9b87f5] transition-all"
              placeholder="Enter amount"
              min={0}
              value={amount}
              onChange={handleAmountChange}
              aria-label={`Amount of ${assetName} to supply`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              onClick={handleConfirm}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white rounded-xl px-4 py-3 font-semibold text-sm sm:text-base order-1 sm:order-1"
              disabled={!amount}
              aria-label={`Confirm supplying ${amount} ${assetName}`}
            >
              Confirm
            </Button>
            <DialogClose asChild>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full rounded-xl text-[#d9d9d9] border-[#33334a] hover:bg-[#33334a] hover:text-white order-2 sm:order-2"
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
