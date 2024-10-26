'use client';

import React, { ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

const CommonAmountInput: React.FC<CommonAmountInputProps> = ({
  className,
  endAdornment,
  startAdornment,
  wrapperInputClassName,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'relative',
        'w-fit h-fit',
        'px-3 py-3.5',
        'flex items-center',
        'rounded border border-neutral7',
        wrapperInputClassName,
      )}
    >
      {startAdornment}
      <NumericFormat
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        thousandSeparator={true}
        className={twJoin(
          'bg-inherit',
          'focus-visible:outline-none',
          'text-lg font-inter font-semibold',
          className,
        )}
        {...otherProps}
      />
      {endAdornment}
    </div>
  );
};

export default CommonAmountInput;

export interface CommonAmountInputProps extends NumericFormatProps {
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  wrapperInputClassName?: string;
}
