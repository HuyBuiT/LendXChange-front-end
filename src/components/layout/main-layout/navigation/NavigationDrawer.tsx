'use client';

import React, { Fragment, useState, ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { AppConstant, PathConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext, useReferralContext } from '@/context';

import {
  ChatIcon,
  ArrowIcon,
  TwitterIcon,
  DocumentIcon,
  HamburgerIcon,
} from '@/components/icons';
import { ImageAssets } from 'public';
import { StatusCampaignEnum } from '@/models';
import Drawer from 'react-modern-drawer';
import Link from 'next/link';
import Image from 'next/image';
import 'react-modern-drawer/dist/index.css';

const NavigationDrawer = () => {
  const router = useRouter();
  const { t: getLabel } = useTranslation();

  const { windowWidth } = useWindowSize();
  const { listCampaignByChain } = useAppContext();
  const { liveCampaignInfo, setSelectedCampaign } = useReferralContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isShowResources, setIsShowResources] = useState(true);

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleGetLabelCampaign = (status: StatusCampaignEnum) => {
    switch (status) {
      case StatusCampaignEnum.Past:
        return '( Finished )';
      case StatusCampaignEnum.ComingSoon:
        return '( Coming soon )';
      case StatusCampaignEnum.Live:
        return '';
      default:
        return '';
    }
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
            <NavigationItem
              className="space-between-root"
              onClick={() => setIsShowResources(!isShowResources)}
            >
              <span>{getLabel('lResources')}</span>
              <ArrowIcon
                className={twJoin(isShowResources ? '-rotate-180' : '')}
              />
            </NavigationItem>

            <>
              {isShowResources ? (
                <>
                  <NavigationItem
                    href={PathConstant.DOCUMENT_LINK}
                    target="_blank"
                  >
                    <DocumentIcon /> {getLabel('lDocuments')}
                  </NavigationItem>
                  <NavigationItem
                    href={PathConstant.TWITTER_URL}
                    target="_blank"
                  >
                    <TwitterIcon /> {getLabel('lTwitter')}
                  </NavigationItem>
                  <NavigationItem
                    href={PathConstant.SUPPORT_LINK}
                    target="_blank"
                  >
                    <ChatIcon />
                    {getLabel('lSupport')}
                  </NavigationItem>
                </>
              ) : (
                <Fragment />
              )}
            </>

            {listCampaignByChain.length > 0 ? (
              <NavigationItem
                href={PathConstant.POINT_SYSTEM}
                onClick={handleToggleDrawer}
              >
                $ENS Reward
              </NavigationItem>
            ) : (
              <Fragment />
            )}
          </div>

          <div className="mb-5 mx-4 flex flex-col gap-y-7">
            {listCampaignByChain.map((item) => (
              <button
                className={twJoin(
                  'w-full',
                  'py-3 px-4',
                  'rounded-lg',
                  'bg-white/10',
                  'space-between-root',
                )}
                onClick={() => {
                  setSelectedCampaign(item);
                  setIsOpen(false);
                  router.push(PathConstant.POINT_SYSTEM);
                }}
              >
                <div className="flex flex-col gap-y-2">
                  <p className="text-sm text-white/50">{`${
                    item.name
                  } ${handleGetLabelCampaign(item.status)}`}</p>
                  {item.status === StatusCampaignEnum.Live && (
                    <div className="flex items-center gap-x-2">
                      <Image
                        src={ImageAssets.EnsoCircleLogoImage}
                        alt="EnsoCircleLogoImage"
                        width={30}
                        height={30}
                      />
                      <p className="text-[18px] text-purple1">
                        {liveCampaignInfo.userPoint}
                      </p>
                    </div>
                  )}
                </div>
                <ArrowIcon
                  className="-rotate-90 text-neutral5"
                  width={24}
                  height={24}
                />
              </button>
            ))}
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
