'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { List, TabsListProps } from '@radix-ui/react-tabs';

const TabsList: React.FC<TabsListProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <List className={twMerge('flex', className)} {...otherProps}>
      {children}
    </List>
  );
};

export default TabsList;
