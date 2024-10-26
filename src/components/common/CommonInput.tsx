'use client';

import React, { ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

const CommonInput: React.FC<CommonInputProps> = ({
  className,
  inputTitle,
  inputMessage,
  endAdornment,
  startAdornment,
  isError = false,
  inputWrapperClassName,
  containerInputClassName,
  ...otherProps
}) => {
  return (
    <div className={twMerge('flex flex-col gap-y-1', containerInputClassName)}>
      <span className="text-sm">{inputTitle}</span>
      <div
        className={twJoin(
          'px-3',
          'relative',
          'bg-inherit',
          'w-fit h-fit',
          'rounded border',
          'flex items-center',
          isError
            ? 'focus-within:border-error2'
            : 'focus-within:border-neutral7',
          isError ? 'border-error2' : 'border-neutral7',
          inputWrapperClassName,
        )}
      >
        {startAdornment}
        <input
          className={twMerge(
            'w-64 h-12',
            'bg-inherit',
            'text-base font-inter',
            'focus-visible:outline-none',
            isError ? 'text-error2' : 'text-neutral1',
            className,
          )}
          {...otherProps}
        />
        {endAdornment}
      </div>
      <span
        className={twJoin('text-sm', isError ? 'text-error2' : 'text-neutral1')}
      >
        {inputMessage}
      </span>
    </div>
  );
};

export default CommonInput;

export interface CommonInputProps extends React.ComponentPropsWithRef<'input'> {
  isError?: boolean;
  inputTitle?: ReactNode;
  inputMessage?: ReactNode;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  inputWrapperClassName?: string;
  containerInputClassName?: string;
}
