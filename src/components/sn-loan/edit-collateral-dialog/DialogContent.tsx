'use client';

import React, { Fragment } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { HealthRatio } from '@/components/common';
import { LoanContractViewInterface } from '@/models';
import { ArrowDirectionIcon } from '@/components/icons';
import { ItemRowInfo, TokenValue } from '../dialog-components';

import CollateralTokenInfo from '../CollateralTokenInfo';
import HealthRatioTooltip from '../HealthRatioTooltip';
import BorrowerFeeTooltip from '../BorrowerFeeTooltip';

const DialogContent: React.FC<DialogContentProps> = ({
  className,
  newCollateral,
  newHealthRatio,
  loanContractData,
  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
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
      <ItemRowInfo label={getLoanLabel('lDepositedCollateral')}>
        <CollateralTokenInfo loanContractData={loanContractData} />
      </ItemRowInfo>

      <ItemRowInfo
        label={
          <>
            <p>{getLoanLabel('lHealthRatio')}</p>
            <HealthRatioTooltip />
          </>
        }
      >
        <div className="flex items-center gap-x-1">
          <HealthRatio value={loanContractData.healthRatio || 0} />

          {newCollateral === loanContractData.collateral.amount ? (
            <Fragment />
          ) : (
            <>
              <ArrowDirectionIcon className="w-4 h-4" />
              <HealthRatio value={newHealthRatio || 0} />
            </>
          )}
        </div>
      </ItemRowInfo>

      <span className={twJoin('self-end', 'text-sm text-neutral5')}>
        {getHomeLabel('fmLiquidAt', {
          value: process.env.LIQUID,
        })}
      </span>

      <ItemRowInfo label={getLoanLabel('lBorrowInterest')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.borrowInterestValue}
          percentage={loanContractData.borrowInterest}
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
  newCollateral: number;
  newHealthRatio: number;
}
