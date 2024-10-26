'use client';

import {
  SupportTokenType,
  DataListInterface,
  SupportedChainEnum,
  GetListOfferParams,
  GetListLendContractParams,
  LendContractViewInterface,
  OpenLendOfferViewInterface,
  StatisticLendOfferViewInterface,
} from '@/models';
import { LendService } from '@/services';
import { Asset } from '@/models/app.model';
import { refactorContractList, refactorLendOfferList } from './helper';

const useLendHooks = () => {
  const handleGetListLendOfferByAddress = async (
    params: GetListOfferParams,
    availableAssets: Map<SupportTokenType, Asset>,
  ) => {
    const responseData = await LendService.getLendOfferListByAddress(params);

    const lendOffersData = responseData?.pageData;

    if (!lendOffersData?.length)
      return {
        pageData: [],
        pagination: {
          total: 0,
          pageNum: 0,
        },
      };

    const refactorLendOffers = refactorLendOfferList(
      lendOffersData,
      availableAssets,
    );

    return {
      pageData: refactorLendOffers,
      pagination: {
        pageNum: responseData?.pageNum || 1,
        total: responseData?.total || 0,
      },
    } as DataListInterface<OpenLendOfferViewInterface[]>;
  };

  const handleGetListLendContractByAddress = async (
    params: GetListLendContractParams,
    availableAssets: Map<SupportTokenType, Asset>,
  ) => {
    if (!params.walletAddress)
      return {
        pageData: [] as LendContractViewInterface[],
        pagination: {
          total: 0,
          pageNum: 0,
        },
      };

    const responseData = await LendService.getContractListByAddress(
      params,
      'lender',
    );

    const contractListData = responseData?.pageData;

    if (!contractListData?.length)
      return {
        pageData: [] as LendContractViewInterface[],
        pagination: {
          total: 0,
          pageNum: 0,
        },
      };

    const lendContracts = contractListData.filter(
      (item) => item.lenderAddress === params.walletAddress,
    );

    const refactorContract = refactorContractList(
      lendContracts,
      availableAssets,
    );

    return {
      pageData: refactorContract,
      pagination: {
        pageNum: responseData?.pageNum || 1,
        total: responseData?.total || 0,
      },
    } as DataListInterface<LendContractViewInterface[]>;
  };

  const handleGetLendOfferStatistic = async (
    selectedChain: SupportedChainEnum,
  ) => {
    const responseData = await LendService.getLendOfferDashboard(selectedChain);

    if (responseData) {
      return responseData;
    } else {
      return {} as StatisticLendOfferViewInterface;
    }
  };

  return {
    handleGetLendOfferStatistic,
    handleGetListLendOfferByAddress,
    handleGetListLendContractByAddress,
  };
};

export default useLendHooks;
