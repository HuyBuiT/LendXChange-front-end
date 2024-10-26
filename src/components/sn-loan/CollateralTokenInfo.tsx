'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { LoanContractViewInterface } from '@/models';

import Image from 'next/image';

const CollateralTokenInfo: React.FC<CollateralTokenInfoProps> = ({
  loanContractData,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge('flex items-center gap-x-1', className)}
      {...otherProps}
    >
      <Image
        width={24}
        height={24}
        alt="Collateral token image"
        src={CommonUtils.getTokenImageSrcByValue(
          loanContractData.collateral.token,
        )}
      />

      <span>
        {FormatUtils.formatNumber(loanContractData.collateral.amount, 6)}
      </span>

      <span>{loanContractData.collateral.token}</span>
    </div>
  );
};

export default CollateralTokenInfo;

interface CollateralTokenInfoProps extends ComponentPropsWithoutRef<'div'> {
  loanContractData: LoanContractViewInterface;
}
