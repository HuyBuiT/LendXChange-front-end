'use client';

import React, { useState } from 'react';
import { ImageAssets } from 'public';
import { PathConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { ObjectMultiLanguageProps } from '@/models';
import { useAuthContext } from '@/context';

import Image from 'next/image';
import StringFormat from 'string-format';
import ActionButton from './ActionButton';
import InputNotificationSetup from './InputNotificationSetup';
import WrapperTeleNotifiContent from '../WrapperTeleNotifiContent';

const TeleNotificationConnectContent = () => {
  const { t: getLabel } = useTranslation();
  const { connectedChainAddress } = useAuthContext();

  const objectTeleNotification = getLabel('objTeleNotification', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  const [isConnecting, setIsConnecting] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');

  return (
    <WrapperTeleNotifiContent className="pt-24 sm:pt-10">
      <Image
        src={ImageAssets.TeleNotificationImage}
        alt="Tele Notification Image"
        width={72}
        height={74}
      />
      <p>{objectTeleNotification.lGetNotifications}</p>
      <p className={twJoin('text-center text-sm text-neutral4 px-2')}>
        {objectTeleNotification.msgReceive}
      </p>
      <InputNotificationSetup
        onChange={(e) => setTelegramUsername(e.target.value)}
      />
    </WrapperTeleNotifiContent>
  );
};

export default TeleNotificationConnectContent;
