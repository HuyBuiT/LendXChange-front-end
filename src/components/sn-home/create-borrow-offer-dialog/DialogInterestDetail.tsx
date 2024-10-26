'use client';

import React, { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { CommonUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { HealthRatio } from '@/components/common';
import { SolanaSupportedTokenEnum } from '@/models';
import { InterestItemDetail } from '../create-lend-offer-dialog/DialogInterestDetail';
import InfoTooltip from '../InfoTooltip';

const DialogInterestDetail: React.FC<DialogInterestDetailProps> = ({
  token,
  durations,
  healthRatio,
  borrowAmount,
  borrowInterest,

  borrowFee,
  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const [isShowHealthRatioTooltip, setIsShowHealthRatioTooltip] =
    useState(false);
  const [isShowBorrowFeeTooltip, setIsShowBorrowFeeTooltip] = useState(false);

  const borrowInterestValue = useMemo(() => {
    return CommonUtils.calculateInterestValue(
      borrowAmount,
      borrowInterest,
      durations,
    );
  }, [borrowAmount, borrowInterest, durations]);

  const borrowFeeValue = useMemo(() => {
    return borrowInterestValue * (borrowFee / 100);
  }, [borrowInterestValue, borrowFee]);

  const totalRepay = useMemo(() => {
    return borrowAmount + borrowInterestValue + borrowFeeValue;
  }, [borrowAmount, borrowInterestValue, borrowFeeValue]);

  return (
    <div
      className={twJoin('mt-4 mb-6', 'gap-y-4', 'flex flex-col')}
      {...otherProps}
    >
      <InterestItemDetail
        token={token}
        isShowTokenImage={false}
        startLabel={
          <>
            {getHomeLabel('lHealthRatio')}

            <InfoTooltip
              isOpen={isShowHealthRatioTooltip}
              onChangeOpen={(value) => setIsShowHealthRatioTooltip(value)}
              contentTooltip={
                <>
                  {getHomeLabel('msgContentHealthRatioTooltip')}
                  <a
                    href={process.env.NEXT_PUBLIC_GIT_BOOK_HEALTH_RATIO}
                    target="_blank"
                    className="ml-1 underline"
                  >
                    {getHomeLabel('lViewDetail')}
                  </a>
                </>
              }
            />
          </>
        }
        endLabel={<HealthRatio value={healthRatio} />}
        startClassName="flex items-center gap-x-2"
      />

      <span className={twJoin('self-end', 'text-sm text-neutral5')}>
        {getHomeLabel('fmLiquidAt', {
          value: process.env.LIQUID,
        })}
      </span>

      <InterestItemDetail
        token={token}
        endLabel={borrowInterestValue.toFixed(2)}
        startLabel={getHomeLabel('lBorrowInterest')}
        prefix={`(${borrowInterest}%)`}
      />

      <InterestItemDetail
        token={token}
        endLabel={borrowFeeValue.toFixed(2)}
        startLabel={
          <>
            {getHomeLabel('lBorrowFee')}

            <InfoTooltip
              isOpen={isShowBorrowFeeTooltip}
              onChangeOpen={(value) => setIsShowBorrowFeeTooltip(value)}
              contentTooltip={getHomeLabel('msgContentBorrowerFeeTooltip')}
            />
          </>
        }
        startClassName="flex items-center gap-x-2"
      />

      <InterestItemDetail
        token={token}
        endLabel={totalRepay.toFixed(2)}
        startLabel={getHomeLabel('lTotalYouNeedToRepay')}
      />
    </div>
  );
};

export default DialogInterestDetail;

interface DialogInterestDetailProps extends ComponentPropsWithoutRef<'div'> {
  token: SolanaSupportedTokenEnum;
  durations: number;
  healthRatio: number;
  borrowAmount: number;
  borrowInterest: number;

  borrowFee: number;
}
