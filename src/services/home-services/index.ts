import { CommonUtils } from '@/utils';
import { ApiResponse } from 'apisauce';
import { ApiConstant, AppConstant } from '@/const';
import { createCheckNftApi, createDappServices } from '../config';

import {
  BaseResponseData,
  SupportedChainEnum,
  BestOfferItemViewInterface,
  BestOfferListResponseInterface,
  ActiveLoanListResponseInterface,
  OfferTemplatesApiResponseInterface,
} from '@/models';
import { ResSuppliedAssetInterface, ResLoanBorrowedInterface } from '@/models/home.model';

export const getOfferTemplatesService = async (
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    sorts: {
      'offerTemplate.amount': 'ASC',
    },
  };

  const response: ApiResponse<
    BaseResponseData<OfferTemplatesApiResponseInterface>
  > = await createDappServices().get(ApiConstant.GET_OFFER_TEMPLATES, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as OfferTemplatesApiResponseInterface;
  } else {
    return undefined;
  }
};

export const getInterestNavi = async () => {
  try {
    const response = await fetch(ApiConstant.NAVI_PROTOCOL_URL, {
      method: 'GET',
    });

    if (!response.ok) {
      return undefined;
    }

    return await response.json();
  } catch (err) {
    console.log(err);

    return undefined;
  }
};

export const getBestOffersDashboard = async (
  templateId: string,
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    network: selectedChain,
    templateId: templateId,
    pageSize: AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER,
    pageNum: 1,
    sorts: {
      'offer.interestRate': 'ASC',
    },
  };
  const apiUrl = ApiConstant.GET_BEST_OFFERS;

  const response: ApiResponse<BaseResponseData<BestOfferItemViewInterface>> =
    await createDappServices().get(apiUrl, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as BestOfferListResponseInterface;
  } else {
    return undefined;
  }
};

export const getLoansByTemplateId = async (
  templateId: string,
  selectedChain: SupportedChainEnum,
) => {
  const params = {
    network: selectedChain,
    templateId: templateId,
    pageSize: AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER,
    pageNum: 1,
    sorts: {
      'loan.createdAt': 'DESC',
    },
  };
  const apiUrl = ApiConstant.GET_ACTIVE_LOANS;

  const response: ApiResponse<
    BaseResponseData<ActiveLoanListResponseInterface>
  > = await createDappServices().get(apiUrl, params);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as ActiveLoanListResponseInterface;
  } else {
    return undefined;
  }
};

export const getAssetsByOwner = async (
  walletAddress: string,
  pageNum: number,
) => {
  const url = ApiConstant.CHECK_NFT_SOURCE;
  const response: ApiResponse<any> = await createCheckNftApi().post(url, {
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: pageNum,
    },
    id: 'my-id',
    jsonrpc: '2.0',
  });

  if (!response.status) return undefined;

  if (response.status >= 200 && response.status < 300) {
    return response.data.result;
  }
};

export const getSuppliedAssetService = async (access: string) => {
  const response: ApiResponse<BaseResponseData<ResSuppliedAssetInterface>> =
    await createDappServices(access).get(ApiConstant.SUPPLIED_ASSET);

  const responseData = CommonUtils.getDappServicesResponseData(
    response,
  ) as ResSuppliedAssetInterface;

  if (responseData) {
    return responseData;
  } else {
    return undefined;
  }
};

export const getLoanBorrowedService = async (access: string) => {
  const response: ApiResponse<BaseResponseData<ResLoanBorrowedInterface[]>> =
    await createDappServices(access).get(ApiConstant.LOAN_BORROWED);

  const responseData = CommonUtils.getDappServicesResponseData(
    response,
  ) as ResLoanBorrowedInterface[];

  if (responseData) {
    return responseData;
  } else {
    return undefined;
  }
};