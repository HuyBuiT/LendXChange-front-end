'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';
import { PathConstant } from '@/const';
import { useAppContext } from '@/context';
import { usePathname } from 'next/navigation';
import { CaretIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import Link from 'next/link';
import ResourcesDropdown from './ResourcesDropdown';

const DesktopNavigation = () => {
  const { t: getLabel } = useTranslation();
  const { listCampaignByChain } = useAppContext();

  return (
    <div className={twJoin('ml-6', 'flex items-center')}>
      <DesktopLink href={PathConstant.ROOT}>{getLabel('lHome')}</DesktopLink>
      <DesktopLink href={PathConstant.LEND}>{getLabel('lLend')}</DesktopLink>
      <DesktopLink href={PathConstant.LOAN}>{getLabel('lLoan')}</DesktopLink>
      <ResourcesDropdown>
        <DesktopLink className="space-between-root">
          {getLabel('lResources')}
          <CaretIcon className="ml-2" />
        </DesktopLink>
      </ResourcesDropdown>

      {listCampaignByChain.length > 0 ? (
        <DesktopLink href={PathConstant.POINT_SYSTEM}>$ENS Reward</DesktopLink>
      ) : (
        <Fragment />
      )}
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
