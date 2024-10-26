'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Content, TabsContentProps } from '@radix-ui/react-tabs';

const TabsContent: React.FC<TabsContentProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <Content className={twMerge('', className)} {...otherProps}>
      {children}
    </Content>
  );
};

export default TabsContent;
