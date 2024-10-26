'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { twMerge, twJoin } from 'tailwind-merge';
import {
  SupportTokenType,
  SupportedChainEnum,
  SuiSupportedTokenEnum,
  SolanaSupportedTokenEnum,
  SuiMovementSupportedTokenEnum,
  AptosMovementSupportedTokenEnum,
} from '@/models';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';

import TokenListDropdown from './TokenListDropdown';
import TokenListButton from './TokenListButton';
import { EclipseSupportedTokenEnum } from '@/models/app.model';

const StartAdornment: React.FC<StartAdornmentProps> = ({
  token,
  className,
  selectedChain,
  triggerProps,
  isShowMinButton,

  onClickMin,
  onSelectToken,

  ...otherProps
}) => {
  const [selectedTokenByChain, setSelectedTokenByChain] =
    useState<SupportTokenType>(SolanaSupportedTokenEnum.SOL);

  const handleSelectTokenByChain = (value: SupportTokenType) => {
    onSelectToken(value);
    setSelectedTokenByChain(value);
  };

  useEffect(() => {
    if (selectedChain === SupportedChainEnum.Solana) {
      setSelectedTokenByChain(SolanaSupportedTokenEnum.SOL);
    } else if (selectedChain === SupportedChainEnum.Eclipse) {
      setSelectedTokenByChain(EclipseSupportedTokenEnum.ETH);
    } else if (selectedChain === SupportedChainEnum.SuiMovement) {
      setSelectedTokenByChain(token ?? SuiMovementSupportedTokenEnum.WBTC);
    } else if (selectedChain === SupportedChainEnum.Sui) {
      setSelectedTokenByChain(token ?? SuiSupportedTokenEnum.SUI);
    } else if (selectedChain === SupportedChainEnum.AptosMovement) {
      setSelectedTokenByChain(token ?? AptosMovementSupportedTokenEnum.APT);
    } else {
      setSelectedTokenByChain(SolanaSupportedTokenEnum.SOL);
    }
  }, [selectedChain, token]);

  return (
    <div className={twMerge('flex items-center', className)} {...otherProps}>
      <TokenListDropdown
        baseToken={
          SuiMovementSupportedTokenEnum.USDC || SolanaSupportedTokenEnum.USDC
        }
        triggerProps={triggerProps}
        selectedChain={selectedChain}
        selectedToken={selectedTokenByChain}
        onSelectToken={handleSelectTokenByChain}
      >
        <TokenListButton
          selectedChain={selectedChain}
          selectedToken={selectedTokenByChain}
        />
      </TokenListDropdown>

      {isShowMinButton ? (
        <button
          className={twJoin(
            'h-5',
            'px-1 sm:ml-1 ml-4',
            'center-root',
            'text-sm text-primary5',
            'border border-primary5',
          )}
          onClick={onClickMin}
        >
          MIN
        </button>
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default StartAdornment;

interface StartAdornmentProps extends React.ComponentPropsWithoutRef<'div'> {
  selectedChain: SupportedChainEnum;
  token: SupportTokenType;
  isShowMinButton: boolean;

  triggerProps?: DropdownMenuTriggerProps;

  onClickMin: () => void;
  onSelectToken: (value: SupportTokenType) => void;
}
