'use client';

import React from 'react';
import { Arrow } from '@radix-ui/react-tooltip';
import { twMerge } from 'tailwind-merge';

const TooltipArrow: React.FC<TooltipArrowProps> = ({
  width,
  height,
  className,
  isShowArrow = true,
}) => {
  return (
    <Arrow
      asChild={!isShowArrow}
      width={width || 7}
      height={height || 4}
      className={twMerge('fill-primary6', className)}
    />
  );
};

export default TooltipArrow;

export interface TooltipArrowProps {
  width?: number;
  height?: number;
  className?: string;
  isShowArrow?: boolean;
}
