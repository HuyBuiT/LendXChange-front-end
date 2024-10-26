'use client';

import React, { ReactNode } from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonUtils, FormatUtils } from '@/utils';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '@/models';
import Image from 'next/image';

const DialogHeader: React.FC<DialogHeaderProps> = ({
  token,
  amount,
  durations,
  bestOffer,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <div
      className={twJoin(
        'pb-4',
        'mb-3',
        'w-full',
        'flex items-center',
        'border-b border-b-characterBackground2',
        bestOffer ? 'justify-between' : 'justify-start gap-x-[140px]',
      )}
    >
      <HeaderItem
        label={getLabel('lAmount')}
        detail={
          // TODO: Update image when implement new chain?
          <>
            <div className={twJoin('relative')}>
              <Image
                width={24}
                height={24}
                alt="Token logo"
                src={CommonUtils.getTokenImageSrcByValue(token)}
              />
              {/* <Image
                width={16}
                height={16}
                alt="Token logo"
                src={CommonUtils.getChainImageSrcByValue(chain)}
                className={twJoin(
                  'absolute -right-1 -bottom-1',
                  'border border-neutral4 rounded-full',
                )}
              /> */}
            </div>
            {FormatUtils.formatNumber(amount)}
          </>
        }
      />
      <HeaderItem
        label={getLabel('lDuration')}
        detail={getHomeLabel('fmDays', { duration: durations })}
      />
      {bestOffer && (
        <HeaderItem label={getLabel('lBestOffers')} detail={`${bestOffer}%`} />
      )}
    </div>
  );
};

export default DialogHeader;

interface DialogHeaderProps {
  token: SolanaSupportedTokenEnum;
  chain: SupportedChainEnum;
  amount: number;
  durations: number;
  bestOffer?: number;
}

export const HeaderItem = ({
  label,
  detail,
}: {
  label: string;
  detail: ReactNode;
}) => {
  return (
    <div className={twJoin('flex flex-col gap-y-2')}>
      <p className="text-neutral5">{label}</p>
      <span className={twJoin('flex gap-x-1', 'text-neutral1 font-semibold')}>
        {detail}
      </span>
    </div>
  );
};
