'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const CommonTHead: React.FC<ComponentPropsWithoutRef<'th'>> = ({
  className,
  children,
}) => {
  return (
    <thead
      className={twMerge(
        'bg-characterBackground3',
        'border-b border-b-characterBackground2',
        className,
      )}
    >
      {children}
    </thead>
  );
};

export default CommonTHead;
