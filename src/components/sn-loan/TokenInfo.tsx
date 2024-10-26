'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '@/models';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonUtils } from '@/utils';
import Image from 'next/image';

const TokenInfo: React.FC<TokenInfoProps> = ({
  token,
  width,
  height,
  amount,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex items-center gap-x-1', className)}
      {...otherProps}
    >
      <div className={twJoin('relative')}>
        <Image
          width={width || 24}
          height={height || 24}
          alt={`${token} Image`}
          src={CommonUtils.getTokenImageSrcByValue(token)}
        />
        {/* <Image
          width={16}
          height={16}
          alt={`${chain} chain`}
          src={CommonUtils.getChainImageSrcByValue(chain)}
          className={twJoin(
            'absolute -right-1 -bottom-1',
            'border border-neutral4 rounded-full',
          )}
        /> */}
      </div>
      <span>{amount}</span>
      <span>{token}</span>
    </div>
  );
};

export default TokenInfo;

interface TokenInfoProps extends ComponentPropsWithoutRef<'div'> {
  token: SolanaSupportedTokenEnum;
  amount: number;
  chain: SupportedChainEnum;
  width?: number;
  height?: number;
}
