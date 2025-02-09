'use client';

import React, { Fragment, useMemo } from 'react';
import {
  DropdownRoot,
  DropdownItem,
  DropdownTrigger,
  DropdownContent,
} from '../common-dropdown';
import { CommonUtils } from '@/utils';
import { twJoin } from 'tailwind-merge';
import { CheckIcon } from '@/components/icons';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';
import {
  SupportTokenType,
  SupportedChainEnum,
  SuiSupportedTokenEnum,
  SolanaSupportedTokenEnum,
} from '@/models';
import Image from 'next/image';
import { useAppContext } from '@/context';

const TokenListDropdown: React.FC<TokenListDropdownProps> = ({
  selectedChain,
  selectedToken,
  triggerProps,

  onSelectToken,
  children,
}) => {
  const { availableAssets } = useAppContext();

  const tokenList = useMemo(() => {
    return CommonUtils.getCollateralAssetsByChain({
      assetMap: availableAssets,
    });
  }, [availableAssets]);

  const tokenEnum = useMemo(() => {
    switch (selectedChain) {
      case SupportedChainEnum.Sui:
        return SuiSupportedTokenEnum;
      default:
        return {} as any;
    }
  }, [selectedChain]);

  return (
    <DropdownRoot>
      <DropdownTrigger {...triggerProps}>{children}</DropdownTrigger>
      <DropdownContent className="w-64" align="start">
        {tokenList.map((value, index) => {
          return (
            <DropdownItem
              key={index}
              className={twJoin('w-full', 'space-between-root')}
              onClick={() => onSelectToken(tokenEnum[value])}
            >
              <div className="flex items-center gap-x-2">
                <Image
                  width={24}
                  height={24}
                  alt="Token image"
                  src={CommonUtils.getTokenImageSrcByValue(tokenEnum[value])}
                />

                <span>{value}</span>
              </div>

              {selectedToken === tokenEnum[value] ? (
                <CheckIcon className="text-primary5" />
              ) : (
                <Fragment />
              )}
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </DropdownRoot>
  );
};

export default TokenListDropdown;

interface TokenListDropdownProps extends React.ComponentPropsWithoutRef<'div'> {
  selectedChain: SupportedChainEnum;
  baseToken: SupportTokenType;
  selectedToken: SupportTokenType;

  onSelectToken: (value: SupportTokenType) => void;

  triggerProps?: DropdownMenuTriggerProps;
}
