'use client';

import React, { ReactNode } from 'react';
import {
  Root,
  Title,
  Close,
  Provider,
  Viewport,
  ToastProviderProps,
} from '@radix-ui/react-toast';
import { CloseIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';
import './default.css';

const CommonToast: React.FC<CommonToastProps> = ({
  open,
  children,
  toastTitle,

  titleClassName,
  rootClassName,
  viewPortClassName,

  onOpenChange,
  ...otherProps
}) => {
  return (
    <Provider {...otherProps}>
      <Root
        open={open}
        onOpenChange={onOpenChange}
        className={twMerge(
          'relative',
          'toast-root',
          'w-full sm:min-w-80',
          'flex flex-col gap-y-2',
          'bg-characterBackground2 lg:rounded-lg p-6',
          rootClassName,
        )}
      >
        <Close className={twJoin('absolute top-6 right-4')}>
          <CloseIcon className="text-neutral5" />
        </Close>
        <Title className={twMerge('text-base font-medium', titleClassName)}>
          {toastTitle}
        </Title>
        {children}
      </Root>
      <Viewport
        className={twMerge(
          'lg:p-6',
          'w-full lg:w-fit max-w-[100vw]',
          'fixed top-0 right-0 lg:bottom-0 lg:top-auto left-0 z-[1000]',
          viewPortClassName,
        )}
      />
    </Provider>
  );
};

export default CommonToast;

export interface CommonToastProps extends ToastProviderProps {
  open: boolean;
  toastTitle: ReactNode;

  rootClassName?: string;
  titleClassName?: string;
  viewPortClassName?: string;

  onOpenChange: () => void;
}
