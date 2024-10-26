'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { ImageAssets } from 'public';
import { twJoin } from 'tailwind-merge';
import { usePathname } from 'next/navigation';
import { AppConstant, PathConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { DesktopNavigation, NavigationDrawer } from './navigation';

import Link from 'next/link';
import Image from 'next/image';
import HeaderActions from './header-actions';

const MainLayoutHeader = () => {
  const pathname = usePathname();

  const { windowWidth } = useWindowSize();

  const [isOverIntro, setIsOverIntro] = useState(false);

  const handleCheckScrollPosition = (bodyElm: HTMLElement) => {
    if (!bodyElm) return;

    if (bodyElm.scrollTop > 510) {
      setIsOverIntro(true);
    } else {
      setIsOverIntro(false);
    }
  };

  useEffect(() => {
    const bodyElm = document.getElementById('body');

    if (pathname !== PathConstant.ROOT || !bodyElm) return;

    bodyElm.addEventListener('scroll', () =>
      handleCheckScrollPosition(bodyElm),
    );

    return () => {
      bodyElm.removeEventListener('scroll', () =>
        handleCheckScrollPosition(bodyElm),
      );
    };
  }, [pathname]);

  return (
    <div
      className={twJoin(
        'h-16 w-full',
        'fixed z-10 top-0',
        !isOverIntro &&
          pathname === PathConstant.ROOT &&
          windowWidth <= AppConstant.BREAK_POINTS.sm
          ? 'bg-transparent'
          : 'bg-characterBackground1',
      )}
    >
      <div
        className={twJoin(
          'h-16',
          'py-3 px-6',
          'center-vertical-root',
          'border-b border-b-characterBackground2',
        )}
      >
        <div className={twJoin('w-full', 'space-between-root')}>
          <div className="flex items-center">
            {windowWidth < AppConstant.BREAK_POINTS.lg ? (
              <NavigationDrawer />
            ) : (
              <Fragment />
            )}
            <Link href={PathConstant.ROOT}>
              <Image
                priority
                alt="EnsoFi logo"
                className="w-[38px] sm:w-[116px] h-[38px]"
                src={
                  windowWidth > AppConstant.BREAK_POINTS.sm
                    ? ImageAssets.EnsoTextLogoImage
                    : ImageAssets.EnsoLogoImage
                }
              />
            </Link>

            {windowWidth >= AppConstant.BREAK_POINTS.lg ? (
              <DesktopNavigation />
            ) : (
              <Fragment />
            )}
          </div>

          <HeaderActions />
        </div>
      </div>
    </div>
  );
};

export default MainLayoutHeader;
