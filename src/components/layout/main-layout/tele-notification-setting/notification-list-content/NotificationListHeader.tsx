'use client';

import React, { ComponentPropsWithRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CloseIcon, SettingIcon } from '@/components/icons';

const NotificationListHeader: React.FC<NotificationListHeaderProps> = ({
  className,

  onClose,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <div
      className={twMerge(
        'p-4',
        'w-full h-fit',
        'space-between-root',
        'border-b border-b-neutral7',
        className,
      )}
      {...otherProps}
    >
      <div className="flex items-center gap-x-4">
        <p>{getLabel('lNotification')}</p>
      </div>
      <CloseIcon
        width={24}
        height={24}
        className="cursor-pointer text-neutral5"
        onClick={onClose}
      />
    </div>
  );
};

export default NotificationListHeader;

interface NotificationListHeaderProps extends ComponentPropsWithRef<'div'> {
  onClose: () => void;
}
