'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { FormatUtils } from '@/utils';
import { twJoin, twMerge } from 'tailwind-merge';

import Image, { StaticImageData } from 'next/image';

const LendAndWaitingInterest: React.FC<LendAndWaitingInterestProps> = ({
  interest,
  tokenImageSrc,
  interestPercent,

  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'text-sm',
        'w-fit h-full',
        'flex items-center gap-x-1',
        className,
      )}
      {...otherProps}
    >
      <p className={twJoin('text-neutral5', 'mr-1')}>({interestPercent}%)</p>
      <p className="text-neutral1">{FormatUtils.formatNumber(interest) || 0}</p>
      <Image src={tokenImageSrc} alt="token image" width={20} height={20} />
    </div>
  );
};

export default LendAndWaitingInterest;

interface LendAndWaitingInterestProps extends ComponentPropsWithoutRef<'div'> {
  interest: number;
  interestPercent: number;
  tokenImageSrc: string | StaticImageData;
}
