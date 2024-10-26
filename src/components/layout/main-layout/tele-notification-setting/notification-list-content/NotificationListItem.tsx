'use client';

import React, { ComponentPropsWithRef } from 'react';
import { CommonUtils } from '@/utils';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  title,
  time,
  children,
  isUnread,
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <div
      className={twMerge(
        'py-4 px-4',
        'flex flex-col gap-y-2',
        'border-b border-b-neutral7',
        isUnread && 'bg-primary5/10',
        className,
      )}
      {...otherProps}
    >
      <div className={twJoin('space-between-root')}>
        <p className="font-medium">{title}</p>
        <div className="flex items-center gap-x-2">
          {isUnread && <span className="w-2 h-2 rounded-full bg-primary5" />}
          <p
            className={twJoin(
              'text-sm',
              isUnread ? 'text-primary5' : 'text-neutral5',
            )}
          >
            {getLabel('fmAgo', {
              value: CommonUtils.getTimeLabel(getLabel, time),
            })}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default NotificationListItem;

interface NotificationListItemProps extends ComponentPropsWithRef<'div'> {
  isUnread: boolean;
  title: string;
  time: number;
}
