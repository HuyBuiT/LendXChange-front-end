'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { CommonDialog } from '@/components/common';
import { CommonDialogProps } from '@/components/common/common-dialog';
import ContentNotification from './ContentNotification';

const TeleNotificationDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
  ...otherProps
}) => {
  const handleCloseDialog = () => {
    onClose();
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      dialogTitle={''}
      onClose={onClose}
      isShowIconClose={false}
      contentClassName={twJoin('p-0', 'sm:w-fit h-[80vh] sm:h-fit')}
      {...otherProps}
    >
      <ContentNotification onClose={handleCloseDialog} />
    </CommonDialog>
  );
};

export default TeleNotificationDialog;
