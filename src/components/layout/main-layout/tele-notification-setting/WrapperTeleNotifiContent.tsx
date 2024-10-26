'use client';

import React, { ComponentPropsWithRef } from 'react';
import { twMerge } from 'tailwind-merge';

const WrapperTeleNotifiContent: React.FC<ComponentPropsWithRef<'div'>> = ({
  className,
  children,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'px-4 pb-4 pt-10',
        'bg-bgTeleNotification',
        'border border-neutral1/20',
        'w-full sm:w-[325px] h-full',
        'rounded-t-lg sm:rounded-lg',
        'flex flex-col gap-y-4 items-center',
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default WrapperTeleNotifiContent;
