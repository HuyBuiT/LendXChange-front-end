'use client';

import React, { useEffect, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';
import { useNotificationContext } from '@/context';
import { ObjectMultiLanguageProps } from '@/models';
import { CloseIcon, InfoIcon } from '@/components/icons';

import HealthRatio from './HealthRatio';
import ReceiveAlerts from './ReceiveAlerts';
import useNotifiHooks from '@/hooks/notifi-hooks';
import InputNotificationSetting from './InputNotificationSetting';
import WrapperTeleNotifiContent from '../WrapperTeleNotifiContent';

const TeleNotificationSettingContent: React.FC<
  TeleNotificationSettingContentProps
> = ({ onClose }) => {
  const { t: getLabel } = useTranslation();

  const {
    currentNotifiSetting,

    setCurrentNotifiSetting,
  } = useNotificationContext();

  const { handleSettingNotification } = useNotifiHooks();

  const [isSetAlertsNotifiError] = useState(false);

  const objectTeleNotification = getLabel('objTeleNotification', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  const [isShowHealthRatio, setIsShowHealthRatio] = useState(false);
  const [healthRatio, setHealthRatio] = useState<number>(
    Number(process.env.NORMAL_HEALTH_RATIO),
  );

  const handleSettingNotifi = async () => {
    const res = await handleSettingNotification(isShowHealthRatio, healthRatio);

    if (res?.userName) {
      setCurrentNotifiSetting(res);
      onClose();
    }
  };

  useEffect(() => {
    setHealthRatio(currentNotifiSetting.healthRatioThreshold);
    setIsShowHealthRatio(currentNotifiSetting.enable);
  }, [currentNotifiSetting]);

  return (
    <WrapperTeleNotifiContent className="pt-4 gap-y-6 sm:gap-y-4 items-start">
      <div className="relative w-full">
        <p
          className={twJoin(
            'pb-4 mb-10 sm:mb-0',
            'text-start sm:text-center',
            'border-b border-b-neutral7 sm:border-none',
          )}
        >
          {objectTeleNotification.lNotificationSetting}
        </p>

        <CloseIcon
          className={twJoin(
            'text-neutral5',
            'cursor-pointer',
            'absolute -top-0.5 right-0',
          )}
          onClick={onClose}
        />
      </div>
      <InputNotificationSetting
        telegramId={currentNotifiSetting.userName}
        onClose={onClose}
      />

      <p className={twJoin('w-full', 'text-sm text-neutral4 text-start')}>
        {objectTeleNotification.msgSelectTheAlerts}
      </p>

      <ReceiveAlerts
        checked={isShowHealthRatio}
        className={twJoin(!isShowHealthRatio && 'mb-[90px]')}
        onCheckReceiveAlert={(checked) => {
          !checked && setHealthRatio(Number(process.env.NORMAL_HEALTH_RATIO));
          setIsShowHealthRatio(checked);
        }}
      />
      {isShowHealthRatio && (
        <div className="w-full flex flex-col gap-y-2">
          <HealthRatio
            healthRatio={healthRatio}
            onSelectHealthRatio={(value) => setHealthRatio(value)}
          />
          {isSetAlertsNotifiError && (
            <p className="text-sm text-error2">{getLabel('msgWentWrong')}</p>
          )}
        </div>
      )}
      <CommonButton className="w-full" onClick={handleSettingNotifi}>
        {getLabel('lDone')}
      </CommonButton>
      {healthRatio < Number(process.env.LIQUID) && isShowHealthRatio && (
        <div className={twJoin('text-warning2', 'flex items-center gap-x-1')}>
          <InfoIcon />
          <p>
            {getLabel('fmMinimumHealthRatio', {
              healthRatio: process.env.LIQUID,
            })}
          </p>
        </div>
      )}
    </WrapperTeleNotifiContent>
  );
};

export default TeleNotificationSettingContent;

interface TeleNotificationSettingContentProps {
  onClose: () => void;
}
