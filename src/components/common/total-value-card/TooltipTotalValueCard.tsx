'use client';

import React, { useState } from 'react';
import { InfoIcon } from '@/components/icons';
import CommonTooltip, { CommonTooltipVariantEnum } from '../common-tooltip';

const TooltipTotalValueCard: React.FC<TooltipTotalValueCardProps> = ({
  contentTooltip,
}) => {
  const [isShowTooltip, setIsShowTooltip] = useState(false);

  return (
    <CommonTooltip
      variant={CommonTooltipVariantEnum.Text}
      isOpen={isShowTooltip}
      contentProps={{
        className: 'w-fit',
        sideOffset: 5,
        onPointerDownOutside: () => setIsShowTooltip(false),
      }}
      trigger={
        <button onClick={() => setIsShowTooltip(!isShowTooltip)}>
          <InfoIcon className="text-neutral5" width={20} height={20} />
        </button>
      }
    >
      <p className="text-center text-sm">{contentTooltip}</p>
    </CommonTooltip>
  );
};

export default TooltipTotalValueCard;

interface TooltipTotalValueCardProps {
  contentTooltip: string;
}
