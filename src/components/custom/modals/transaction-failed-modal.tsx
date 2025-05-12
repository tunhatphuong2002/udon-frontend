import React, { useState, useCallback } from 'react';
import { Popup } from '@/components/common/popup';

export const TransactionFailedModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <Popup
      variant="fail"
      title="Transaction Failed"
      description={`This request is currently unavailable. Please try again later.`}
      buttonText="Try again"
      onButtonClick={onClose}
    />
  );
};

export function useTransactionFailedModal() {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => {
    setOpen(true);
  }, []);
  const hide = useCallback(() => setOpen(false), []);
  const modal = <TransactionFailedModal open={open} onClose={hide} />;
  return { open, show, hide, modal };
}
