import { ApiConstant } from '@/const';
import { ApiResponse } from 'apisauce';
import { createDappServices } from '../config';
import { CommonUtils, FormatUtils } from '@/utils';

import {
  BaseResponseData,
  TokenDecimalsEnum,
  SupportedChainEnum,
  GetListOfferParams,
  GetListLendContractParams,
  StatisticLendOfferViewInterface,
  ContractListByAddressResponseInterface,
  LendOffersListByAddressResponseInterface,
} from '@/models';

export const getLendOfferListByAddress = async (params: GetListOfferParams) => {
  if (!params.walletAddress) return undefined;

  const newParams = {
    ...params,
    sorts: {
      'offer.createdAt': 'DESC',
    },
  };

  const response: ApiResponse<
    BaseResponseData<LendOffersListByAddressResponseInterface>
  > = await createDappServices().get(ApiConstant.GET_LEND_OFFERS, newParams);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as LendOffersListByAddressResponseInterface;
  } else {
    return undefined;
  }
};

export const getContractListByAddress = async (
  params: GetListLendContractParams,
  type: 'lender' | 'borrower',
) => {
  if (!params.walletAddress || !type) return undefined;

  let cloneParams = {};

  if (type === 'lender') {
    cloneParams = {
      network: params.network,
      templateId: params.templateId,
      isLiquidated: params.isLiquidated,
      statuses: params.statuses,
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      lenderAddress: params.walletAddress,
      sorts: {
        target_date: 'DESC',
      },
    };
  } else {
    cloneParams = {
      network: params.network,
      templateId: params.templateId,
      isLiquidated: params.isLiquidated,
      statuses: params.statuses,
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      borrowerAddress: params.walletAddress,
      sorts: {
        target_date: 'DESC',
      },
    };
  }

  const response: ApiResponse<
    BaseResponseData<ContractListByAddressResponseInterface>
  > = await createDappServices().get(ApiConstant.GET_CONTRACT, cloneParams);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as ContractListByAddressResponseInterface;
  } else {
    return undefined;
  }
};

export const getLendOfferDashboard = async (
  selectedChain: SupportedChainEnum,
) => {
  const response: ApiResponse<
    BaseResponseData<StatisticLendOfferViewInterface>
  > = await createDappServices().get(ApiConstant.GET_LEND_OFFERS_DASHBOARD, {
    network: selectedChain,
  });

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    const newData = {
      ...responseData,
      totalInterestEarned: FormatUtils.convertDisplayUnit(
        responseData.totalInterestEarned,
        TokenDecimalsEnum.USDC,
      ),
      totalOpenOffersValue: FormatUtils.convertDisplayUnit(
        responseData.totalOpenOffersValue,
        TokenDecimalsEnum.USDC,
      ),
      totalActiveContractsValue: FormatUtils.convertDisplayUnit(
        responseData.totalActiveContractsValue,
        TokenDecimalsEnum.USDC,
      ),
      totalInterestInActiveContract: FormatUtils.convertDisplayUnit(
        responseData.totalInterestInActiveContract,
        TokenDecimalsEnum.USDC,
      ),
    };
    return newData as StatisticLendOfferViewInterface;
  } else {
    return undefined;
  }
};
