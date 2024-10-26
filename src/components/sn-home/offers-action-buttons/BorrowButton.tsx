'use client';

import React, { ComponentPropsWithRef } from 'react';
import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { ArrowRightUpIcon } from '@/components/icons';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

const BorrowButton: React.FC<ComponentPropsWithRef<'button'>> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <CommonButton
      variant={CommonButtonVariantEnum.Borrow}
      className={twMerge('center-root gap-x-2', className)}
      {...otherProps}
    >
      <ArrowRightUpIcon
        className={twMerge('rotate-180', 'text-characterDown')}
      />
      {getLabel('lBorrow')}
    </CommonButton>
  );
};

export default BorrowButton;
