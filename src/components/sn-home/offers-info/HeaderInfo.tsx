'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '@/models';
import Image from 'next/image';

const HeaderInfo: React.FC<HeaderInfoProps> = ({
  className,
  selectedToken,
  tokenOfferInfo,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  const tokenImageSrc = useMemo(() => {
    return CommonUtils.getTokenImageSrcByValue(selectedToken);
  }, [selectedToken]);

  return (
    <div
      className={twMerge('flex items-center', 'px-4', 'gap-x-3', className)}
      {...otherProps}
    >
      <Image width={32} height={32} alt="Offer tokens" src={tokenImageSrc} />
      <div className="flex flex-col">
        <span
          className={twJoin(
            'uppercase',
            'font-semibold',
            'text-sm text-neutral1',
          )}
        >
          {FormatUtils.formatNumber(tokenOfferInfo.value)} {selectedToken}
        </span>

        <span className="text-xs text-neutral1">
          {getLabel('fmDurationDays', { days: tokenOfferInfo.duration })}
        </span>
      </div>
    </div>
  );
};

export default HeaderInfo;

// TODO: Update type when have backend data
interface HeaderInfoProps extends React.ComponentPropsWithoutRef<'div'> {
  selectedChain: SupportedChainEnum;
  selectedToken: SolanaSupportedTokenEnum;
  tokenOfferInfo: TokenOfferInfoType;
}

type TokenOfferInfoType = {
  value: number;
  duration: number;
};
