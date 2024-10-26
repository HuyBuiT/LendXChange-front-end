'use client';

import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { SolanaSupportedTokenEnum } from '@/models';
import { CommonUtils, DateUtils, FormatUtils } from '@/utils';
import Image from 'next/image';

const HeaderDetail: React.FC<HeaderDetailProps> = ({
  token,
  amount,
  status,
  duration,
  className,
  lendInterest,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  return (
    <div
      className={twMerge(
        'pb-6 mb-6',
        'flex flex-col gap-y-6',
        'border-b border-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      <HeaderDetailItem label={getLabel('lAmount')}>
        <div className={twJoin('flex items-center gap-x-2')}>
          <Image
            src={CommonUtils.getTokenImageSrcByValue(token)}
            alt="Token image"
          />

          <p>
            {FormatUtils.formatNumber(amount)} {token}
          </p>
        </div>
      </HeaderDetailItem>
      <div className="space-between-root">
        <HeaderDetailItem label={getLabel('lDuration')}>
          {getHomeLabel('fmDays', {
            duration: DateUtils.convertSecondsToDayHourMinute(duration).day,
          })}
        </HeaderDetailItem>
        <HeaderDetailItem label={getLendLabel('lLendInterest')}>
          {lendInterest}%
        </HeaderDetailItem>
        <HeaderDetailItem label={getLabel('lStatus')}>
          {status}
        </HeaderDetailItem>
      </div>
    </div>
  );
};

export default HeaderDetail;

interface HeaderDetailProps extends ComponentPropsWithoutRef<'div'> {
  token: SolanaSupportedTokenEnum;
  amount: number;
  duration: number;
  lendInterest: number;
  status: ReactNode;
}

const HeaderDetailItem: React.FC<HeaderDetailItemProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex flex-col gap-y-2', className)}
      {...otherProps}
    >
      <p className="text-neutral5">{label}</p>
      {children}
    </div>
  );
};

interface HeaderDetailItemProps extends ComponentPropsWithoutRef<'div'> {
  label: string;
}
