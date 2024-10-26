'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { ItemRowInfo, TokenValue } from '../dialog-components';
import { LoanContractViewInterface } from '@/models';
import { TxidComponent } from '@/components/common';

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
      <ItemRowInfo label={getLoanLabel('lBorrowInterest')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.borrowInterestValue}
          percentage={loanContractData.borrowInterest}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lBorrowerFee')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.borrowFeeValue}
        />
      </ItemRowInfo>

      <ItemRowInfo label={getLoanLabel('lTotalRepay')}>
        <TokenValue
          token={loanContractData.token}
          value={loanContractData.totalRepay}
        />
      </ItemRowInfo>

      {loanContractData.repaidData.txHash && (
        <TxidComponent
          chain={loanContractData.chain}
          transactionHash={loanContractData.repaidData.txHash || ''}
        />
      )}
    </div>
  );
};

export default DialogContent;

interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
  loanContractData: LoanContractViewInterface;
}
