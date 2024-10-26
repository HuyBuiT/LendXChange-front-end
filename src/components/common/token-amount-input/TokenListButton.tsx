'use client';

import React from 'react';
import { CommonUtils } from '@/utils';
import { CaretIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';
import { SupportedChainEnum, SupportTokenType } from '@/models';
import Image from 'next/image';

const TokenListButton: React.FC<TokenListButtonProps> = ({
  className,
  selectedToken,
  ...otherProps
}) => {
  return (
    <span
      className={twMerge(
        'px-0 mr-2',
        'bg-transparent',
        'flex items-center gap-x-2',
        className,
      )}
      {...otherProps}
    >
      <Image
        width={32}
        height={32}
        className="!w-8 !h-8"
        alt="Selected token"
        src={CommonUtils.getTokenImageSrcByValue(selectedToken)}
      />

      <span
        className={twJoin('inline-block', 'uppercase', 'text-xl text-neutral1')}
      >
        {selectedToken}
      </span>

      <span className={twJoin('inline-block', 'w-6 h-6')}>
        <CaretIcon className="text-neutral5" />
      </span>
    </span>
  );
};

export default TokenListButton;

interface TokenListButtonProps extends React.ComponentPropsWithoutRef<'span'> {
  selectedChain: SupportedChainEnum;
  selectedToken: SupportTokenType;
}
