'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

const ContentHeader: React.FC<ContentHeaderProps> = ({
  label,
  endLabel,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'w-full',
        'px-4 py-3',
        'space-between-root',
        'text-neutral5 text-xs',
        'bg-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      <span>{label}</span>
      <span>{endLabel}</span>
    </div>
  );
};

export default ContentHeader;

interface ContentHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  endLabel: string;
}
