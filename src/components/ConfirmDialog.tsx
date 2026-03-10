import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 ring-8 ring-red-50"
        >
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </motion.div>
        <p className="mb-8 text-sm text-slate-500">{description}</p>
        <div className="flex w-full justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
