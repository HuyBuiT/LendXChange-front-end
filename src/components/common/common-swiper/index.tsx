'use client';

import React, { useRef } from 'react';

import { twMerge } from 'tailwind-merge';
import { Swiper, SwiperProps } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import SwiperArrowButton, {
  SwiperArrowButtonActionEnum,
} from './SwiperArrowButton';

import './override-swiper.css';
import 'swiper/css';

const CommonSwiper: React.FC<CommonSwiperProps> = ({
  children,
  className,
  buttonWrapperClassName,
  ...otherProps
}) => {
  const swiperRef = useRef<any>(null);

  return (
    <div className={twMerge('relative', className)}>
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={true}
        centeredSlides
        modules={[Autoplay, Navigation, Pagination]}
        {...otherProps}
        pagination={{
          clickable: true,
          renderBullet: function (_, classNamePagination) {
            return `<div
              class="${classNamePagination}"
            ></div>`;
          },
        }}
      >
        {children}
      </Swiper>

      <SwiperArrowButton
        onClick={() => swiperRef.current?.slideNext()}
        direction={SwiperArrowButtonActionEnum.Previous}
        className={twMerge('hidden sm:flex', buttonWrapperClassName)}
      />
    </div>
  );
};

export default CommonSwiper;

export interface CommonSwiperProps extends SwiperProps {
  className?: string;
  buttonWrapperClassName?: string;
  children: React.ReactNode; // Must use SwiperSlide
  classNamePagination?: string;
}
