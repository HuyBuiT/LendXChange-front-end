'use client';

import React from 'react';
import { ImageAssets } from 'public';
import { AppConstant, PathConstant } from '@/const';
import { twJoin, twMerge } from 'tailwind-merge';
import { SwiperSlide } from 'swiper/react';
import { CommonSwiper } from '@/components/common';
import { useWindowSize } from '@/hooks/common-hooks';
import Image from 'next/image';
import Link from 'next/link';

// TODO: Add swiper when update design

const FirstIntro = () => {
  const { windowWidth } = useWindowSize();

  return (
    <div className="w-full">
      <CommonSwiper buttonWrapperClassName="!hidden">
        <SwiperSlide>
          <div className={twJoin('relative')}>
            <Image
              priority
              alt="intro"
              width={920}
              height={214}
              src={
                windowWidth >= AppConstant.BREAK_POINTS.lg
                  ? ImageAssets.SeasonRewardDesktopImage
                  : windowWidth >= AppConstant.BREAK_POINTS.sm
                    ? ImageAssets.SeasonRewardTabletImage
                    : ImageAssets.SeasonRewardMobileImage
              }
              className="-mt-4 sm:mt-0"
            />

            <div
              className={twMerge(
                'bg-[#B848F7] rounded-full p-[1px] mt-8 mb-[75px]',
                'absolute z-[100] top-1/2 left-1/2 -translate-x-1/2',
              )}
            >
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <Image
            priority
            alt="intro"
            width={920}
            height={214}
            src={
              windowWidth >= AppConstant.BREAK_POINTS.lg
                ? ImageAssets.SuiMaintenanceDesktopImage
                : windowWidth >= AppConstant.BREAK_POINTS.sm
                  ? ImageAssets.SuiMaintenanceTabletImage
                  : ImageAssets.SuiMaintenanceMobileImage
            }
            className="-mt-4 sm:mt-0 sm:rounded-3xl"
          />
        </SwiperSlide>

        <SwiperSlide>
          <div className={twJoin('relative')}>
            <Image
              priority
              alt="intro"
              width={920}
              height={214}
              src={
                windowWidth >= AppConstant.BREAK_POINTS.lg
                  ? ImageAssets.EclipseBannerDesktopImage
                  : windowWidth >= AppConstant.BREAK_POINTS.sm
                    ? ImageAssets.EclipseBannerTabletImage
                    : ImageAssets.EclipseBannerMobileImage
              }
              className="-mt-4 sm:mt-0 rounded-3xl"
            />

            <div
              className={twJoin(
                'sm:ml-8 sm:mb-0',
                'flex flex-col sm:items-start items-center',
                'w-[300px] sm:w-full max-w-[300px] sm:max-w-[330px] lg:max-w-[450px]',
                'absolute top-1/2 left-1/2 sm:left-0 -translate-x-1/2 sm:-translate-x-0 -translate-y-2/3 sm:-translate-y-1/2',
              )}
            >
            </div>
          </div>
        </SwiperSlide>
      </CommonSwiper>
    </div>
  );
};

export default FirstIntro;
