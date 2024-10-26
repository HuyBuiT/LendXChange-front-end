'use client';

import React, { ComponentPropsWithRef } from 'react';
import { FormatUtils } from '@/utils';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { AppConstant, LangConstant } from '@/const';
import { ObjectMultiLanguageProps } from '@/models';

const OfferCardContent: React.FC<OfferCardContentProps> = ({
  volume,
  durations,
  bestOffer,
  className,
}) => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);
  const objectTableHead = getLabel('objTableHead', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  return (
    <div className={twMerge('flex flex-col gap-y-2', 'text-sm', className)}>
      <DetailRowItem
        startLabel={objectTableHead.lAPR}
        endLabel={
          <p className={twJoin(bestOffer && 'text-success3')}>
            {bestOffer ? `${bestOffer}%` : '--'}
          </p>
        }
      />
      <DetailRowItem
        startLabel={objectTableHead.lDuration}
        endLabel={
          durations ? getLabel('fmDays', { duration: durations }) : '--'
        }
      />
      <DetailRowItem
        startLabel={objectTableHead.lVolume}
        endLabel={
          volume
            ? String(
                FormatUtils.convertLargeNumber(volume, AppConstant.USD_FORMAT),
              )
            : '--'
        }
      />
    </div>
  );
};

export default OfferCardContent;

interface OfferCardContentProps extends ComponentPropsWithRef<'div'> {
  volume: number;
  bestOffer: number;
  durations: number;
}

const DetailRowItem = ({
  startLabel,
  endLabel,
}: {
  startLabel: string;
  endLabel: React.ReactNode;
}) => {
  return (
    <div className={twJoin('space-between-root')}>
      <p className="text-neutral5">{startLabel}</p>
      <div>{endLabel}</div>
    </div>
  );
};
