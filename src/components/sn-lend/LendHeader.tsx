'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { TotalValueCard } from '../common';
import { useLendContext } from '@/context';
import { useTranslation } from 'react-i18next';

const LendHeader: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);
  const { lendStatistic } = useLendContext();

  return (
    <div
      className={twMerge(
        'w-full',
        'p-4 sm:px-0',
        'flex flex-col gap-y-4',
        'sm:flex-row sm:gap-x-6',
      )}
      {...otherProps}
    >
      <TotalValueCard
        cardTitle={getLendLabel('lTotalInterestEarned')}
        cardValue={lendStatistic.totalInterestEarned}
        contentTooltip={getLendLabel('fmFromActiveContract', {
          count: lendStatistic.totalActiveContracts,
        })}
        fluctuationsValue={
          <p className="ml-1 text-brandTertiary">
            +$
            {Number(
              FormatUtils.formatNumber(
                lendStatistic.totalInterestInActiveContract,
                5,
              ),
            )}
          </p>
        }
      />
      <TotalValueCard
        cardTitle={getLendLabel('lTotalActiveContracts')}
        cardValue={lendStatistic.totalActiveContractsValue}
        contentTooltip={getLendLabel('fmFromActiveContract', {
          count: lendStatistic.totalActiveContracts,
        })}
      />
      <TotalValueCard
        cardTitle={getLendLabel('lTotalOpenOffer')}
        cardValue={lendStatistic.totalOpenOffersValue}
        contentTooltip={getLendLabel('fmFromOpenOffer', {
          count: lendStatistic.totalOpenOffersContracts,
        })}
      />
    </div>
  );
};

export default LendHeader;
