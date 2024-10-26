'use client';

import React from 'react';
import {
  DropdownRoot,
  DropdownItem,
  DropdownContent,
  DropdownTrigger,
} from '@/components/common';

import { twMerge } from 'tailwind-merge';
import { useAuthContext } from '@/context';
import { useTranslation } from 'react-i18next';
import { BrokenLinkIcon } from '@/components/icons';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

const DropdownActions: React.FC<DropdownActionsProps> = ({
  children,
  itemClassName,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  const { handleDisconnect } = useAuthContext();

  return (
    <DropdownRoot {...otherProps}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownContent className="w-40" align="start">
        <DropdownItem
          className={twMerge(
            'w-full',
            'flex items-center gap-x-2',
            itemClassName,
          )}
          onClick={handleDisconnect}
        >
          <BrokenLinkIcon />
          {getLabel('lDisconnect')}
        </DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
};

export default DropdownActions;

interface DropdownActionsProps extends DropdownMenuProps {
  itemClassName?: string;
}
