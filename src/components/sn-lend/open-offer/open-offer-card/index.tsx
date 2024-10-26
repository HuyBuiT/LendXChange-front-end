'use client';

import React, { useMemo } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonUtils, DateUtils, FormatUtils } from '@/utils';
import {
  LendStatus,
  OpenLendOfferViewInterface,
  TokenDecimalsEnum,
} from '@/models';

import LendAndWaitingInterest from './LendAndWaitingInterest';
import CancelButton from '../CancelButton';
import EditButton from '../EditButton';
import Image from 'next/image';
import DetailOfferButton from '../DetailOfferButton';

const OpenOfferCard: React.FC<OpenOfferCardProps> = ({ openLendOfferData }) => {
  const { t: getLabel } = useTranslation();
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { lendInterest, waitingInterest, waitingInterestPercent } =
    useMemo(() => {
      const totalOffersValue = CommonUtils.calculateInterestValue(
        openLendOfferData.amount,
        openLendOfferData.lendInterestPercent,
        DateUtils.convertSecondsToDayHourMinute(openLendOfferData.duration).day,
      );

      const totalOffersWaitingValue = FormatUtils.convertDisplayUnit(
        openLendOfferData.waitingInterest,
        TokenDecimalsEnum.USDC,
      );

      const waitingInterestPercent = CommonUtils.calculateTotalInterestPercent({
        waitingInterestAmount: FormatUtils.convertDisplayUnit(
          openLendOfferData.waitingInterest,
          TokenDecimalsEnum.USDC,
        ),
        lendingAmount: openLendOfferData.amount,
        startDate: openLendOfferData.startDate,
        endDate: openLendOfferData.endDateInterest,
      });

      return {
        lendInterest: totalOffersValue,
        waitingInterest: totalOffersWaitingValue,
        waitingInterestPercent,
      };
    }, [openLendOfferData]);

  const getLabelCanceledStatus = (cancelTime: number) => {
    const timeLabel = CommonUtils.getTimeLabel(getLabel, cancelTime);

    return getLendLabel('fmCancelAgo', { time: timeLabel });
  };

  const getLabelSeekingStatus = (seekingTime: number) => {
    const timeLabel = CommonUtils.getTimeLabel(getLabel, seekingTime);

    return getLendLabel('fmSeekingBorrower', { time: timeLabel });
  };

  return (
    <div
      className={twMerge(
        'py-4 px-5',
        'rounded-lg',
        'flex flex-col gap-y-2',
        'bg-characterBackground2',
      )}
    >
      <div className={twJoin('flex items-center gap-x-2')}>
        <Image
          src={CommonUtils.getTokenImageSrcByValue(openLendOfferData.token)}
          alt="Token image"
        />

        <p>
          {FormatUtils.formatNumber(openLendOfferData.amount)}{' '}
          {openLendOfferData.token}
        </p>
      </div>

      <OpenOfferCardRow label={getLendLabel('lLendInterest')}>
        <LendAndWaitingInterest
          interest={lendInterest}
          interestPercent={openLendOfferData.lendInterestPercent}
          tokenImageSrc={CommonUtils.getTokenImageSrcByValue(
            openLendOfferData.token,
          )}
        />
      </OpenOfferCardRow>
      <OpenOfferCardRow label={getLendLabel('lWaitingInterest')}>
        <LendAndWaitingInterest
          interest={waitingInterest}
          interestPercent={waitingInterestPercent}
          tokenImageSrc={CommonUtils.getTokenImageSrcByValue(
            openLendOfferData.token,
          )}
        />
      </OpenOfferCardRow>
      <OpenOfferCardRow label={getLabel('lDuration')}>
        <p className="text-sm">
          {getHomeLabel('fmDays', {
            duration: DateUtils.convertSecondsToDayHourMinute(
              openLendOfferData.duration,
            ).day,
          })}
        </p>
      </OpenOfferCardRow>
      <OpenOfferCardRow label={getLabel('lStatus')}>
        <p className="text-sm">
          {openLendOfferData.status === LendStatus.CREATED
            ? getLabelSeekingStatus(openLendOfferData.startDate)
            : getLabelCanceledStatus(openLendOfferData.updatedAt)}
        </p>
      </OpenOfferCardRow>

      {openLendOfferData.status === LendStatus.CREATED ? (
        <div className={twJoin('flex items-center gap-x-2', 'mt-2')}>
          <EditButton detailOfferData={openLendOfferData} />
          <CancelButton detailOfferData={openLendOfferData} />
        </div>
      ) : (
        <DetailOfferButton detailOfferData={openLendOfferData} />
      )}
    </div>
  );
};

export default OpenOfferCard;

interface OpenOfferCardProps extends React.ComponentPropsWithoutRef<'div'> {
  openLendOfferData: OpenLendOfferViewInterface;
}

const OpenOfferCardRow = ({
  label,
  children,
  className,
  ...otherProps
}: OpenOfferCardRowProps) => {
  return (
    <div
      className={twMerge('w-full', 'space-between-root', className)}
      {...otherProps}
    >
      <p className="text-sm text-neutral5">{label}</p>
      {children}
    </div>
  );
};

interface OpenOfferCardRowProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
}
