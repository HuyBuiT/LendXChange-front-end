'use client';

import React from 'react';
import { FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { TotalValueCard } from '../common';
import { useLoanContext } from '@/context';
import { useTranslation } from 'react-i18next';

const LoanHeader: React.FC<LoanHeaderProps> = ({
  className,
  ...otherProps
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const { totalValueCardInfo } = useLoanContext();

  return (
    <div
      className={twMerge(
        'w-full',
        'p-4 sm:px-0',
        'flex flex-col gap-y-4',
        'sm:flex-row sm:gap-x-6',
        className,
      )}
      {...otherProps}
    >
      <TotalValueCard
        cardTitle={getLoanLabel('lTotalInterestPaid')}
        contentTooltip={getLoanLabel('fmFromActiveContract', {
          count: totalValueCardInfo.totalActiveContracts,
        })}
        cardValue={totalValueCardInfo.totalInterestPaid}
        fluctuationsValue={
          <p className="ml-1 text-brandTertiary">
            +$
            {Number(
              FormatUtils.formatNumber(
                totalValueCardInfo.fluctuationsInterest,
                5,
              ),
            )}
          </p>
        }
      />
      <TotalValueCard
        cardTitle={getLoanLabel('lTotalActiveValue')}
        contentTooltip={getLoanLabel('fmFromActiveContract', {
          count: totalValueCardInfo.totalActiveContracts,
        })}
        cardValue={totalValueCardInfo.totalInterestActiveContractValue}
      />
      <TotalValueCard
        cardTitle={getLoanLabel('lTotalBorrowed')}
        contentTooltip={getLoanLabel('fmFromContract', {
          count: totalValueCardInfo.totalContracts,
        })}
        cardValue={totalValueCardInfo.totalBorrowed}
      />
    </div>
  );
};

export default LoanHeader;

interface LoanHeaderProps extends React.ComponentPropsWithoutRef<'div'> {}
