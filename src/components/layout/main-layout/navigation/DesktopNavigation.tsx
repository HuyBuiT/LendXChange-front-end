'use client';

import React, { ComponentPropsWithoutRef, Fragment } from 'react';
import { PathConstant } from '@/const';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { useAuthContext } from '@/context';

export const AdminAddresses = [
  '0x7d8e23c6ca764d6012310907a2b5b936e127ef93547ae8a7424cea776e90772b',
  // Add more admin addresses as needed
];

const DesktopNavigation = () => {
  const { isWalletConnected, setIsOpenConnectDialog, connectedChainAddress } =
    useAuthContext();
  const { t: getLabel } = useTranslation();

  // Check if current address is in admin list
  const isAdmin = connectedChainAddress && AdminAddresses.includes(connectedChainAddress);
  return (
    <div className={twJoin('ml-6', 'flex items-center')}>
      <DesktopLink href={PathConstant.ROOT}>{getLabel('lHome')}</DesktopLink>
      <DesktopLink href={PathConstant.LEND}>{getLabel('lLend')}</DesktopLink>
      <DesktopLink href={PathConstant.LOAN}>{getLabel('lLoan')}</DesktopLink>
      <DesktopLink href={PathConstant.PORTFOLIO}>{getLabel('lPortfolio')}</DesktopLink>
      {isAdmin && (
        <DesktopLink href={PathConstant.ADMIN}>{getLabel('lAdmin')}</DesktopLink>
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
