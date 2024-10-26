'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const ItemColumnInfo: React.FC<ItemColumnInfoProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex flex-col gap-y-1', className)}
      {...otherProps}
    >
      <span className="text-neutral5">{label}</span>
      <div className="text-neutral1 font-semibold">{children}</div>
    </div>
  );
};

export default ItemColumnInfo;

interface ItemColumnInfoProps extends ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode;
}
