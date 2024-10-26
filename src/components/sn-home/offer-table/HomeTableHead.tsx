'use client';

import React from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { ObjectMultiLanguageProps } from '@/models';
import { CommonTHead, CommonTh, CommonTr } from '@/components/common';

const HomeTableHead = () => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);
  const objectTableHead = getLabel('objTableHead', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  return (
    <CommonTHead>
      <CommonTr>
        <CommonTh
          className={twJoin('sm:px-2 md:px-4', 'sm:text-xs md:text-sm')}
        >
          {objectTableHead.lAmount}
        </CommonTh>
        <CommonTh
          className={twJoin('sm:px-2 md:px-4', 'sm:text-xs md:text-sm')}
        >
          {objectTableHead.lAPR}
        </CommonTh>
        <CommonTh
          className={twJoin('sm:px-2 md:px-4', 'sm:text-xs md:text-sm')}
        >
          {objectTableHead.lDuration}
        </CommonTh>
        <CommonTh
          className={twJoin('sm:px-2 md:px-4', 'sm:text-xs md:text-sm')}
        >
          <p className="min-w-[70px] truncate">{objectTableHead.lVolume}</p>
        </CommonTh>
        <CommonTh className="sm:px-2">{''}</CommonTh>
        <CommonTh className="lg:rounded-tr-lg">{''}</CommonTh>
        <CommonTh className="lg:hidden">{''}</CommonTh>
      </CommonTr>
    </CommonTHead>
  );
};

export default HomeTableHead;
