'use client';

import React, { ComponentPropsWithRef, useEffect, useMemo } from 'react';
import { ImageAssets } from 'public';
import { AppConstant } from '@/const';
import { Loading } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { useWindowSize } from '@/hooks/common-hooks';
import { useAuthContext } from '@/context';

import NotificationListHeader from './NotificationListHeader';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationListItem from './NotificationListItem';
import Image from 'next/image';
import { NotificationTypeEnum } from '@/models';

const NotificationListContent: React.FC<NotificationListContentProps> = ({
  className,

  onClose,
  ...otherProps
}) => {
  const { windowWidth } = useWindowSize();
  const { t: getLabel } = useTranslation();

  const { isWalletConnected, connectedChainAddress } = useAuthContext();

  const handleGetTitleNotifi = (notifiType: NotificationTypeEnum) => {
    if (notifiType === NotificationTypeEnum.HEALTH_RATIO) {
      return getLabel('lHealthRatioAlert');
    } else if (notifiType === NotificationTypeEnum.LIQUIDATION) {
      return getLabel('lLiquidationALert');
    } else if (notifiType === NotificationTypeEnum.OFFER_CANCELLED) {
      return getLabel('lFundReturned');
    } else if (notifiType === NotificationTypeEnum.CONTRACT_FINISHED) {
      return getLabel('lPaymentReceived');
    } else if (notifiType === NotificationTypeEnum.BORROWER_PAID) {
      return getLabel('lRepaymentSuccessful');
    } else {
      return getLabel('lContractAlert');
    }
  };

  return (
    <div
      className={twMerge(
        'pb-3',
        'flex flex-col',
        'bg-characterBackground2',
        'rounded-t-lg sm:rounded-lg',
        'w-full sm:w-[325px] h-[80vh] sm:h-[618px]',
        className,
      )}
      {...otherProps}
    >
    </div>
  );
};

export default NotificationListContent;

interface NotificationListContentProps extends ComponentPropsWithRef<'div'> {
  onClose: () => void;
}
