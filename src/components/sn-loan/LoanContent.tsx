'use client';

import React from 'react';
import { AppConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import LoanContractTable from './loan-contract-table';
import LoanContractCardList from './loan-contract-card-list';

const LoanContent = () => {
  const { windowWidth } = useWindowSize();

  return (
    <div>
      {windowWidth <= AppConstant.BREAK_POINTS.sm ? (
        <LoanContractCardList />
      ) : (
        <LoanContractTable />
      )}
    </div>
  );
};

export default LoanContent;
