'use client';

import React from 'react';
import { useNotificationContext } from '@/context';

import NotificationListContent from './notification-list-content';
import TeleNotificationConnectContent from './tele-notification-setup';
import TeleNotificationSettingContent from './tele-notification-setting';

const ContentNotification: React.FC<ContentNotificationProps> = ({
  onClose,
}) => {
  const { isTelegramLinked, isChangeSetting } = useNotificationContext();

  return (
    <>
      {!isTelegramLinked ? (
        <TeleNotificationConnectContent />
      ) : (
        <>
          {isChangeSetting ? (
            <TeleNotificationSettingContent onClose={onClose} />
          ) : (
            <NotificationListContent onClose={onClose} />
          )}
        </>
      )}
    </>
  );
};

export default ContentNotification;

interface ContentNotificationProps {
  onClose: () => void;
}
