"use client";

import * as React from "react";
import { CheckCircle } from "lucide-react";
import { create } from "zustand";

import Button from "@/components/chromia-ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/common/dialog";

// Create a store for managing modal state
interface AccountCreatedModalStore {
  isOpen: boolean;
  show: () => void;
  hide: () => void;
}

const useAccountCreatedStore = create<AccountCreatedModalStore>((set) => ({
  isOpen: false,
  show: () => set({ isOpen: true }),
  hide: () => set({ isOpen: false }),
}));

// Modal component
export const AccountCreatedModal: React.FC = () => {
  const { isOpen, hide } = useAccountCreatedStore();

  return (
    <Dialog open={isOpen} onOpenChange={hide}>
      <DialogContent className="sm:max-w-md">
        <div className="grid place-items-center py-8">
          <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
          <DialogTitle className="text-center">
            Thanks for creating an account!
          </DialogTitle>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="secondary" onClick={hide}>
            Great!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook for using the modal
export const useAccountCreatedModal = () => {
  const { show, hide, isOpen } = useAccountCreatedStore();
  
  return {
    show,
    hide,
    visible: isOpen,
  };
};
