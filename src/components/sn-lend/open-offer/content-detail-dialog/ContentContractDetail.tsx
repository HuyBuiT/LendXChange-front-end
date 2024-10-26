'use client';

import React, {
  useMemo,
  Fragment,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';

import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twMerge, twJoin } from 'tailwind-merge';
import { LendStatus, LoanStatus, SolanaSupportedTokenEnum } from '@/models';
import { CommonUtils, FormatUtils } from '@/utils';
import Image from 'next/image';

const ContentContractDetail: React.FC<ContentContractDetailProps> = ({
  token,
  status,
  durations,
  lendAmount,
  numberOffers,
  interestValue,

  lenderFee = 0,
  waitingInterestAmount = 0,
  waitingInterestPercent,
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const interestTokenValue = useMemo(() => {
    if (status === LendStatus.CANCELING || status === LendStatus.CANCELLED)
      return 0;
    const totalOffersValue = CommonUtils.calculateInterestValue(
      lendAmount,
      interestValue,
      durations,
      numberOffers,
    );

    return FormatUtils.formatNumber(totalOffersValue || 0);
  }, [lendAmount, interestValue, numberOffers]);

  const lenderFeeTokenValue = useMemo(() => {
    const totalOffersFeeValue = Number(interestTokenValue) * (lenderFee / 100);

    return FormatUtils.formatNumber(totalOffersFeeValue || 0);
  }, [interestTokenValue, lenderFee]);
  return (
    <div className={twJoin('mt-4 mb-3', 'gap-y-4', 'flex flex-col')}>
      <InterestItemDetail
        token={token}
        startLabel={getLendLabel('lLendInterest')}
        endLabel={interestTokenValue}
        prefix={`(${Number(interestValue)}%)`}
      />
      <InterestItemDetail
        token={token}
        startLabel={getHomeLabel('lWaitingInterest')}
        endLabel={waitingInterestAmount}
        prefix={`(${Number(waitingInterestPercent)}%)`}
      />
      <InterestItemDetail
        token={token}
        startLabel={getHomeLabel('lLenderFee')}
        endLabel={lenderFeeTokenValue}
      />
      <InterestItemDetail
        token={token}
        startLabel={getLendLabel('lTotalReceive')}
        endLabel={FormatUtils.formatNumber(
          Number(lendAmount) +
            Number(interestTokenValue) +
            Number(waitingInterestAmount) -
            Number(lenderFeeTokenValue),
        )}
        prefix=""
      />
    </div>
  );
};

export default ContentContractDetail;

interface ContentContractDetailProps {
  token: SolanaSupportedTokenEnum;
  durations: number;
  lendAmount: number;
  numberOffers: number;
  interestValue: number;
  status: LendStatus | LoanStatus;

  lenderFee?: number;
  waitingInterestAmount: number;
  waitingInterestPercent: number;
}

export const InterestItemDetail: React.FC<InterestItemDetailProps> = ({
  isShowTokenImage = true,
  endClassName,
  className,
  startLabel,
  endLabel,
  prefix,
  token,
}) => {
  return (
    <div className={twMerge('w-full', 'space-between-root', className)}>
      <span className="text-neutral5">{startLabel}</span>

      <div className={twJoin('gap-x-2', 'flex items-center')}>
        <span className="text-sm text-neutral5">{prefix}</span>
        <span className={twMerge('text-neutral1', endClassName)}>
          {endLabel}
        </span>

        {isShowTokenImage ? (
          <Image
            width={24}
            height={24}
            alt="Token logo"
            src={CommonUtils.getTokenImageSrcByValue(token)}
          />
        ) : (
          <Fragment />
        )}
      </div>
    </div>
  );
};

interface InterestItemDetailProps extends ComponentPropsWithoutRef<'div'> {
  isShowTokenImage?: boolean;
  endClassName?: string;
  startLabel: ReactNode;
  endLabel: ReactNode;
  prefix?: string;
  token: SolanaSupportedTokenEnum;
}
