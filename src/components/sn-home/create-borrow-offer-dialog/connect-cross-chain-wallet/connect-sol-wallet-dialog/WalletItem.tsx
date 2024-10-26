'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Image, { StaticImageData } from 'next/image';

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  imgSrc,
  className,
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        'px-4 py-2',
        'rounded-lg',
        'flex items-center gap-x-2',
        'text-sm text-neutral1 font-medium',
        'border border-characterBackground2',
        'bg-characterBackground2 hover:bg-characterBackground3',
        className,
      )}
      {...otherProps}
    >
      <Image width={40} height={40} src={imgSrc} alt={title} />
      <span>{title}</span>
    </button>
  );
};

export default WalletItem;

interface WalletItemProps extends React.ComponentPropsWithoutRef<'button'> {
  imgSrc: string | StaticImageData;
  title: string;
}
