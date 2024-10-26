'use client';

import React, { ComponentPropsWithRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { InfoIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { ObjectMultiLanguageProps } from '@/models';
import { CommonToggleButton } from '@/components/common';

const ReceiveAlerts: React.FC<ReceiveAlertsProps> = ({
  checked,
  className,
  onCheckReceiveAlert,
}) => {
  const { t: getLabel } = useTranslation();
  const objectTeleNotification = getLabel('objTeleNotification', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  return (
    <div className={twMerge('w-full', 'space-between-root', className)}>
      <div className="flex items-center gap-x-1">
        <p className="text-sm font-medium">
          {objectTeleNotification.lReceiveAlerts}
        </p>
        <InfoIcon className="w-4 h-4 text-neutral5 cursor-pointer" />
      </div>
      <CommonToggleButton
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckReceiveAlert(checked);
        }}
      />
    </div>
  );
};

export default ReceiveAlerts;

interface ReceiveAlertsProps extends ComponentPropsWithRef<'div'> {
  checked: boolean;
  onCheckReceiveAlert: (checked: boolean) => void;
}
