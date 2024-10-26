'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Item, DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';

const DropdownItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <Item
      className={twMerge(
        'p-4',
        'cursor-pointer',
        'first:border-t-transparent',
        'border-t border-t-neutral7',
        'focus-visible:outline-none',
        'text-neutral1 font-semibold',
        'hover:bg-characterBackground3',
        'first:rounded-t-lg last:rounded-b-lg',
        className,
      )}
      {...otherProps}
    >
      {children}
    </Item>
  );
};

export default DropdownItem;
