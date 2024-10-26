'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LangConstant, PathConstant } from '@/const';

import InfoTooltip from '../sn-home/InfoTooltip';

const BorrowerFeeTooltip = () => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const [isShowBorrowerFeeTooltip, setIsShowBorrowerFeeTooltip] =
    useState(false);

  return (
    <InfoTooltip
      isOpen={isShowBorrowerFeeTooltip}
      onChangeOpen={(value) => setIsShowBorrowerFeeTooltip(value)}
      contentTooltip={
        <>
          {getLabel('msgTheFeeCharged')}
          <a
            href={PathConstant.BORROWER_FEE_GIT_BOOK_LINK}
            target="_blank"
            className="ml-1 underline"
          >
            {getHomeLabel('lViewDetail')}
          </a>
        </>
      }
    />
  );
};

export default BorrowerFeeTooltip;
