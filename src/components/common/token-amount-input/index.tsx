'use client';

import React, { useEffect, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { SupportedChainEnum, SupportTokenType } from '@/models';
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu';

import CommonAmountInput, {
  CommonAmountInputProps,
} from '../CommonAmountInput';

import StartAdornment from './StartAdornment';
import EndAdornment from './EndAdornment';

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  token,
  balance,
  minValue,
  innitValue,
  className,
  selectedChain,
  convertedBalance,
  wrapperInputClassName,

  triggerProps,

  onChangeValue,
  onSelectToken,
  ...otherProps
}) => {
  const [value, setValue] = useState('');

  const handleChangeValue = (values: any) => {
    setValue(values.value);
  };

  useEffect(() => {
    if (value === null || value === undefined) return;

    if (value === '' && onChangeValue instanceof Function) {
      setValue('');
      onChangeValue('0');
      return;
    }

    if (onChangeValue instanceof Function) {
      const parseValue = parseFloat(value).toFixed(6);
      onChangeValue(parseValue);
    }
  }, [value]);

  useEffect(() => {
    if (innitValue && onChangeValue instanceof Function) {
      onChangeValue(innitValue.toString());
      setValue(innitValue.toString());
    }
  }, [innitValue]);

  return (
    <CommonAmountInput
      decimalScale={6}
      value={value}
      onValueChange={handleChangeValue}
      className={twMerge('mt-8', 'flex-1', 'h-[38px]', 'text-right', className)}
      wrapperInputClassName={twMerge('w-full', wrapperInputClassName)}
      startAdornment={
        <StartAdornment
          token={token}
          className="mt-5"
          triggerProps={triggerProps}
          selectedChain={selectedChain}
          onSelectToken={(value) => {
            setValue('');
            onSelectToken(value);
          }}
          isShowMinButton={minValue > 0}
          onClickMin={() => setValue(minValue.toString())}
        />
      }
      endAdornment={
        <EndAdornment
          balance={balance}
          convertedBalance={convertedBalance}
          className={twJoin('px-2', 'absolute', 'left-0 top-[16px]')}
        />
      }
      {...otherProps}
    />
  );
};

export default TokenAmountInput;

interface TokenAmountInputProps extends CommonAmountInputProps {
  token: SupportTokenType;
  balance: number;
  minValue: number;
  innitValue?: number;
  convertedBalance: number;
  selectedChain: SupportedChainEnum;

  triggerProps?: DropdownMenuTriggerProps;

  onChangeValue?: (value: string) => void;
  onSelectToken: (value: SupportTokenType) => void;
}
