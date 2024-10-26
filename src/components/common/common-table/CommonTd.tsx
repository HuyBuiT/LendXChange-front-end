'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const CommonTd: React.FC<ComponentPropsWithoutRef<'td'>> = ({
  className,
  children,
}) => {
  return (
    <td className={twMerge('p-4', 'font-inter text-sm', className)}>
      {children}
    </td>
  );
};

export default CommonTd;
