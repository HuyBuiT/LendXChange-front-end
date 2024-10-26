'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonButton } from '@/components/common';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

const ActionButton: React.FC<ActionButtonProps> = ({
  isConnecting,
  onCancelConnect,
  onConnectTelegram,
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <div
      className={twMerge(
        'w-full',
        'gap-x-4 gap-y-2',
        'space-between-root flex-col sm:flex-row',
        className,
      )}
      {...otherProps}
    >
      <CommonButton
        className={twJoin('w-full h-full', 'rounded sm:rounded-lg')}
        isLoading={isConnecting}
        disabled={isConnecting}
        onClick={onConnectTelegram}
      >
        {isConnecting ? getLabel('lWaitingToConnect') : getLabel('lConnect')}
      </CommonButton>
      {isConnecting && (
        <CommonButton
          variant={CommonButtonVariantEnum.Outline}
          className={twJoin(
            'px-3',
            'rounded',
            'text-primary5',
            'border border-primary5',
            'w-full sm:w-fit h-full',
          )}
          onClick={onCancelConnect}
        >
          {getLabel('lCancel')}
        </CommonButton>
      )}
    </div>
  );
};

export default ActionButton;

interface ActionButtonProps extends ComponentPropsWithoutRef<'div'> {
  isConnecting: boolean;
  onConnectTelegram: () => void;
  onCancelConnect: () => void;
}
