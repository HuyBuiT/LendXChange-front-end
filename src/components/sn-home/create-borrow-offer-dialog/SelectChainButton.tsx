'use client';

import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
} from '@/components/common';
import { CommonUtils } from '@/utils';
import { useAppContext } from '@/context';
import { SupportedChainEnum } from '@/models';
import { CheckIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';

import Image from 'next/image';

const SelectChainButton: React.FC<SelectChainButtonProps> = ({
  selectChainBorrow,
  onSelectChainBorrow,
}) => {
  const { selectedChain } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectChainBorrow === selectedChain) return;
    onSelectChainBorrow(selectedChain);
  }, [selectedChain]);

  return (
    <DropdownRoot open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownTrigger disabled>
        <SelectButton
          onClick={() => setIsOpen(true)}
          chain={selectChainBorrow}
        />
      </DropdownTrigger>
      <DropdownContent
        className={twJoin(
          'w-[190px]',
          'overflow-hidden',
          'border border-white/20',
        )}
        align="center"
      >
        {Object.values(SupportedChainEnum).map((item, index) => (
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
              onSelectChainBorrow(item);
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
              <p>{Object.keys(SupportedChainEnum)[index]}</p>
            </div>

            {selectChainBorrow === item && <CheckIcon />}
          </button>
        ))}
      </DropdownContent>
    </DropdownRoot>
  );
};

export default SelectChainButton;

interface SelectChainButtonProps {
  selectChainBorrow: SupportedChainEnum;
  onSelectChainBorrow: (value: SupportedChainEnum) => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({
  chain,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        'h-9',
        'py-2 px-4',
        'rounded-l rounded-r-none',
        'flex items-center gap-x-2',
        'bg-characterBackground2 hover:bg-characterBackground3 text-neutral3',
        className,
      )}
      {...otherProps}
    >
      <Image
        width={24}
        height={24}
        alt="Selected chain"
        src={CommonUtils.getChainImageSrcByValue(chain)}
      />

      {/* <ArrowIcon className="text-neutral5" /> */}
    </div>
  );
};

interface SelectButtonProps extends ComponentPropsWithoutRef<'div'> {
  chain: SupportedChainEnum;
}
