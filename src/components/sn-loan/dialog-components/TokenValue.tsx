'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';
import { SolanaSupportedTokenEnum } from '@/models';
import { twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';

import Image from 'next/image';

const TokenValue: React.FC<TokenValueProps> = ({
  value,
  token,
  className,
  percentage,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex items-center gap-x-1', className)}
      {...otherProps}
    >
      {percentage !== undefined ? (
        <span className="text-xs text-neutral5">{`(${percentage}%)`}</span>
      ) : (
        <Fragment />
      )}

      <span>{FormatUtils.formatNumber(value, 2)}</span>

      <Image
        width={24}
        height={24}
        alt="Token image"
        src={CommonUtils.getTokenImageSrcByValue(token)}
      />
    </div>
  );
};

export default TokenValue;

interface TokenValueProps extends ComponentPropsWithoutRef<'div'> {
  value: number;
  percentage?: number;
  token: SolanaSupportedTokenEnum;
}
