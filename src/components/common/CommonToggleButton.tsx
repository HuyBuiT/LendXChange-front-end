'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Root, Thumb, SwitchProps } from '@radix-ui/react-switch';

const CommonToggleButton: React.FC<CommonToggleButtonProps> = ({
  className,
  onCheckedChange,
  switchThumbClassName,
  ...otherProps
}) => {
  return (
    <Root
      className={twMerge(
        'relative',
        'bg-neutral7',
        'w-[42px] h-6',
        'rounded-full',
        'data-[state=checked]:bg-primary6',
        className,
      )}
      onCheckedChange={(checked) => onCheckedChange(checked)}
      {...otherProps}
    >
      <Thumb
        className={twMerge(
          'block',
          'bg-neutral1',
          'rounded-full',
          'w-[21px] h-[21px]',
          'data-[state=checked]:translate-x-5',
          'duration-100 translate-x-0.5 will-change-transform',
          switchThumbClassName,
        )}
      />
    </Root>
  );
};

export default CommonToggleButton;

interface CommonToggleButtonProps extends SwitchProps {
  onCheckedChange: (checked: boolean) => void;
  switchThumbClassName?: string;
}
