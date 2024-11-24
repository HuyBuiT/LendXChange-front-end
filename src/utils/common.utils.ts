import {
  SupportTokenType,
  BaseResponseData,
  ResponseDataList,
  TokenDecimalsEnum,
  SupportedChainEnum,
  HeathRatioStatusEnum,
  SuiSupportedTokenEnum,
  SolanaSupportedTokenEnum,
  SupportedTokenSuiIndexEnum,
  SuiMovementSupportedTokenEnum,
  SupportedTokenSuiMovementIndexEnum,
} from '@/models';
import { ImageAssets } from 'public';
import { DateUtils } from '.';
import { ApiResponse } from 'apisauce';

import { isEmpty } from 'lodash';
import {
  Asset,
  NetworkModeEnum,
} from '@/models/app.model';

export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replace(/-/g, '');
};

export const checkEmailFormat = (email: string): boolean => {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.length && !regexEmail.test(email)) return false;
  else return true;
};

export const snakeToCamelCase = (str: string): string => {
  if (str.includes('_') || str.includes('-'))
    return str
      .toLowerCase()
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', ''),
      );

  return str;
};

export const isUndefinedOrNull = (value: any) => {
  return value === null || value === undefined;
};

export const truncateHash = (
  address?: string,
  startLength = 5,
  endLength = 5,
) => {
  if (!address) return '';
  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength,
  )}`;
};

export const deepEqual = (value1: any, value2: any) => {
  if (value1 === value2) return true;

  if (
    value1 === null ||
    value2 === null ||
    typeof value1 != 'object' ||
    typeof value2 != 'object'
  )
    return false;

  const value1Keys = Object.keys(value1);
  const value2Keys = Object.keys(value2);

  if (value1Keys.length !== value2Keys.length) return false;

  for (const key of value1Keys) {
    if (!value2Keys.includes(key) || !deepEqual(value1[key], value2[key]))
      return false;
  }

  return true;
};

export const getChainImageSrcByValue = (value: SupportedChainEnum) => {
  switch (value) {
    case SupportedChainEnum.Sui:
      return ImageAssets.SuiLogoImage;
    default:
      return '';
  }
};

export const getTokenImageSrcByValue = (value: SupportTokenType) => {
  switch (value) {
    case SolanaSupportedTokenEnum.USDC:
      return ImageAssets.UsdcTokenImage;
    case SolanaSupportedTokenEnum.SOL:
      return ImageAssets.SolTokenImage;
    case SolanaSupportedTokenEnum.BSOL:
      return ImageAssets.BSolTokenImage;
    case SolanaSupportedTokenEnum.MSOL:
      return ImageAssets.MSolTokenImage;
    case SolanaSupportedTokenEnum.JITOSOL:
      return ImageAssets.JitoSolTokenImage;
    case SolanaSupportedTokenEnum.INF:
      return ImageAssets.InfTokenImage;
    case SuiSupportedTokenEnum.SUI:
      return ImageAssets.SuiLogoImage;

    default:
      return '';
  }
};

export const getHealthRatioStatusByValue = (value: number) => {
  if (value < Number(process.env.EXTREMELY_RISKY_HEALTH_RATIO) || !value) {
    return HeathRatioStatusEnum.ExtremelyRisky;
  } else if (
    value >= Number(process.env.EXTREMELY_RISKY_HEALTH_RATIO) &&
    value < Number(process.env.RISKY_HEALTH_RATIO)
  ) {
    return HeathRatioStatusEnum.Risky;
  } else if (
    value >= Number(process.env.RISKY_HEALTH_RATIO) &&
    value < Number(process.env.NORMAL_HEALTH_RATIO)
  ) {
    return HeathRatioStatusEnum.Normal;
  } else if (
    value >= Number(process.env.NORMAL_HEALTH_RATIO) &&
    value < Number(process.env.GOOD_HEALTH_RATIO)
  ) {
    return HeathRatioStatusEnum.Good;
  } else {
    return HeathRatioStatusEnum.VeryGood;
  }
};

export const getTransactionHashInfoLink = (
  chain: SupportedChainEnum,
  transactionHash: string,
) => {
  switch (chain) {
    case SupportedChainEnum.Sui:
      return `${
        process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
          ? process.env.NEXT_PUBLIC_SUI_EXPLORER_URL
          : addSubdomain(
              process.env.NEXT_PUBLIC_SUI_EXPLORER_URL,
              NetworkModeEnum.TEST_NET,
            )
      }/txblock/${transactionHash}`;

    default:
      return '';
  }
};

export const calculateInterestValue = (
  amount: number,
  percent: number,
  durations: number,
  totalItems = 1,
) => {
  const durationRatio = durations / 365;
  const percentRatio = percent / 100;

  return amount * percentRatio * durationRatio * totalItems;
};

export const calculateTotalInterestPercent = (input: {
  waitingInterestAmount: number;
  lendingAmount: number;
  startDate: number;
  endDate: number;
}) => {
  const { waitingInterestAmount, lendingAmount, startDate, endDate } = input;
  if (!startDate) return 0;

  const timeCalculating = endDate - startDate;
  const timeCalculatingRatio =
    DateUtils.convertSecondsToDayHourMinute(timeCalculating);
  const totalInterest = +(
    (((waitingInterestAmount / timeCalculatingRatio.exactDays) * 365) /
      lendingAmount) *
    100
  ).toFixed(2);

  return totalInterest;
};

export const getTimeLabel = (
  getCommonLabel: any,
  endTime: number, // Timestamp
) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const timeRemain = Math.abs(endTime - currentTimestamp);

  const { day, hour, minute, month } =
    DateUtils.convertSecondsToDayHourMinute(timeRemain);

  if (month > 1) {
    return getCommonLabel('fmMonths', {
      count: month,
    });
  }

  if (day > 1) {
    return getCommonLabel('fmDays', {
      count: day,
    });
  }

  if (hour > 1) {
    return getCommonLabel('fmHours', {
      count: hour,
    });
  }

  return getCommonLabel('fmMinutes', {
    count: minute > 0 ? minute : 1,
  });
};

export const getBalanceByChainAndToken = ({
  token,
  balanceMap,
}: {
  token: SupportTokenType;
  balanceMap: Map<SupportTokenType, { balance: number }>;
}) => {
  if (!balanceMap.size || !balanceMap.get(token)) return 0;

  return balanceMap.get(token)?.balance || 0;
};

export const getPriceByChainAndSymbol = ({
  chain,
  token,
  priceMap,
}: {
  chain: SupportedChainEnum;
  token: SupportTokenType;
  priceMap: Map<SupportTokenType, { price: number; priceFeedId: string }>;
}) => {
  if (!priceMap.size) return 0;
  if (chain === SupportedChainEnum.Sui) {
    return priceMap.get(token as SuiSupportedTokenEnum)?.price || 0;
  }
  return 0;
};

export const getCollateralAssetsByChain = ({
  assetMap,
}: {
  assetMap: Map<SupportTokenType, Asset>;
}) => {
  if (!assetMap.size) return [];

  const tokenList = Array.from(assetMap.values())
    .filter((asset) => asset.isCollateralAsset)
    .map((asset) => asset.symbol);
  return tokenList;
};

export const getDecimalToken = (
  network: SupportedChainEnum,
  symbol: SupportTokenType,
) => {
  if (network === SupportedChainEnum.Sui) {
    switch (symbol) {
      case SuiSupportedTokenEnum.USDC:
        return TokenDecimalsEnum.USDC;
      case SuiSupportedTokenEnum.SUI:
        return TokenDecimalsEnum.SUI;
      default:
        return TokenDecimalsEnum.USDC;
    }
  }

  return 0;
};

export const getDappServicesResponseData = (
  response: ApiResponse<BaseResponseData<any>>,
) => {
  const status = response?.status;
  const data = response?.data;

  if (!status || !data) return undefined;

  if (status >= 400 && status <= 500) return undefined;

  const statusCode = data.statusCode;

  if (statusCode >= 200 && statusCode <= 300) {
    return response.data?.data;
  } else {
    return undefined;
  }
};

export const getDappServicesResponseListData = (
  response: ApiResponse<ResponseDataList<any>>,
) => {
  const status = response?.status;
  const data = response?.data;

  if (!status || !data) return undefined;

  if (status >= 400 && status <= 500) return undefined;

  const statusCode = data.statusCode;

  if (statusCode >= 200 && statusCode <= 300) {
    return response.data?.data;
  } else {
    return undefined;
  }
};

export const getSolEnvByToken = (
  token: SolanaSupportedTokenEnum,
  env?: string,
) => {
  if (!env) return '';
  const splitKeys = env.split(',') || [];

  // index USDC_SOL_bSOL_mSOL_JitoSOL_INF
  switch (token) {
    case SolanaSupportedTokenEnum.USDC:
      return splitKeys[0];
    case SolanaSupportedTokenEnum.SOL:
      return splitKeys[1];
    case SolanaSupportedTokenEnum.BSOL:
      return splitKeys[2];
    case SolanaSupportedTokenEnum.MSOL:
      return splitKeys[3];
    case SolanaSupportedTokenEnum.JITOSOL:
      return splitKeys[4];
    case SolanaSupportedTokenEnum.INF:
      return splitKeys[5];
    default:
      return '';
  }
};

export const getSuiMovementEnvByToken = (
  token: SuiMovementSupportedTokenEnum,
  env?: string,
) => {
  if (!env) return '';
  const splitKeys = env.split(',') || [];
  const index = getSuiMovementIndex(token);

  return splitKeys[index] || '';
};

export const getSuiEnvByToken = (
  token: SuiSupportedTokenEnum,
  env?: string,
) => {
  if (!env) return '';
  const splitKeys = env.split(',') || [];
  const index = getSuiIndex(token);

  return splitKeys[index] || '';
};

export const roundUp = (val: number, precision: number = 2): number => {
  return Math.ceil(val * Math.pow(10, precision)) / Math.pow(10, precision);
};

export function addSubdomain(url?: string, subdomain?: string) {
  if (!url || !subdomain) return;
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  const urlObj = new URL(url);
  const hostParts = urlObj.hostname.split('.');

  if (hostParts.length > 1) {
    if (hostParts.length === 2) {
      hostParts.unshift(subdomain);
    } else {
      hostParts.splice(1, 0, subdomain);
    }
    urlObj.hostname = hostParts.join('.');
  }

  return urlObj.toString();
}

export const getPhantomProvider = () => {
  if (typeof window !== 'undefined' && 'phantom' in window) {
    const provider = window.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }
};

export const getBackpackProvider = () => {
  if (typeof window !== 'undefined' && 'backpack' in window) {
    const provider = window.backpack;

    if (provider?.isBackpack) {
      return provider;
    }
  }
};

export const getSolflareProvider = () => {
  if (typeof window !== 'undefined' && 'solflare' in window) {
    const provider = window.solflare;

    if (provider?.isSolflare) {
      return provider;
    }
  }
};

export const getSuiMovementIndex = (token: SuiMovementSupportedTokenEnum) => {
  switch (token) {
    case SuiMovementSupportedTokenEnum.USDC:
      return SupportedTokenSuiMovementIndexEnum.USDC;
    case SuiMovementSupportedTokenEnum.WBTC:
      return SupportedTokenSuiMovementIndexEnum.WBTC;
    case SuiMovementSupportedTokenEnum.WETH:
      return SupportedTokenSuiMovementIndexEnum.WETH;

    default:
      return SupportedTokenSuiMovementIndexEnum.USDC;
  }
};

export const getSuiIndex = (token: SuiSupportedTokenEnum) => {
  switch (token) {
    case SuiSupportedTokenEnum.USDC:
      return SupportedTokenSuiIndexEnum.USDC;
    case SuiSupportedTokenEnum.SUI:
      return SupportedTokenSuiIndexEnum.SUI;

    default:
      return SupportedTokenSuiMovementIndexEnum.USDC;
  }
};
export const getBitgetProvider = () => {
  if (typeof window !== 'undefined' && 'bitkeep' in window) {
    const provider = window.bitkeep?.solana;

    if (provider?.isBitKeep) {
      return provider;
    }
  }
};

export const getSalmonProvider = () => {
  if (typeof window !== 'undefined' && 'salmon' in window) {
    const provider = window.salmon;

    return provider;
  }
};

export const isMobile =
  typeof window !== 'undefined' &&
  !isEmpty(
    window?.navigator?.userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  );

export const convertInterestPushContractSui = (interest: number) => {
  return Math.floor((interest / 100) * 10000);
};

