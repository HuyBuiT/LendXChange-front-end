'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { ImageAssets } from 'public';
import { PathConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { useAuthContext } from '@/context';
import { ArrowDirectionIcon, EditIcon, InfoIcon } from '@/components/icons';

import StringFormat from 'string-format';
import Image from 'next/image';

const InputNotificationSetting: React.FC<InputNotificationSettingProps> = ({
  className,
  telegramId,
  onClose,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { connectedChainAddress } = useAuthContext();


  return (
    <div
      className={twMerge(
        'flex flex-col',
        'w-[calc(100%-15px)]',
        'rounded border border-neutral7',
        className,
      )}
      {...otherProps}
    >
      <div
        className={twJoin(
          'p-4',
          'w-full',
          'relative',
          'flex items-center gap-x-2',
        )}
      >
        <Image
          width={24}
          height={24}
          alt="telegram image"
          src={ImageAssets.TelegramImage}
        />
        <p>{telegramId}</p>

        <span
          className={twJoin(
            'center-root',
            'bg-primary5',
            'text-center',
            'rounded-full',
            'cursor-pointer',
            'w-[30px] h-[30px]',
            'absolute right-0 translate-x-1/2',
          )}
        >
          <EditIcon className="text-neutral1 w-4 h-4" />
        </span>
      </div>
    </div>
  );
};

export default InputNotificationSetting;

interface InputNotificationSettingProps
  extends ComponentPropsWithoutRef<'div'> {
  telegramId: string;
  onClose: () => void;
}
