'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LangConstant, PathConstant } from '@/const';

import InfoTooltip from '../sn-home/InfoTooltip';

const HealthRatioTooltip = () => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const [isShowHealthRatioTooltip, setIsShowHealthRatioTooltip] =
    useState(false);

  return (
    <InfoTooltip
      isOpen={isShowHealthRatioTooltip}
      onChangeOpen={(value) => setIsShowHealthRatioTooltip(value)}
      contentTooltip={
        <>
          {getLabel('msgAMetricThat')}
          <a
            href={PathConstant.HEALTH_RATIO_GIT_BOOK_LINK}
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

export default HealthRatioTooltip;
