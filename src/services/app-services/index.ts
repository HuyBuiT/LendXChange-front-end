import { CommonUtils } from '@/utils';
import { ApiResponse } from 'apisauce';
import { ApiConstant } from '@/const';
import { BaseResponseData } from '@/models';
import { createDappServices } from '../config';

import { getSolTokensPriceFeedService } from './price-feed-services';

import {
  SolanaWalletsEnum,
  SupportedChainEnum,
  AccountInfoInterface,
  GetNonceResponseInterface,
  PostLoginResponseInterface,
  ResGetAccountInfoInterface,
  Asset,
  GetAssetsQueryParams,
} from '@/models/app.model';

import StringFormat from 'string-format';

export { getSolTokensPriceFeedService };

export const getNonceService = async (walletAddress: string) => {
  const apiUrl = StringFormat(ApiConstant.GET_NONCE, { walletAddress });

  const response: ApiResponse<BaseResponseData<GetNonceResponseInterface>> =
    await createDappServices().get(apiUrl);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as GetNonceResponseInterface;
  } else {
    return undefined;
  }
};

export const postLoginService = async (params: {
  network: SupportedChainEnum;
  walletAddress: string;
  walletType?: SolanaWalletsEnum | string;
  signature: string;
}) => {
  const { network, walletAddress, signature, walletType } = params;
  const apiUrl = StringFormat(ApiConstant.POST_LOGIN, {
    network: network.toUpperCase(),
  });

  const response: ApiResponse<BaseResponseData<PostLoginResponseInterface>> =
    await createDappServices().post(apiUrl, {
      walletAddress,
      signature,
      walletType,
    });

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return {
      accessToken: responseData.accessToken,
      refreshToken: responseData?.refreshToken || '',
    } as PostLoginResponseInterface;
  } else {
    return { accessToken: '', refreshToken: '' } as PostLoginResponseInterface;
  }
};

export const postLogout = async () => {
  const apiUrl = ApiConstant.POST_LOGOUT;

  await createDappServices().post(apiUrl);
};

export const getAccountInfo = async () => {
  const apiUrl = ApiConstant.GET_ACCOUNT_INFO;

  const response: ApiResponse<BaseResponseData<ResGetAccountInfoInterface>> =
    await createDappServices().get(apiUrl);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  return responseData as ResGetAccountInfoInterface;
};

export const accountSetting = async (params: AccountInfoInterface) => {
  const apiUrl = ApiConstant.ACCOUNT_SETTING;

  const response: ApiResponse<BaseResponseData<any>> =
    await createDappServices().post(apiUrl, params);

  const responseData = response.data;

  return Boolean(responseData?.statusCode === ApiConstant.STT_CREATED);
};

export const getAssets = async (params: GetAssetsQueryParams) => {
  const apiUrl = ApiConstant.ASSETS;

  const response: ApiResponse<BaseResponseData<Asset[]>> =
    await createDappServices().get(apiUrl, params);

  const responseData = response.data;

  return responseData;
};

export const syncTransaction = async (
  transactionHash: string,
  network: SupportedChainEnum,
) => {
  const apiUrl = ApiConstant.SYNC_TRANSACTION;
  await createDappServices().post(apiUrl, { transactionHash, network });
};
