'use client';

import React, { ReactNode, ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const ContractCardRow: React.FC<OpenOfferCardRowProps> = ({
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
      <div className="text-sm text-neutral5">{label}</div>
      {children}
    </div>
  );
};

export default ContractCardRow;

interface OpenOfferCardRowProps extends ComponentPropsWithoutRef<'div'> {
  label: ReactNode;
}
