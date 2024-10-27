'use client';

import React, { Fragment, useState, ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { AppConstant, PathConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { usePathname, useRouter } from 'next/navigation';

import {
  ChatIcon,
  ArrowIcon,
  TwitterIcon,
  DocumentIcon,
  HamburgerIcon,
} from '@/components/icons';
import Drawer from 'react-modern-drawer';
import Link from 'next/link';
import 'react-modern-drawer/dist/index.css';

const NavigationDrawer = () => {
  const router = useRouter();
  const { t: getLabel } = useTranslation();

  const { windowWidth } = useWindowSize();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={handleToggleDrawer}>
        <HamburgerIcon
          className={twJoin('mr-4 sm:mr-6', 'text-neutral3', 'cursor-pointer')}
        />
      </button>

      <Drawer
        open={isOpen}
        onClose={handleToggleDrawer}
        duration={200}
        direction="left"
        overlayOpacity={0}
        size={windowWidth <= AppConstant.BREAK_POINTS.sm ? '100vw' : 200}
        className={twJoin(
          '!top-auto !bottom-0',
          '!h-[calc(100svh-64px)]',
          '!bg-characterBackground3',
        )}
      >
        <div className={twJoin('h-full flex flex-col justify-between')}>
          <div className={twJoin('gap-y-1', 'flex flex-col items-start')}>
            <NavigationItem
              href={PathConstant.ROOT}
              onClick={handleToggleDrawer}
            >
              {getLabel('lHome')}
            </NavigationItem>
            <NavigationItem
              href={PathConstant.LEND}
              onClick={handleToggleDrawer}
            >
              {getLabel('lLend')}
            </NavigationItem>
            <NavigationItem
              href={PathConstant.LOAN}
              onClick={handleToggleDrawer}
            >
              {getLabel('lLoan')}
            </NavigationItem>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default NavigationDrawer;

export const NavigationItem: React.FC<ComponentPropsWithoutRef<'a'>> = ({
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
        'py-3 px-6',
        'w-full h-11',
        'hover:text-neutral1',
        'text-sm font-semibold',
        'flex items-center gap-x-1',
        'focus-visible:outline-none',
        'hover:bg-characterBackground2',
        isActive
          ? 'text-neutral1 bg-characterBackground2'
          : 'text-neutral5 bg-transparent',
        className,
      )}
      {...otherProps}
    >
      {children}
    </Link>
  );
};
