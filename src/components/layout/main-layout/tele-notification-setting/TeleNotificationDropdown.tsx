'use client';

import React from 'react';
import {
  DropdownRoot,
  DropdownContent,
  DropdownTrigger,
} from '@/components/common';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import ContentNotification from './ContentNotification';

const TeleNotificationDropdown: React.FC<DropdownMenuProps> = ({
  open,
  children,
  onOpenChange,
}) => {
  const handleCloseDropdown = () => {
    if (onOpenChange instanceof Function) {
      onOpenChange(false);
    }
  };

  return (
    <DropdownRoot open={open} onOpenChange={onOpenChange}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownContent className="border-none" align="end">
        <ContentNotification onClose={() => handleCloseDropdown()} />
      </DropdownContent>
    </DropdownRoot>
  );
};

export default TeleNotificationDropdown;
