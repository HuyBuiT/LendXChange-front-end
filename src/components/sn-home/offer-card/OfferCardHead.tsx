'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { MenuTwoLineIcon } from '@/components/icons';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '@/models';
import Image from 'next/image';

const OfferCardHead: React.FC<OfferCardHeadProps> = ({
  token,
  amount,
  className,
  onViewOrder,
}) => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <div className={twMerge('space-between-root', className)}>
      <div className={twJoin('flex items-center gap-x-2 uppercase')}>
        {amount ? (
          <>
            <div className={twJoin('relative')}>
              <Image
                width={32}
                height={32}
                alt={`${token} token`}
                src={CommonUtils.getTokenImageSrcByValue(token)}
              />
              {/* <Image
                width={21}
                height={21}
                alt={`${chain} chain`}
                src={CommonUtils.getChainImageSrcByValue(chain)}
                className={twJoin(
                  "absolute -right-1 -bottom-1",
                  "border border-neutral4 rounded-full"
                )}
              /> */}
            </div>
            {FormatUtils.formatNumber(amount)} {token}
          </>
        ) : (
          '--'
        )}
      </div>
      <button
        className={twJoin('flex items-center gap-x-1', 'text-primary5')}
        onClick={onViewOrder}
      >
        <MenuTwoLineIcon className="w-4 h-4" />
        <p className="text-sm font-medium">{getLabel('lViewOrder')}</p>
      </button>
    </div>
  );
};

export default OfferCardHead;

interface OfferCardHeadProps extends ComponentPropsWithoutRef<'div'> {
  amount: number;
  onViewOrder: () => void;
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum;
}
