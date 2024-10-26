'use client';

import React, { ComponentPropsWithRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import TooltipTotalValueCard from './TooltipTotalValueCard';
import { FormatUtils } from '@/utils';

const TotalValueCard: React.FC<TotalValueCardProps> = ({
  cardValue,
  className,
  cardTitle,
  contentTooltip,
  fluctuationsValue,
  classNameContainer,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'p-px',
        'rounded-lg',
        'w-full sm:w-fit',
        fluctuationsValue
          ? 'bg-bgTotalValueCardFluctuations'
          : 'bg-bgTotalValueCardDefault',
        classNameContainer,
      )}
    >
      <div
        className={twMerge(
          'px-6 py-4',
          'rounded-lg',
          'bg-neutral8',
          'w-full h-full',
          'flex flex-col gap-y-1',
          className,
        )}
        {...otherProps}
      >
        <p className="text-sm text-neutral4">{cardTitle}</p>
        <div className="flex items-center gap-x-1">
          <p className="text-2xl font-semibold">
            ${FormatUtils.formatNumber(cardValue, 2)}
          </p>
          {fluctuationsValue}
          <TooltipTotalValueCard contentTooltip={contentTooltip} />
        </div>
      </div>
    </div>
  );
};

export default TotalValueCard;

interface TotalValueCardProps extends ComponentPropsWithRef<'div'> {
  cardTitle: string;
  cardValue: number;
  contentTooltip: string;
  fluctuationsValue?: ReactNode;
  classNameContainer?: string;
}
