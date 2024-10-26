'use client';

import React, { useContext, useState } from 'react';

import {
  LoanStatus,
  LendOfferStatus,
  DataListInterface,
  GetListOfferParams,
  LendContextInterface,
  LendContractViewInterface,
  GetListLendContractParams,
  OpenLendOfferViewInterface,
  StatisticLendOfferViewInterface,
} from '@/models';

import { useAppContext } from '.';
import { AppConstant } from '@/const';
import useLendHooks from '@/hooks/lend-hooks';

const INITIAL_STATE = {} as LendContextInterface;

const LendContext = React.createContext(INITIAL_STATE);

export const useLendContext = () => useContext(LendContext);

export const LendProvider: React.FC<LendProviderProps> = ({ children }) => {
  const { selectedChain, availableAssets } = useAppContext();
  const {
    handleGetLendOfferStatistic,
    handleGetListLendOfferByAddress,
    handleGetListLendContractByAddress,
  } = useLendHooks();

  const [lendStatistic, setLendStatistic] = useState(
    {} as StatisticLendOfferViewInterface,
  );

  //Lend offers
  const [lendOffers, setLendOffers] =
    useState<DataListInterface<OpenLendOfferViewInterface[]>>(INIT_LEND_OFFERS);
  const [openOffers, setOpenOffers] =
    useState<DataListInterface<OpenLendOfferViewInterface[]>>(INIT_LEND_OFFERS);
  const [canceledOffers, setCancelOffer] =
    useState<DataListInterface<OpenLendOfferViewInterface[]>>(INIT_LEND_OFFERS);

  const [selectedTypeDisplayOffer, setSelectedTypeDisplayOffer] = useState(
    StatusDisplayOfferEnum.OPEN_OFFER,
  );

  // Loan
  const [lendContracts, setLendContracts] =
    useState<DataListInterface<LendContractViewInterface[]>>(
      INIT_LEND_CONTRACTS,
    );
  const [activeContracts, setActiveContracts] =
    useState<DataListInterface<LendContractViewInterface[]>>(
      INIT_LEND_CONTRACTS,
    );
  const [repaidContracts, setRepaidContracts] =
    useState<DataListInterface<LendContractViewInterface[]>>(
      INIT_LEND_CONTRACTS,
    );

  const [selectedTypeDisplayLendContract, setSelectedTypeDisplayLendContract] =
    useState(StatusDisplayLendContractEnum.ACTIVE_CONTRACT);

  const handleGetLendList = async (
    params: GetListOfferParams,
    selectedType: StatusDisplayOfferEnum,
  ) => {
    if (!params.walletAddress) return;

    const cloneParams = {
      ...params,
      network: selectedChain,
      status: getStatusOfferParams(selectedType),
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || AppConstant.SIZE_PAGINATION_DEFAULT,
    };

    const responseData = await handleGetListLendOfferByAddress(
      cloneParams,
      availableAssets,
    );

    if (selectedType === StatusDisplayOfferEnum.OPEN_OFFER) {
      setOpenOffers(responseData);
    } else if (selectedType === StatusDisplayOfferEnum.CANCELED_OFFER) {
      setCancelOffer(responseData);
    } else {
      setLendOffers(responseData);
    }
  };

  const handleGetContractList = async (
    params: GetListLendContractParams,
    selectedType: StatusDisplayLendContractEnum,
  ) => {
    if (!params.walletAddress) return;

    const cloneParams = {
      ...params,
      network: selectedChain,
      isLiquidated: false,
      statuses: getStatusLendContractParams(selectedType),
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || AppConstant.SIZE_PAGINATION_DEFAULT,
    };

    const responseData = await handleGetListLendContractByAddress(
      cloneParams,
      availableAssets,
    );

    if (selectedType === StatusDisplayLendContractEnum.ACTIVE_CONTRACT) {
      setActiveContracts(responseData);
    } else if (selectedType === StatusDisplayLendContractEnum.REPAID_CONTRACT) {
      setRepaidContracts(responseData);
    } else {
      setLendContracts(responseData);
    }
  };

  const handleGetDataStatistic = async () => {
    const responseData = await handleGetLendOfferStatistic(selectedChain);

    setLendStatistic(responseData);
  };

  return (
    <LendContext.Provider
      value={{
        lendOffers,
        setLendOffers,
        openOffers,
        canceledOffers,

        lendContracts,
        activeContracts,
        repaidContracts,

        setLendContracts,

        lendStatistic,
        setLendStatistic,

        selectedTypeDisplayOffer,
        setSelectedTypeDisplayOffer,

        selectedTypeDisplayLendContract,
        setSelectedTypeDisplayLendContract,

        handleGetLendList,
        handleGetContractList,
        handleGetDataStatistic,
      }}
    >
      {children}
    </LendContext.Provider>
  );
};

interface LendProviderProps {
  children: React.ReactNode;
}

const INIT_LEND_OFFERS = {
  pageData: [] as OpenLendOfferViewInterface[],
  pagination: {
    total: 0,
    pageNum: 1,
  },
};
const INIT_LEND_CONTRACTS = {
  pageData: [] as LendContractViewInterface[],
  pagination: {
    total: 0,
    pageNum: 1,
  },
};

export enum StatusDisplayOfferEnum {
  ALL = '',
  OPEN_OFFER = 'OPEN_OFFER',
  CANCELED_OFFER = 'CANCELED_OFFER',
}

export enum StatusDisplayLendContractEnum {
  ALL = 'ALL',
  ACTIVE_CONTRACT = 'ACTIVE_CONTRACT',
  REPAID_CONTRACT = 'REPAID_CONTRACT',
}

export const getStatusOfferParams = (type: StatusDisplayOfferEnum) => {
  switch (type) {
    case StatusDisplayOfferEnum.OPEN_OFFER:
      return LendOfferStatus.CREATED;
    case StatusDisplayOfferEnum.CANCELED_OFFER:
      return LendOfferStatus.CANCELLED;
    default:
      return undefined;
  }
};

export const getStatusLendContractParams = (
  type: StatusDisplayLendContractEnum,
) => {
  switch (type) {
    case StatusDisplayLendContractEnum.ACTIVE_CONTRACT:
      return Object.values(LoanStatus).filter(
        (item) => item !== LoanStatus.FINISHED,
      );
    case StatusDisplayLendContractEnum.REPAID_CONTRACT:
      return [LoanStatus.FINISHED];
    default:
      return undefined;
  }
};
