'use client';

import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import { CommonUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { LendContractViewInterface, LoanStatus } from '@/models';

const StatusComponent: React.FC<StatusComponentProps> = ({
  className,
  dataContract,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const statusLabel = useMemo(() => {
    if (dataContract.status === LoanStatus.FINISHED) {
      const repaidTimeLabel = CommonUtils.getTimeLabel(
        getLabel,
        dataContract.payment.createdAt,
      );
      return getLendLabel('fmRepaidAgo', { time: repaidTimeLabel });
    }

    const timeRemainingLabel = CommonUtils.getTimeLabel(
      getLabel,
      dataContract.endDate,
    );
    return getLendLabel('fmRemaining', { time: timeRemainingLabel });
  }, [dataContract, getLendLabel]);

  return (
    <p className={twMerge('text-sm font-normal', className)} {...otherProps}>
      {statusLabel}
    </p>
  );
};

export default StatusComponent;

interface StatusComponentProps extends ComponentPropsWithoutRef<'p'> {
  dataContract: LendContractViewInterface;
}
