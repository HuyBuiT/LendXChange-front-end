'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';

import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonTd, CommonTr } from '@/components/common';
import { LoanContractViewInterface } from '@/models/loan.model';

import TokenInfo from '../TokenInfo';
import InfoActions from './InfoActions';
import RepayButton from './RepayButton';
import HealthRatioInfo from '../HealthRatioInfo';
import CollateralTokenInfo from '../CollateralTokenInfo';
import LoanContractStatusMessage from '../LoanContractStatusMessage';
import { LoanStatus } from '@/models';

const LoanContractTableRow: React.FC<LoanContractTableRowProps> = ({
  className,
  loanContractData,
  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <CommonTr
      className={twMerge('text-sm text-neutral1', className)}
      {...otherProps}
    >
      <CommonTd>
        <TokenInfo
          width={32}
          height={32}
          token={loanContractData.token}
          amount={loanContractData.amount}
          chain={loanContractData.chain}
        />
      </CommonTd>

      <CommonTd>{loanContractData.borrowInterest}%</CommonTd>

      <CommonTd>
        {getHomeLabel('fmDays', { duration: loanContractData.duration })}
      </CommonTd>

      <CommonTd>
        <CollateralTokenInfo loanContractData={loanContractData} />
      </CommonTd>

      <CommonTd>
        {loanContractData.status === LoanStatus.FUND_TRANSFERRED ||
        loanContractData.status === LoanStatus.MATCHED ? (
          <HealthRatioInfo healthRatio={loanContractData.healthRatio} />
        ) : (
          <Fragment />
        )}
      </CommonTd>

      <CommonTd>
        <LoanContractStatusMessage loanContractData={loanContractData} />
      </CommonTd>

      <CommonTd>
        <RepayButton loanContractData={loanContractData} />
      </CommonTd>

      <CommonTd>
        <InfoActions loanContractData={loanContractData} />
      </CommonTd>
    </CommonTr>
  );
};

export default LoanContractTableRow;

interface LoanContractTableRowProps extends ComponentPropsWithoutRef<'tr'> {
  loanContractData: LoanContractViewInterface;
}
