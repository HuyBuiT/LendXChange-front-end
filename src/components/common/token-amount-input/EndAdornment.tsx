'use client';

import React from 'react';
import { AppConstant, LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { FormatUtils } from '@/utils';

const EndAdornment: React.FC<EndAdornmentProps> = ({
  balance,
  className,
  convertedBalance,
  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  return (
    <div
      className={twMerge(
        'w-full',
        'space-between-root',
        'text-sm text-neutral5',
        className,
      )}
      {...otherProps}
    >
      <span className="inline-block">
        {getHomeLabel('fmAvailable', { value: balance })}
      </span>

      <span className="inline-block">
        {FormatUtils.formatNumber(
          convertedBalance,
          4,
          2,
          AppConstant.USD_FORMAT,
        )}
      </span>
    </div>
  );
};

export default EndAdornment;

interface EndAdornmentProps extends React.ComponentPropsWithoutRef<'div'> {
  balance: number;
  convertedBalance: number;
}
