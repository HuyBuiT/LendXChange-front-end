'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { CommonUtils } from '@/utils';
import { twMerge } from 'tailwind-merge';
import { HeathRatioStatusEnum } from '@/models';

const HealthRatio: React.FC<HealthRatioProps> = ({
  value,
  className,
  ...otherProps
}) => {
  const ratioStatus = CommonUtils.getHealthRatioStatusByValue(value);

  return (
    <span
      className={twMerge(
        'inline-block',
        ratioStatus === HeathRatioStatusEnum.ExtremelyRisky
          ? 'text-error2'
          : ratioStatus === HeathRatioStatusEnum.Risky
            ? 'text-warning2'
            : ratioStatus === HeathRatioStatusEnum.Normal
              ? 'text-success2'
              : ratioStatus === HeathRatioStatusEnum.Good
                ? 'text-success3'
                : 'text-success4',
        className,
      )}
      {...otherProps}
    >
      {value.toFixed(2)}
    </span>
  );
};

export default HealthRatio;

interface HealthRatioProps extends ComponentPropsWithoutRef<'span'> {
  value: number;
}
