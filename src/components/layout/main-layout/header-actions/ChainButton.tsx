'use client';

import React, { ComponentPropsWithoutRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import {
  DropdownContent,
  DropdownRoot,
  DropdownTrigger,
} from '@/components/common';

import { CommonUtils } from '@/utils';
import { SupportedChainEnum } from '@/models';
import { useAppContext, useAuthContext } from '@/context';
import { CaretIcon, CheckIcon } from '@/components/icons';

import Image from 'next/image';
import { ActiveNetwork } from '@/const/app.const';

const ChainButton = () => {
  const { selectedChain } = useAppContext();
  const { handleSwitchChain } = useAuthContext();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownRoot open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownTrigger>
        <ButtonChain onClick={() => setIsOpen(true)} />
      </DropdownTrigger>
      <DropdownContent
        className={twJoin(
          'min-w-[190px]',
          'overflow-hidden',
          'border border-white/20',
        )}
        align="center"
      >
        {Object.values(SupportedChainEnum).map((item, index) => {
          const networkKey = Object.keys(SupportedChainEnum)[index];
          const networkValue = Object.values(SupportedChainEnum)[index];
          const isActive =
            ActiveNetwork[networkValue as keyof typeof ActiveNetwork];
          // Only render button if network is active
          if (!isActive) return null;

          return (
            <button
              key={index}
              className={twJoin(
                'w-full',
                'px-4 py-2',
                'hover:bg-white/10',
                'space-between-root gap-x-2',
                'border-t border-neutral7 first:border-transparent',
              )}
              onClick={() => {
                setIsOpen(!isOpen);
                handleSwitchChain(item);
              }}
            >
              <div className="flex items-center gap-x-2">
                <Image
                  width={20}
                  height={20}
                  alt="Chain logo"
                  className="rounded-full"
                  src={CommonUtils.getChainImageSrcByValue(item)}
                />
                <p>{networkKey}</p>
              </div>

              {selectedChain === item && <CheckIcon />}
            </button>
          );
        })}
      </DropdownContent>
    </DropdownRoot>
  );
};

export default ChainButton;

const ButtonChain: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...otherProps
}) => {
  const { selectedChain } = useAppContext();

  return (
    <div
      className={twMerge(
        'font-normal',
        'rounded-[56px]',
        'flex items-center',
        'px-2 py-2 sm:px-4',
        'gap-x-1 sm:gap-x-2',
        'max-h-[36px] sm:max-h-[40px]',
        'bg-black/10 sm:bg-characterBackground2',
        className,
      )}
      {...otherProps}
    >
      <Image
        width={20}
        height={20}
        alt="Chain logo"
        className="rounded-full"
        src={CommonUtils.getChainImageSrcByValue(selectedChain)}
      />
      <CaretIcon className="!text-neutral1" />
    </div>
  );
};
