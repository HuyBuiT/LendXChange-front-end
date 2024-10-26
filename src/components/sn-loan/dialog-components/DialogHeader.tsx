'use client';

import React, { Fragment } from 'react';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { AppConstant, LangConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { LoanContractViewInterface } from '@/models';

import TokenInfo from '../TokenInfo';
import ItemColumnInfo from './ItemColumnInfo';
import CollateralTokenInfo from '../CollateralTokenInfo';
import LoanContractStatusMessage from '../LoanContractStatusMessage';

const DialogHeader: React.FC<DialogHeaderProps> = ({
  headerLabel,
  isShowCollateral,
  loanContractData,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const { windowWidth } = useWindowSize();

  return (
    <div>
      {windowWidth <= AppConstant.BREAK_POINTS.sm ? (
        <span
          className={twJoin(
            'inline-block',
            'w-full pb-4 px-4 mb-4',
            'text-sm font-semibold',
            'border-b border-b-neutral7',
          )}
        >
          {headerLabel}
        </span>
      ) : (
        <Fragment />
      )}
      <div
        className={twJoin(
          'px-4 pb-6',
          'border-b border-b-characterBackground2',
        )}
      >
        <div
          className={twJoin(
            'w-full',
            'gap-y-4',
            'grid grid-cols-3',
            isShowCollateral ? 'grid-rows-2' : '',
          )}
        >
          <ItemColumnInfo label={getLabel('lAmount')}>
            <TokenInfo
              token={loanContractData.token}
              amount={loanContractData.amount}
              chain={loanContractData.chain}
            />
          </ItemColumnInfo>

          <ItemColumnInfo label={getLoanLabel('lDuration')}>
            {getLabel('fmDays', { count: loanContractData.duration })}
          </ItemColumnInfo>

          <ItemColumnInfo label={getLabel('lBorrowAPR')}>
            {loanContractData.borrowInterest}%
          </ItemColumnInfo>

          {isShowCollateral ? (
            <>
              <ItemColumnInfo label={getLoanLabel('lCollateral')}>
                <CollateralTokenInfo loanContractData={loanContractData} />
              </ItemColumnInfo>

              <ItemColumnInfo label={getLoanLabel('lStatus')}>
                <LoanContractStatusMessage
                  loanContractData={loanContractData}
                />
              </ItemColumnInfo>
            </>
          ) : (
            <Fragment />
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogHeader;

interface DialogHeaderProps {
  headerLabel: string;
  isShowCollateral?: boolean;
  loanContractData: LoanContractViewInterface;
}
