'use client';

import React, { ComponentPropsWithRef } from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { ArrowRightUpIcon } from '@/components/icons';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

const LendButton: React.FC<ComponentPropsWithRef<'button'>> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <CommonButton
      variant={CommonButtonVariantEnum.Lend}
      className={twMerge('center-root gap-x-2', className)}
      {...otherProps}
    >
      <ArrowRightUpIcon className={twMerge('text-brandTertiary')} />
      {getLabel('lLend')}
    </CommonButton>
  );
};

export default LendButton;
