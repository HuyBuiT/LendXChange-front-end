'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { SolanaSupportedTokenEnum } from '@/models';
import Image from 'next/image';

const AmountComponent: React.FC<AmountComponentProps> = ({
  amount,
  className,
  tokenSupported,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex items-center gap-x-2', className)}
      {...otherProps}
    >
      <Image
        src={CommonUtils.getTokenImageSrcByValue(tokenSupported)}
        alt="token image"
        className="w-6 h-6 lg:w-8 lg:h-8"
      />
      <p className="text-sm text-neutral1">
        {FormatUtils.formatNumber(amount)} {tokenSupported}
      </p>
    </div>
  );
};

export default AmountComponent;

interface AmountComponentProps extends ComponentPropsWithoutRef<'div'> {
  amount: number;
  tokenSupported: SolanaSupportedTokenEnum;
}
