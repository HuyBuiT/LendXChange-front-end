'use client';

import React, { useState } from 'react';

import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { LoanContractViewInterface, LoanStatus } from '@/models';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';
import RepayDialog from '../repay-dialog';

const RepayButton: React.FC<RepayButtonProps> = ({ loanContractData }) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      {loanContractData.status === LoanStatus.MATCHED ||
      loanContractData.status === LoanStatus.FUND_TRANSFERRED ? (
        <CommonButton
          variant={CommonButtonVariantEnum.Lend}
          onClick={() => setIsOpenDialog(true)}
        >
          {getLoanLabel('lRepay')}
        </CommonButton>
      ) : (
        <div className="min-w-20" />
      )}

      <RepayDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        loanContractData={loanContractData}
      />
    </>
  );
};

export default RepayButton;

interface RepayButtonProps {
  loanContractData: LoanContractViewInterface;
}
