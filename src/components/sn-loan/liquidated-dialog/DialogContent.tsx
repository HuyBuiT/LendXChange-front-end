'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { LoanContractViewInterface } from '@/models';
import { ArrowDirectionIcon } from '@/components/icons';
import { ItemRowInfo, TokenValue } from '../dialog-components';
import { HealthRatio, TxidComponent } from '@/components/common';

import BorrowerFeeTooltip from '../BorrowerFeeTooltip';
import CollateralTokenInfo from '../CollateralTokenInfo';

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
      <ItemRowInfo label={getLoanLabel('lLiquidatedHealthRatio')}>
        <HealthRatio
          value={loanContractData.liquidatedData.liquidatedHeathRatio || 0}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lLiquidatedAssets')}>
        <div className="flex items-center gap-x-2">
          <CollateralTokenInfo loanContractData={loanContractData} />
          <ArrowDirectionIcon className="w-4 h-4" />
          <TokenValue
            token={loanContractData.token}
            value={
              loanContractData.liquidatedData.convertedLiquidatedValue || 0
            }
          />
        </div>
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lRepaidAmount')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.liquidatedData.totalRepaid || 0}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lBorrowInterest')}>
        <TokenValue
          percentage={loanContractData.borrowInterest}
          token={loanContractData.token}
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
          value={loanContractData.borrowFeeValue}
          token={loanContractData.token}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lTotalReceive')}>
        <TokenValue
          value={loanContractData.liquidatedData.totalReceived || 0}
          token={loanContractData.token}
        />
      </ItemRowInfo>

      <TxidComponent
        chain={loanContractData.chain}
        transactionHash={loanContractData.liquidatedData.txHash || ''}
      />
    </div>
  );
};

export default DialogContent;

interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
  loanContractData: LoanContractViewInterface;
}
