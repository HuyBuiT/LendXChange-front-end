import { ApiConstant, AppConstant } from '@/const';

import apisauce, { ApiResponse, ApisauceConfig } from 'apisauce';

import Cookie from 'js-cookie';

const DEFAULT_CONFIG: ApisauceConfig = {
  baseURL: ApiConstant.BASE_SOURCE,
  headers: { ...ApiConstant.HEADER_DEFAULT },
  timeout: ApiConstant.TIMEOUT,
};

const handleErrorRequest = (response: ApiResponse<ApiResponseInterface>) => {
  if (
    response.status &&
    ![ApiConstant.STT_OK, ApiConstant.STT_CREATED].includes(response.status)
  ) {
    if (response.status === ApiConstant.STT_UNAUTHORIZED) {
      window.localStorage.setItem(
        AppConstant.KEY_API_RESPONSE,
        response.status.toString(),
      );
    }
    window.dispatchEvent(new Event('storage'));

    console.log(response);
  }
};

const Api = apisauce.create(DEFAULT_CONFIG);
export default Api;

Api.addResponseTransform(handleErrorRequest);

const createInstance = (token?: string) => {
  const newToken = token || Cookie.get(AppConstant.KEY_TOKEN);
  newToken && Api.setHeader('Authorization', `Bearer ${newToken}`);

  return Api;
};

export const createDappServices = (token?: string) => createInstance(token);

export const createPriceFeedApi = (baseURL: string) => {
  const newConfig = {
    ...DEFAULT_CONFIG,
    baseURL,
  };

  const newApi = apisauce.create(newConfig);
  return newApi;
};

export const createCheckNftApi = () => {
  const newConfig = {
    ...DEFAULT_CONFIG,
    baseURL: ApiConstant.CHECK_NFT_SOURCE,
  };

  const newApi = apisauce.create(newConfig);
  return newApi;
};

export interface ApiResponseInterface {
  status: number;
  data: object;
}
