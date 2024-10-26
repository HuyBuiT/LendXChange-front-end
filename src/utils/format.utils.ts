import { AppConstant } from '@/const';
import { TokenDecimalsEnum } from '@/models';

export const convertLargeNumber = (
  value?: string | number,
  localeOption = {},
) => {
  if (!value) return 0;

  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? (Math.abs(Number(value)) / 1.0e9).toLocaleString('en-US', {
        maximumFractionDigits: 2,
        ...localeOption,
      }) + 'B'
    : // Six Zeroes for Millions
      Math.abs(Number(value)) >= 1.0e6
      ? (Math.abs(Number(value)) / 1.0e6).toLocaleString('en-US', {
          maximumFractionDigits: 2,
          ...localeOption,
        }) + 'M'
      : // Three Zeroes for Thousands
        Math.abs(Number(value)) >= 1.0e3
        ? (Math.abs(Number(value)) / 1.0e3).toLocaleString('en-US', {
            maximumFractionDigits: 2,
            ...localeOption,
          }) + 'K'
        : Math.abs(Number(value)).toLocaleString('en-US', {
            maximumFractionDigits: 4,
            minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
            ...localeOption,
          });
};
export const formatNumber = (
  numberValue?: number,
  maximumFractionDigits = 2,
  minimumFractionDigits = 0,
  localeOption = {},
) => {
  try {
    if (!numberValue && numberValue !== 0)
      return AppConstant.NOT_HAVE_VALUE_LABEL;
    const num = Number(numberValue);

    return num.toLocaleString('en-US', {
      maximumFractionDigits,
      minimumFractionDigits: minimumFractionDigits,
      ...localeOption,
    });
  } catch (error) {
    return String(numberValue);
  }
};

export const formatSUI = (balance: string, pow?: number) => {
  const total = Number(balance);
  const divisor = Math.pow(10, pow ? pow : 9);

  const suiBalance = Number(total / divisor);

  return isNaN(suiBalance) ? 0 : suiBalance;
};

export const convertDisplayUnit = (
  blockChainUnit: number,
  pow: TokenDecimalsEnum,
) => {
  if (!blockChainUnit || !pow) return 0;
  return Number(blockChainUnit / Math.pow(10, pow));
};
