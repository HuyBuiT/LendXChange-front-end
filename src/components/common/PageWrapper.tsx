'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const PageWrapper: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'h-full w-full',
        'overflow-y-scroll overflow-x-hidden',
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
