'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const CommonTh: React.FC<ComponentPropsWithoutRef<'th'>> = ({
  className,
  children,
}) => {
  return (
    <th
      className={twMerge(
        'px-4 py-3',
        'font-inter font-normal',
        'text-sm text-neutral5 text-start',
        'first:rounded-tl-lg last:rounded-tr-lg',
        className,
      )}
    >
      {children}
    </th>
  );
};

export default CommonTh;
