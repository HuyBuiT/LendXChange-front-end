'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';
import { DialogHeader } from '../dialog-components';
import { AppConstant, LangConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { LoanContractViewInterface } from '@/models';
import DialogContent from './DialogContent';

const PaidBackDialog: React.FC<PaidBackDialogProps> = ({
  isOpen,
  onClose,
  loanContractData,
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const { windowWidth } = useWindowSize();

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      closeIconClassName="right-4"
      isShowIconClose={windowWidth <= AppConstant.BREAK_POINTS.sm}
      contentClassName={twJoin(
        'px-0 pb-24',
        'flex flex-col',
        'h-[80vh] sm:h-auto',
      )}
    >
      <DialogHeader
        isShowCollateral={true}
        loanContractData={loanContractData}
        headerLabel={getLoanLabel('lContractDetail')}
      />

      <DialogContent loanContractData={loanContractData} />
    </CommonDialog>
  );
};

export default PaidBackDialog;

interface PaidBackDialogProps {
  isOpen: boolean;
  onClose: () => void;

  loanContractData: LoanContractViewInterface;
}
