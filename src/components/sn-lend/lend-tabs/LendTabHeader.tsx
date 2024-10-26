'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { LendTabEnum } from '.';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { TabsTriggerProps } from '@radix-ui/react-tabs';
import { TabsList, TabsTrigger } from '@/components/common';

const LendTabHeader: React.FC<LendTabHeaderProps> = ({ onChangeTab }) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  return (
    <TabsList className="w-full flex items-center justify-around">
      <LendTabTrigger
        value={LendTabEnum.OpenOffer}
        onClick={() => onChangeTab(LendTabEnum.OpenOffer)}
      >
        {getLendLabel('lOpenOffer')}
      </LendTabTrigger>
      <LendTabTrigger
        value={LendTabEnum.Contract}
        onClick={() => onChangeTab(LendTabEnum.Contract)}
      >
        {getLendLabel('lContract')}
      </LendTabTrigger>
    </TabsList>
  );
};

export default LendTabHeader;

interface LendTabHeaderProps extends ComponentPropsWithoutRef<'div'> {
  onChangeTab: (value: LendTabEnum) => void;
}

export const LendTabTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  ...otherProps
}) => {
  return (
    <TabsTrigger
      value={value}
      className={twMerge(
        'w-fit',
        'font-medium',
        'flex flex-col gap-y-2',
        'text-neutral5 data-[state=active]:text-primary5',

        "after:content-['']",
        'after:rounded-t-lg',
        'after:h-1 after:w-full',
        'after:bg-inherit after:data-[state=active]:bg-primary5',
        className,
      )}
      {...otherProps}
    >
      {children}
    </TabsTrigger>
  );
};
