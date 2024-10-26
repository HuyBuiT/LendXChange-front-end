'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { ArrowIcon } from '@/components/icons';
import { twMerge } from 'tailwind-merge';

const SwiperArrowButton: React.FC<SwiperArrowButtonProps> = ({
  className,
  direction,
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        'text-center',
        'w-[30px] h-[30px]',
        'bg-white/10 hover:bg-white/20',
        'rounded-full border border-white/20',
        'absolute top-1/2 right-4 sm:right-0 z-50 translate-x-1/2 -translate-y-1/2',
        className,
      )}
      {...otherProps}
    >
      <ArrowIcon
        className={twMerge(
          'm-auto',
          'text-neutral1 w-4 h-4',
          direction === SwiperArrowButtonActionEnum.Next
            ? 'rotate-90'
            : '-rotate-90',
        )}
      />
    </button>
  );
};

export default SwiperArrowButton;

interface SwiperArrowButtonProps extends ComponentPropsWithoutRef<'button'> {
  direction: SwiperArrowButtonActionEnum;
}

export enum SwiperArrowButtonActionEnum {
  Next = 'next',
  Previous = 'previous',
}
