'use client';

import React from 'react';
import { CommonUtils, FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { HeaderItem } from '../create-lend-offer-dialog/DialogHeader';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '@/models';
import Image from 'next/image';

const BorrowDialogHeader: React.FC<BorrowDialogHeaderProps> = ({
  token,
  amount,
  durations,
  borrowInterest,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <div
      className={twJoin(
        'pb-4',
        'mb-3',
        'w-full',
        'space-between-root',
        'border-b border-b-characterBackground2',
      )}
    >
      <HeaderItem
        label={getLabel('lAmount')}
        detail={
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
      <HeaderItem
        label={getLabel('lBorrowAPR')}
        detail={`${borrowInterest}%`}
      />
    </div>
  );
};

export default BorrowDialogHeader;

interface BorrowDialogHeaderProps {
  amount: number;
  durations: number;
  borrowInterest: number;
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum;
}
