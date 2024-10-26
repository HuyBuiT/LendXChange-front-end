'use client';

import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

const DetailRowItem: React.FC<DetailRowItemProps> = ({
  variant,
  endLabel,
  subLabel,
  className,
  interestPercent,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'space-between-root',
        'px-4 py-2',
        'w-full',
        className,
      )}
      {...otherProps}
    >
      <span
        className={twJoin(
          'text-sm font-medium',
          'flex items-center gap-x-1',
          variant === DetailRowItemVariantEnum.Filled
            ? 'text-primary5'
            : 'text-success3',
        )}
      >
        {interestPercent}%<span className="text-neutral5">{subLabel}</span>
      </span>
      <span className="text-neutral4 text-sm font-medium">{endLabel}</span>
    </div>
  );
};

export default DetailRowItem;

interface DetailRowItemProps extends React.ComponentPropsWithoutRef<'div'> {
  variant: DetailRowItemVariantEnum;
  interestPercent: number;
  subLabel?: string;
  endLabel: string;
}

export enum DetailRowItemVariantEnum {
  Filled = 'filled',
  Open = 'open',
}
