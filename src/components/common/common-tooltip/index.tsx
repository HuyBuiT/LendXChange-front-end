'use client';

import React, { ReactNode } from 'react';
import {
  Root,
  Portal,
  Trigger,
  Content,
  Provider,
  TooltipProps,
  TooltipContentProps,
} from '@radix-ui/react-tooltip';
import { AppConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useWindowSize } from '@/hooks/common-hooks';
import TooltipArrow, { TooltipArrowProps } from './TooltipArrow';

const CommonTooltip: React.FC<CommonTooltipProps> = ({
  isOpen,
  trigger,
  children,
  arrowProps,
  triggerClassName,
  contentProps = {},
  variant = CommonTooltipVariantEnum.Text,
  ...otherProps
}) => {
  const { windowWidth } = useWindowSize();

  const { className: contentClassName, ...otherContentProps } = contentProps;

  return (
    <Provider>
      <Root
        open={windowWidth <= AppConstant.BREAK_POINTS.lg ? isOpen : undefined}
        {...otherProps}
        delayDuration={300}
        disableHoverableContent={false}
      >
        <Trigger
          asChild
          className={twMerge('cursor-pointer', triggerClassName)}
        >
          {trigger}
        </Trigger>

        <Portal>
          <Content
            className={twMerge(
              'z-40',
              'border',
              'max-w-72',
              'text-neutral1 text-sm',
              variant === CommonTooltipVariantEnum.Text
                ? 'p-2 rounded bg-primary6 border-transparent'
                : 'p-0 rounded-lg bg-characterBackground3 border-white/20',
              contentClassName,
            )}
            side="top"
            align="start"
            {...otherContentProps}
          >
            {children}
            {variant === CommonTooltipVariantEnum.Text && (
              <TooltipArrow {...arrowProps} />
            )}
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};

export default CommonTooltip;

export interface CommonTooltipProps extends TooltipProps {
  isOpen?: boolean;
  trigger: ReactNode;
  triggerClassName?: string;
  arrowProps?: TooltipArrowProps;
  contentProps?: TooltipContentProps;
  variant?: CommonTooltipVariantEnum;
}

export enum CommonTooltipVariantEnum {
  Text = 'text',
  Info = 'info',
}
