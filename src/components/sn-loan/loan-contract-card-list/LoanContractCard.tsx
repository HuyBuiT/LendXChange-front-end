'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';
import { CommonUtils, FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { LoanContractViewInterface, LoanStatus } from '@/models';

import Image from 'next/image';
import RowItem from './RowItem';
import TokenInfo from '../TokenInfo';
import InfoActions from './InfoActions';
import HealthRatioInfo from '../HealthRatioInfo';
import CollateralTokenInfo from '../CollateralTokenInfo';
import LoanContractStatusMessage from '../LoanContractStatusMessage';

const LoanContractCard: React.FC<LoanContractCardProps> = ({
  className,
  loanContractData,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  return (
    <div
      className={twMerge(
        'py-4 px-5',
        'rounded-lg',
        'flex flex-col gap-y-2',
        'bg-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      <div className="flex items-center gap-x-1">
        <TokenInfo
          token={loanContractData.token}
          amount={loanContractData.amount}
          chain={loanContractData.chain}
        />
      </div>

      <RowItem label={getLoanLabel('lBorrowInterest')}>
        <div className="flex items-center gap-x-1">
          <span className="text-neutral5">{`(${loanContractData.borrowInterest}%)`}</span>
          <span>
            {FormatUtils.formatNumber(loanContractData.borrowInterestValue, 2)}
          </span>
          <Image
            width={20}
            height={20}
            src={CommonUtils.getTokenImageSrcByValue(loanContractData.token)}
            alt="Token image"
          />
        </div>
      </RowItem>

      <RowItem label={getLoanLabel('lDuration')}>
        {getLabel('fmDays', { count: loanContractData.duration })}
      </RowItem>

      <RowItem label={getLoanLabel('lCollateral')}>
        <CollateralTokenInfo loanContractData={loanContractData} />
      </RowItem>

      {loanContractData.status === LoanStatus.FUND_TRANSFERRED ||
      loanContractData.status === LoanStatus.MATCHED ? (
        <RowItem label={getLoanLabel('lHealthRatio')}>
          <HealthRatioInfo healthRatio={loanContractData.healthRatio} />
        </RowItem>
      ) : (
        <Fragment />
      )}

      <RowItem label={getLoanLabel('lStatus')}>
        <LoanContractStatusMessage loanContractData={loanContractData} />
      </RowItem>

      <InfoActions loanContractData={loanContractData} />
    </div>
  );
};

export default LoanContractCard;

interface LoanContractCardProps extends ComponentPropsWithoutRef<'div'> {
  loanContractData: LoanContractViewInterface;
}
