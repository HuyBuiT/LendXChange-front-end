'use client';

import React from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { LoanContractViewInterface } from '@/models';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

import WithdrawButton from './WithdrawButton';
import DepositButton from './DepositButton';
import {
  WithDepositCollateralComponentProps,
  WithWithdrawCollateralComponentProps,
} from '@/components/hoc';

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClose,
  newCollateral,
  newHealthRatio,
  loanContractData,

  depositProps,
  withdrawProps,
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  return (
    <div
      className={twJoin(
        'px-4',
        'mt-8',
        'w-full',
        'gap-y-2',
        'flex flex-col items-center',
      )}
    >
      {newCollateral - loanContractData.collateral.amount >
      Number(process.env.NEXT_PUBLIC_EPSILON_INTEREST) ? (
        <DepositButton
          depositProps={depositProps}
          newCollateral={newCollateral}
          loanContractData={loanContractData}
          onClose={onClose}
        />
      ) : newCollateral - loanContractData.collateral.amount <
        -Number(process.env.NEXT_PUBLIC_EPSILON_INTEREST) ? (
        <WithdrawButton
          withdrawProps={withdrawProps}
          newCollateral={newCollateral}
          newHealthRatio={newHealthRatio}
          loanContractData={loanContractData}
          onClose={onClose}
        />
      ) : (
        <CommonButton
          onClick={onClose}
          className="w-full h-11"
          variant={CommonButtonVariantEnum.OutlinePrimary}
        >
          {getLoanLabel('lCancelEdit')}
        </CommonButton>
      )}
    </div>
  );
};

export default ActionButtons;

interface ActionButtonsProps {
  newCollateral: number;
  newHealthRatio: number;
  loanContractData: LoanContractViewInterface;

  depositProps: WithDepositCollateralComponentProps;
  withdrawProps: WithWithdrawCollateralComponentProps;

  onClose: () => void;
}
