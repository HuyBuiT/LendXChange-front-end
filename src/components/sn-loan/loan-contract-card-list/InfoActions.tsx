'use client';

import React, { useState } from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { EditIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { LoanContractViewInterface, LoanStatus } from '@/models';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

import RepayDialog from '../repay-dialog';
import LiquidatedDialog from '../liquidated-dialog';
import EditCollateralDialog from '../edit-collateral-dialog';
import PaidBackDialog from '../paidback-dialog';

const InfoActions: React.FC<InfoActionsProps> = ({ loanContractData }) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenRepayDialog, setIsOpenRepayDialog] = useState(false);
  const [isOpenPaidBackDialog, setIsOpenPaidBackDialog] = useState(false);
  const [isOpenLiquidatedDialog, setIsOpenLiquidatedDialog] = useState(false);

  return (
    <div className="w-full mt-2">
      {loanContractData.status === LoanStatus.MATCHED ||
      loanContractData.status === LoanStatus.FUND_TRANSFERRED ? (
        <div className={twJoin('w-full', 'gap-x-3', 'space-between-root')}>
          <CommonButton
            className="w-full"
            variant={CommonButtonVariantEnum.Lend}
            onClick={() => setIsOpenRepayDialog(true)}
          >
            {getLoanLabel('lRepay')}
          </CommonButton>

          <CommonButton
            className="w-full"
            variant={CommonButtonVariantEnum.Edit}
            onClick={() => setIsOpenEditDialog(true)}
          >
            <EditIcon />
            {getLoanLabel('lEdit')}
          </CommonButton>
        </div>
      ) : (
        <CommonButton
          className="w-full"
          variant={CommonButtonVariantEnum.Edit}
          onClick={() => {
            if (
              loanContractData.status === LoanStatus.LIQUIDATED ||
              loanContractData.status === LoanStatus.LIQUIDATING
            ) {
              setIsOpenLiquidatedDialog(true);
            } else {
              setIsOpenPaidBackDialog(true);
            }
          }}
        >
          {getLoanLabel('lDetail')}
        </CommonButton>
      )}

      <RepayDialog
        isOpen={isOpenRepayDialog}
        loanContractData={loanContractData}
        onClose={() => setIsOpenRepayDialog(false)}
      />

      <EditCollateralDialog
        isOpen={isOpenEditDialog}
        loanContractData={loanContractData}
        onClose={() => setIsOpenEditDialog(false)}
      />

      <PaidBackDialog
        isOpen={isOpenPaidBackDialog}
        loanContractData={loanContractData}
        onClose={() => setIsOpenPaidBackDialog(false)}
      />

      <LiquidatedDialog
        isOpen={isOpenLiquidatedDialog}
        loanContractData={loanContractData}
        onClose={() => setIsOpenLiquidatedDialog(false)}
      />
    </div>
  );
};

export default InfoActions;

interface InfoActionsProps {
  loanContractData: LoanContractViewInterface;
}
