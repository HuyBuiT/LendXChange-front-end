'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import CommonButton, {
  CommonButtonVariantEnum,
} from '@/components/common/CommonButton';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { ObjectMultiLanguageProps } from '@/models';

const HealthRatio: React.FC<HealthRatioProps> = ({
  className,
  healthRatio,
  onSelectHealthRatio,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const objectTeleNotification = getLabel('objTeleNotification', {
    returnObjects: true,
  }) as ObjectMultiLanguageProps;

  return (
    <div
      className={twMerge('w-full', 'flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <p className={twJoin('w-full', 'text-sm text-neutral4 text-start')}>
        {objectTeleNotification.msgAlertMe}
      </p>
      <div className={twJoin('w-full', 'gap-x-2', 'space-between-root')}>
        {DEFAULT_HEALTH_RATIO_OPTIONS.map((item, index) => (
          <CommonButton
            variant={
              item === healthRatio
                ? CommonButtonVariantEnum.Primary
                : CommonButtonVariantEnum.Outline
            }
            key={index}
            className={twJoin(
              'w-full',
              item === healthRatio ? '' : 'text-neutral5',
            )}
            onClick={() => {
              onSelectHealthRatio(item);
            }}
          >
            {item}
          </CommonButton>
        ))}

        <input
          placeholder={getLabel('lCustom')}
          className={twJoin(
            'px-4 py-2',
            'w-full h-auto',
            'bg-transparent ',
            'border rounded-lg',
            'text-neutral5 text-sm text-center font-medium',
            'focus-visible:outline-none focus-visible:border-primary5 focus-visible:text-neutral1',
            !DEFAULT_HEALTH_RATIO_OPTIONS.includes(healthRatio)
              ? 'border-primary5'
              : 'border-neutral7',
          )}
          onChange={(e) => onSelectHealthRatio(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default HealthRatio;

interface HealthRatioProps extends ComponentPropsWithoutRef<'div'> {
  healthRatio: number;
  onSelectHealthRatio: (value: number) => void;
}

const DEFAULT_HEALTH_RATIO_OPTIONS = [
  Number(process.env.LIQUID),
  Number(process.env.NORMAL_HEALTH_RATIO),
];
