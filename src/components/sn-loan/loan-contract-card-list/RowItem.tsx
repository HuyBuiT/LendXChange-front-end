'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const RowItem: React.FC<RowItemProps> = ({
  label,
  children,
  ...otherProps
}) => {
  return (
    <div className={twMerge('w-full', 'space-between-root')} {...otherProps}>
      <p className="text-sm text-neutral5">{label}</p>
      <span className="text-sm text-neutral1">{children}</span>
    </div>
  );
};

export default RowItem;

interface RowItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}
