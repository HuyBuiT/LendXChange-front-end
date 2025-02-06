'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';
import { PathConstant } from '@/const';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import Link from 'next/link';

const DesktopNavigation = () => {
  const { t: getLabel } = useTranslation();

  return (
    <div className={twJoin('ml-6', 'flex items-center')}>
      <DesktopLink href={PathConstant.ROOT}>{getLabel('lHome')}</DesktopLink>
      <DesktopLink href={PathConstant.LEND}>{getLabel('lLend')}</DesktopLink>
      <DesktopLink href={PathConstant.LOAN}>{getLabel('lLoan')}</DesktopLink>
      <DesktopLink href={PathConstant.PORTFOLIO}>{getLabel('lPortfolio')}</DesktopLink>
    </div>
  );
};

export default DesktopNavigation;

export const DesktopLink: React.FC<ComponentPropsWithoutRef<'a'>> = ({
  href,
  children,
  className,
  ...otherProps
}) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href || '#'}
      className={twMerge(
        'text-sm',
        'py-2 px-6',
        'rounded-lg',
        'font-semibold',
        'hover:text-neutral1',
        'focus-visible:outline-none',
        'hover:bg-characterBackground3',
        isActive ? 'text-neutral1 bg-characterBackground3' : 'text-neutral5',
        className,
      )}
      {...otherProps}
    >
      {children}
    </Link>
  );
};
