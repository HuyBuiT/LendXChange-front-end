'use client';

import React, { useState } from 'react';

import { LangConstant } from '@/const';
import { EditIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { LoanContractViewInterface, LoanStatus } from '@/models';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

import EditCollateralDialog from '../edit-collateral-dialog';
import LiquidatedDialog from '../liquidated-dialog';
import PaidBackDialog from '../paidback-dialog';

const InfoActions: React.FC<InfoActionsProps> = ({ loanContractData }) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenPaidBackDialog, setIsOpenPaidBackDialog] = useState(false);
  const [isOpenLiquidatedDialog, setIsOpenLiquidatedDialog] = useState(false);

  return (
    <>
      {loanContractData.status === LoanStatus.MATCHED ||
      loanContractData.status === LoanStatus.FUND_TRANSFERRED ? (
        <CommonButton
          className="min-w-20"
          variant={CommonButtonVariantEnum.Edit}
          onClick={() => setIsOpenEditDialog(true)}
        >
          <EditIcon />
          {getLoanLabel('lEdit')}
        </CommonButton>
      ) : (
        <CommonButton
          className="min-w-20"
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
          variant={CommonButtonVariantEnum.Edit}
        >
          {getLoanLabel('lDetail')}
        </CommonButton>
      )}

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
    </>
  );
};

export default InfoActions;

interface InfoActionsProps {
  loanContractData: LoanContractViewInterface;
}
