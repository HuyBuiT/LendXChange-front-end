'use client';

import React from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { LoanContractViewInterface } from '@/models';
import { ItemRowInfo, TokenValue } from '../dialog-components';
import HealthRatioInfo from '../HealthRatioInfo';
import BorrowerFeeTooltip from '../BorrowerFeeTooltip';
import HealthRatioTooltip from '../HealthRatioTooltip';

const DialogContent: React.FC<DialogContentProps> = ({
  className,
  loanContractData,
  ...otherProps
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  return (
    <div
      className={twMerge(
        'px-4 mt-3',
        'flex flex-col gap-y-4 flex-1',
        className,
      )}
      {...otherProps}
    >
      <ItemRowInfo
        label={
          <>
            <p>{getLoanLabel('lHealthRatio')}</p>
            <HealthRatioTooltip />
          </>
        }
      >
        <HealthRatioInfo healthRatio={loanContractData.healthRatio} />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lBorrowInterest')}>
        <TokenValue
          token={loanContractData.token}
          percentage={loanContractData.borrowInterest}
          value={loanContractData.borrowInterestValue}
        />
      </ItemRowInfo>

      <ItemRowInfo
        label={
          <>
            <p>{getLoanLabel('lBorrowFee')}</p>
            <BorrowerFeeTooltip />
          </>
        }
      >
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.borrowFeeValue}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lTotalYouNeedToRepay')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.totalRepay}
        />
      </ItemRowInfo>
    </div>
  );
};

export default DialogContent;

interface DialogContentProps extends React.ComponentPropsWithoutRef<'div'> {
  loanContractData: LoanContractViewInterface;
}
