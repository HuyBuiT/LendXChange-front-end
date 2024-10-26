'use client';

import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import { LoanContractViewInterface, LoanStatus } from '@/models';
import { DateUtils, CommonUtils } from '@/utils';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { LangConstant } from '@/const';

const LoanContractStatusMessage: React.FC<LoanContractStatusMessageProps> = ({
  className,
  loanContractData,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const remainLabel = useMemo(() => {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const timeRemain = Math.abs(
      loanContractData.endTimestamp - currentTimestamp,
    );

    const { day } = DateUtils.convertSecondsToDayHourMinute(timeRemain);

    const timeLabel = CommonUtils.getTimeLabel(
      getLabel,
      loanContractData.endTimestamp,
    );

    return `${getLoanLabel(day ? 'fmRemainTime' : 'fmUntilLiquidation', {
      value: timeLabel,
    })}`;
  }, [getLoanLabel, getLabel, loanContractData]);

  const liquidatedLabel = useMemo(() => {
    if (!loanContractData.liquidatedData.timestamp) return '';

    const timeLabel = CommonUtils.getTimeLabel(
      getLabel,
      loanContractData.liquidatedData.timestamp,
    );
    return `${getLoanLabel('fmLiquidatedAgo', { value: timeLabel })}`;
  }, [getLoanLabel, getLabel, loanContractData]);

  const repaidLabel = useMemo(() => {
    if (!loanContractData.repaidData.timestamp) return '';

    const timeLabel = CommonUtils.getTimeLabel(
      getLabel,
      loanContractData.repaidData.timestamp,
    );

    return `${getLoanLabel('fmRepaidAgo', { value: timeLabel })}`;
  }, [getLoanLabel, getLabel, loanContractData]);

  const statusLabel = useMemo(() => {
    if (loanContractData.status === LoanStatus.REPAY) {
      return getLabel('lProcessing');
    }

    if (
      loanContractData.status === LoanStatus.FINISHED ||
      loanContractData.status === LoanStatus.BORROWER_PAID
    ) {
      return repaidLabel;
    }

    if (
      loanContractData.status === LoanStatus.LIQUIDATED ||
      loanContractData.status === LoanStatus.LIQUIDATING
    ) {
      return liquidatedLabel;
    }

    return remainLabel;
  }, [loanContractData, repaidLabel, liquidatedLabel, remainLabel]);

  return (
    <p className={twMerge('', className)} {...otherProps}>
      {statusLabel}
    </p>
  );
};

export default LoanContractStatusMessage;

interface LoanContractStatusMessageProps extends ComponentPropsWithoutRef<'p'> {
  loanContractData: LoanContractViewInterface;
}
