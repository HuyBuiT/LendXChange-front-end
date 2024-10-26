'use client';

import React, { useState } from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { LendContractViewInterface } from '@/models';
import {
  CommonButtonProps,
  CommonButtonVariantEnum,
} from '@/components/common/CommonButton';
import ContractDetailDialog from './contract-detail-dialog';

const DetailButton: React.FC<DetailButtonProps> = ({
  className,
  contractDetailData,
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  return (
    <>
      <CommonButton
        className={twMerge('w-fit', 'sm:px-2 lg:px-4', className)}
        variant={CommonButtonVariantEnum.Edit}
        onClick={() => setIsOpenDialog(true)}
        {...otherProps}
      >
        {getLendLabel('lDetail')}
      </CommonButton>

      <ContractDetailDialog
        contractDetailData={contractDetailData}
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />
    </>
  );
};

export default DetailButton;

interface DetailButtonProps extends CommonButtonProps {
  contractDetailData: LendContractViewInterface;
}
