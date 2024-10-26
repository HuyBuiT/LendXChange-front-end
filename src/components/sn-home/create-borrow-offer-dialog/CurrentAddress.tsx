'use client';

import React from 'react';

import { CommonUtils } from '@/utils';
import { WalletIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';

const CurrentAddress: React.FC<CurrentAddressProps> = ({
  className,
  walletAddress,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'rounded-r',
        'py-2 px-4',
        'bg-characterBackground2',
        'flex items-center gap-x-4',
        className,
      )}
      {...otherProps}
    >
      <WalletIcon className="text-neutral5" />
      <span className={twJoin('font-medium', 'text-neutral1 text-sm')}>
        {CommonUtils.truncateHash(walletAddress)}
      </span>
    </div>
  );
};

export default CurrentAddress;

interface CurrentAddressProps extends React.ComponentPropsWithoutRef<'div'> {
  walletAddress: string;
}
