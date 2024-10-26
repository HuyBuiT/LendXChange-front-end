'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import CommonButton, {
  CommonButtonProps,
  CommonButtonVariantEnum,
} from '../CommonButton';

const ValueButton: React.FC<ValueButtonProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <CommonButton
      variant={CommonButtonVariantEnum.Outline}
      className={twMerge(
        'center-root',
        'text-base font-normal',
        'bg-characterBackground2 hover:bg-characterBackground3',
        className,
      )}
      {...otherProps}
    >
      {children}
    </CommonButton>
  );
};

export default ValueButton;

interface ValueButtonProps extends CommonButtonProps {}
