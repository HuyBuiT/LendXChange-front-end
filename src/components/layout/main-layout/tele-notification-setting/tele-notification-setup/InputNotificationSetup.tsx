'use client';

import React from 'react';
import { ImageAssets } from 'public';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonInput } from '@/components/common';
import { QuestionCircleIcon } from '@/components/icons';
import { ObjectMultiLanguageProps } from '@/models';
import { CommonInputProps } from '@/components/common/CommonInput';
import Image from 'next/image';

const InputNotificationSetup: React.FC<CommonInputProps> = ({
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const objectTeleNotification = getLabel('objTeleNotification', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  return (
    <CommonInput
      placeholder={getLabel('pUserName')}
      inputWrapperClassName={twJoin('w-full')}
      containerInputClassName="w-full"
      startAdornment={
        <Image
          src={ImageAssets.TelegramImage}
          alt="Telegram Image"
          className="mr-2"
          width={24}
          height={24}
        />
      }
      inputMessage={
        <span
          className={twJoin(
            'text-neutral5 text-xs',
            'flex items-center gap-x-1',
          )}
        >
          <QuestionCircleIcon />
          <p>{objectTeleNotification.msgHowToGetTele}</p>
        </span>
      }
      {...otherProps}
    />
  );
};

export default InputNotificationSetup;
