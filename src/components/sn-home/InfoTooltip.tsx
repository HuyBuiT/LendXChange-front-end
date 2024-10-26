'use client';

import React, { ReactNode } from 'react';
import CommonTooltip, {
  CommonTooltipVariantEnum,
} from '../common/common-tooltip';
import { InfoIcon } from '../icons';
import { twJoin } from 'tailwind-merge';

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  isOpen,
  contentTooltip,
  contentClassName,
  onChangeOpen,
}) => {
  return (
    <CommonTooltip
      variant={CommonTooltipVariantEnum.Text}
      isOpen={isOpen}
      contentProps={{
        className: 'w-fit',
        sideOffset: 5,
        onPointerDownOutside: () => onChangeOpen(false),
      }}
      trigger={
        <button onClick={() => onChangeOpen(!isOpen)}>
          <InfoIcon className="text-neutral5" width={20} height={20} />
        </button>
      }
    >
      <span className={twJoin('text-center text-sm', contentClassName)}>
        {contentTooltip}
      </span>
    </CommonTooltip>
  );
};

export default InfoTooltip;

interface InfoTooltipProps {
  isOpen: boolean;
  contentTooltip: ReactNode;
  contentClassName?: string;
  onChangeOpen: (value: boolean) => void;
}
