'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { CommonDialog } from '@/components/common';

const ErrorConnectDialog: React.FC<ErrorConnectDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={title}
      titleClassName={twJoin('font-normal', 'text-lg text-neutral2')}
    >
      <span
        className={twJoin(
          'my-6',
          'w-full',
          'font-normal',
          'inline-block',
          'text-lg text-center',
        )}
      >
        {message}
      </span>
    </CommonDialog>
  );
};

export default ErrorConnectDialog;

interface ErrorConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}
