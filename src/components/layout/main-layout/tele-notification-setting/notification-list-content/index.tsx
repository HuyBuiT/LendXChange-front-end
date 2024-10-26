'use client';

import React, { ComponentPropsWithRef, useEffect, useMemo } from 'react';
import { ImageAssets } from 'public';
import { AppConstant } from '@/const';
import { Loading } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { useWindowSize } from '@/hooks/common-hooks';
import { useAuthContext, useNotificationContext } from '@/context';

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

  const {
    notificationHistory,
    paginationNotifiHistory,

    handleGetNotifiHistory,
  } = useNotificationContext();

  const isLoadMore = useMemo(() => {
    return notificationHistory.length < paginationNotifiHistory.total;
  }, [notificationHistory, paginationNotifiHistory]);

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

  useEffect(() => {
    if (!isWalletConnected || !connectedChainAddress) return;
    handleGetNotifiHistory();
  }, [isWalletConnected, connectedChainAddress]);

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
      <NotificationListHeader onClose={onClose} />

      {notificationHistory.length > 0 ? (
        <InfiniteScroll
          next={() =>
            handleGetNotifiHistory(paginationNotifiHistory.pageNum + 1, true)
          }
          height={windowWidth <= AppConstant.BREAK_POINTS.sm ? 650 : 550}
          hasMore={isLoadMore}
          dataLength={paginationNotifiHistory.total}
          loader={
            <div className="center-root mt-3">
              <Loading />
            </div>
          }
        >
          {notificationHistory.map((item, index) => (
            <NotificationListItem
              key={index}
              title={handleGetTitleNotifi(item.notificationType)}
              time={new Date(item.createdAt).getTime() / 1000}
              isUnread={!item.seenAt}
            >
              <p
                className="text-sm text-neutral4"
                dangerouslySetInnerHTML={{ __html: item.metadata.message }}
              ></p>
            </NotificationListItem>
          ))}
        </InfiniteScroll>
      ) : (
        <div
          className={twJoin(
            'px-10',
            'w-full h-full',
            'flex-col center-root gap-y-1',
          )}
        >
          <Image
            width={40}
            height={40}
            alt="Notification settings"
            src={ImageAssets.NotificationImage}
          />
          <p className="text-lg font-semibold text-center">
            {getLabel('msgReceivedAnyNotification')}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationListContent;

interface NotificationListContentProps extends ComponentPropsWithRef<'div'> {
  onClose: () => void;
}
