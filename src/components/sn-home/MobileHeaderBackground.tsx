'use client';

import React, { Fragment } from 'react';
import { AppConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useWindowSize } from '@/hooks/common-hooks';

const MobileHeaderBackground = () => {
  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth <= AppConstant.BREAK_POINTS.sm ? (
        <div
          className={twJoin(
            'fixed top-0 z-[-1]',
            'w-full h-[272px]',
            'bg-cover bg-center bg-no-repeat',
          )}
          style={{
            backgroundImage: "url('/images/img-home-mobile-header-bg.svg')",
          }}
        />
      ) : (
        <Fragment />
      )}
    </>
  );
};

export default MobileHeaderBackground;
