'use client';

import React, { Fragment, ReactNode } from 'react';
import { LangConstant } from '@/const';
import { InfoIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonButton } from '@/components/common';
import { LoanContractViewInterface } from '@/models';
import { CommonButtonProps } from '@/components/common/CommonButton';

const ActionButton: React.FC<ActionButtonProps> = ({
  errorMsg,
  className,
  statusLabel,
  ...otherProps
}) => {
  useTranslation(LangConstant.NS_LOAN);

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
      <CommonButton
        className={twMerge('w-full h-11', className)}
        {...otherProps}
      >
        {statusLabel}
      </CommonButton>

      {errorMsg ? (
        <span
          className={twJoin('flex items-center', 'gap-x-1', 'text-warning2')}
        >
          <InfoIcon />
          {errorMsg}
        </span>
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default ActionButton;

interface ActionButtonProps extends CommonButtonProps {
  loanContractData: LoanContractViewInterface;
  errorMsg?: string;
  statusLabel?: ReactNode;
}
