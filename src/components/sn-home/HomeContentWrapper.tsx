'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';

const HomeContentWrapper: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twJoin(
        'rounded-t-xl',
        'w-full h-full',
        '-mt-3 sm:mt-6',
        'px-4 pt-6 sm:p-0',
        'border-t sm:border-none border-t-neutral1/50',
        'bg-characterBackground3 sm:bg-characterBackground1',
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default HomeContentWrapper;
