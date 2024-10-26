'use client';

import React, { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

const SelectPageSize: FC<SelectPageSizeProps> = ({
  containerClassName,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <div
      className={twMerge(
        'pl-4 pr-2 py-2',
        'rounded-lg border border-neutral5/50',
        containerClassName,
      )}
    >
      <select
        className={twMerge(
          'text-sm bg-transparent',
          'focus-visible:outline-none',
        )}
        {...otherProps}
      >
        {LIST_PAGE_SIZE.map((item, index) => (
          <option key={index} value={item}>
            {getLabel('fmShow', { value: item })}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectPageSize;

interface SelectPageSizeProps extends ComponentPropsWithoutRef<'select'> {
  containerClassName?: string;
}

const LIST_PAGE_SIZE = [5, 10, 20, 30];
