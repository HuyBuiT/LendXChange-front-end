'use client';

import React, { useEffect, useState } from 'react';
import { AppConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import ValueButton from './ValueButton';

import CommonAmountInput, {
  CommonAmountInputProps,
} from '../CommonAmountInput';

const PercentageInput: React.FC<PercentageInputProps> = ({
  disabled = false,
  stepValue,
  defaultValue,
  onChangeValue,
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const [value, setValue] = useState(DEFAULT_VALUE);

  const handleChangeValue = (values: any) => {
    setValue(values.value);
  };

  const handleChangeValueByButton = (isMinus?: boolean) => {
    if (!value) return;

    const stepValueString = stepValue?.toString();
    const stepValueNumber = parseFloat(stepValueString || STEP_VALUE);

    if (isMinus) {
      setValue((parseFloat(value) - stepValueNumber).toString());
    } else {
      setValue((parseFloat(value) + stepValueNumber).toString());
    }
  };

  useEffect(() => {
    if (defaultValue === null || defaultValue === undefined) return;

    setValue(defaultValue.toString());
  }, [defaultValue]);

  useEffect(() => {
    if (value === '' || value === null || value === undefined) return;

    if (onChangeValue instanceof Function) {
      const parseValue = parseFloat(value).toFixed(2);
      onChangeValue(parseValue);
    }
  }, [value]);
  return (
    <div className="flex flex-col gap-y-2">
      <CommonAmountInput
        suffix={'%'}
        value={value}
        isAllowed={(values) =>
          !!values.floatValue &&
          values.floatValue <= AppConstant.MAX_ALLOWED_INTEREST
        }
        onValueChange={handleChangeValue}
        className={twMerge('text-center', className)}
        endAdornment={
          <ValueButton
            onClick={() => handleChangeValueByButton()}
            disabled={
              disabled || Number(value) >= AppConstant.MAX_ALLOWED_INTEREST
            }
          >
            +{stepValue || STEP_VALUE}
          </ValueButton>
        }
        startAdornment={
          <ValueButton
            onClick={() => handleChangeValueByButton(true)}
            disabled={disabled || Number(value) <= Number(STEP_VALUE)}
          >
            -{stepValue || STEP_VALUE}
          </ValueButton>
        }
        disabled={disabled}
        {...otherProps}
      />
      <p className="text-sm text-neutral5 font-light">
        {getLabel('fmCurrentBestOffer', { value: defaultValue })}
      </p>
    </div>
  );
};

export default PercentageInput;

interface PercentageInputProps extends CommonAmountInputProps {
  defaultValue?: number;
  stepValue?: number;
  disabled?: boolean;

  onChangeValue?: (value: string) => void;
}

const DEFAULT_VALUE = '5.5';
const STEP_VALUE = '0.1';
