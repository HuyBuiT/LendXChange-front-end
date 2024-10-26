'use client';

import React from 'react';
import {
  Content,
  DropdownMenuContentProps,
} from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';

const DropdownContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <Content
      className={twMerge(
        'z-50',
        'mt-3',
        'rounded-lg',
        'border border-white/20',
        'bg-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      {children}
    </Content>
  );
};

export default DropdownContent;
