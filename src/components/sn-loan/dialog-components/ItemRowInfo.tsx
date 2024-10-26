'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

const ItemRowInfo: React.FC<ItemRowInfoProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('w-full', 'space-between-root', className)}
      {...otherProps}
    >
      <span className={twJoin('flex items-center gap-x-1', 'text-neutral5')}>
        {label}
      </span>

      <div className="text-neutral1">{children}</div>
    </div>
  );
};

export default ItemRowInfo;

interface ItemRowInfoProps extends ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode;
}
