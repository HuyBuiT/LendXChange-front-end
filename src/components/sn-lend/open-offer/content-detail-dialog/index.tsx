'use client';

import React, { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  LendStatus,
  LoanStatus,
  SupportedChainEnum,
  SolanaSupportedTokenEnum,
} from '@/models';
import { DateUtils } from '@/utils';
import { twMerge } from 'tailwind-merge';
import { TxidComponent } from '@/components/common';

import HeaderDetail from './HeaderDetail';
import ContentContractDetail from './ContentContractDetail';

const DetailContentDialog: React.FC<DetailContentDialogProps> = ({
  chain,
  token,
  amount,
  status,
  duration,
  className,
  lenderFee,
  statusLabel,
  lendInterest,
  waitingInterestAmount,
  waitingInterestPercent,
  transactionHash,
  ...otherProps
}) => {
  return (
    <div className={twMerge('w-full', className)} {...otherProps}>
      <HeaderDetail
        token={token}
        amount={amount}
        status={statusLabel}
        duration={duration}
        lendInterest={lendInterest}
      />
      <ContentContractDetail
        token={token}
        durations={DateUtils.convertSecondsToDayHourMinute(duration).day}
        lendAmount={amount}
        numberOffers={1}
        interestValue={lendInterest}
        lenderFee={lenderFee}
        waitingInterestAmount={waitingInterestAmount}
        waitingInterestPercent={waitingInterestPercent}
        status={status}
      />
      {transactionHash && (
        <TxidComponent transactionHash={transactionHash} chain={chain} />
      )}
    </div>
  );
};

export default DetailContentDialog;

interface DetailContentDialogProps extends ComponentPropsWithoutRef<'div'> {
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum;
  amount: number;
  duration: number;
  lendInterest: number;
  statusLabel: ReactNode;
  waitingInterestAmount: number;
  waitingInterestPercent: number;
  transactionHash?: string;
  lenderFee: number;
  status: LendStatus | LoanStatus;
}
