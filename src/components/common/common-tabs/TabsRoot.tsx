'use client';

import React from 'react';
import { Root, TabsProps } from '@radix-ui/react-tabs';
import { twMerge } from 'tailwind-merge';

const TabsRoot: React.FC<TabsProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <Root className={twMerge('flex flex-col', className)} {...otherProps}>
      {children}
    </Root>
  );
};

export default TabsRoot;
