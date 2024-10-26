'use client';

import React from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { CommonTHead, CommonTh, CommonTr } from '@/components/common';

const ContractTableHeader = () => {
  const { t: getLabel } = useTranslation();
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  return (
    <CommonTHead>
      <CommonTr>
        <CommonTh className="font-normal">{getLabel('lAmount')}</CommonTh>
        <CommonTh className="font-normal">
          {getLendLabel('lLendInterest')}
        </CommonTh>
        <CommonTh className="font-normal">
          {getLendLabel('lWaitingInterest')}
        </CommonTh>
        <CommonTh className="font-normal">{getLabel('lDuration')}</CommonTh>
        <CommonTh className="font-normal">{getLabel('lStatus')}</CommonTh>
        <CommonTh>{''}</CommonTh>
      </CommonTr>
    </CommonTHead>
  );
};

export default ContractTableHeader;
