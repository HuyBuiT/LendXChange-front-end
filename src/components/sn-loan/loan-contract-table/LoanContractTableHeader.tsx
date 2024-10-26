'use client';

import React, { Fragment } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { CommonTHead, CommonTh, CommonTr } from '@/components/common';

const LoanContractTableHeader = () => {
  const { t: getLabel } = useTranslation();
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  return (
    <CommonTHead>
      <CommonTr>
        <CommonTh>{getLabel('lAmount')}</CommonTh>

        <CommonTh>{getLoanLabel('lBorrowInterest')}</CommonTh>

        <CommonTh>{getLoanLabel('lDuration')}</CommonTh>

        <CommonTh>{getLoanLabel('lCollateral')}</CommonTh>

        <CommonTh>{getLoanLabel('lHealthRatio')}</CommonTh>

        <CommonTh>{getLoanLabel('lStatus')}</CommonTh>

        <CommonTh>
          <Fragment />
        </CommonTh>

        <CommonTh>
          <Fragment />
        </CommonTh>
      </CommonTr>
    </CommonTHead>
  );
};

export default LoanContractTableHeader;
