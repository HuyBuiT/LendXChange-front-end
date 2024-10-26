'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { LendTabs } from '.';
import { AppConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useWindowSize } from '@/hooks/common-hooks';

import OpenOfferTable from './open-offer/open-offer-table';
import ContractTable from './contract/contract-table';

const LendContent: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  ...otherProps
}) => {
  const { windowWidth } = useWindowSize();

  return (
    <div
      className={twMerge(
        'w-full h-full',
        'p-4 sm:pb-10',
        'bg-characterBackground3 sm:bg-transparent',
      )}
      {...otherProps}
    >
      {windowWidth <= AppConstant.BREAK_POINTS.sm ? (
        <LendTabs />
      ) : (
        <div className="flex flex-col gap-y-6">
          <OpenOfferTable />
          <ContractTable />
        </div>
      )}
    </div>
  );
};

export default LendContent;
