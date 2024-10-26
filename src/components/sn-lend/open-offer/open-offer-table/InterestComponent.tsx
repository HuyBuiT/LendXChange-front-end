'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { SolanaSupportedTokenEnum } from '@/models';
import Image from 'next/image';

const InterestComponent: React.FC<InterestComponentProps> = ({
  interest,
  className,
  tokenSupported,
  interestPercent,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex flex-col gap-y-1', className)}
      {...otherProps}
    >
      <p className="text-neutral1 text-sm">{interestPercent}</p>
      <div className="flex items-center gap-x-1">
        <Image
          src={CommonUtils.getTokenImageSrcByValue(tokenSupported)}
          alt="token image"
          width={16}
          height={16}
        />
        <p className="text-neutral5 text-xs">
          {FormatUtils.formatNumber(interest) || 0}
        </p>
      </div>
    </div>
  );
};

export default InterestComponent;

interface InterestComponentProps extends ComponentPropsWithoutRef<'div'> {
  interest: number;
  interestPercent: string | number;
  tokenSupported: SolanaSupportedTokenEnum;
}
