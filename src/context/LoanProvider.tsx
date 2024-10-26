'use client';

import React, { useContext, useEffect, useState } from 'react';

import {
  LoanContractViewInterface,
  TotalCardInfoValueViewInterface,
} from '@/models/loan.model';

import { CommonUtils } from '@/utils';
import { useAppContext } from './AppProvider';
import {
  LoanStatus,
  DataListInterface,
  LoanContextInterface,
  GetListLendContractParams,
} from '@/models';
import { getLoanContractsHealthRation } from './helper';

import useLoanHooks from '@/hooks/loan-hooks';
import { AppConstant } from '@/const';

const INITIAL_STATE = {} as LoanContextInterface;

const LoanContext = React.createContext(INITIAL_STATE);

export const useLoanContext = () => useContext(LoanContext);

export const LoanProvider: React.FC<LoanProviderProps> = ({ children }) => {
  const { selectedChainTokensPriceFeed, selectedChain, availableAssets } =
    useAppContext();
  const { handleGetLoanDashboard, handleGetLoanContractListByAddress } =
    useLoanHooks();

  const [totalValueCardInfo, setTotalValueCardInfo] = useState(
    {} as TotalCardInfoValueViewInterface,
  );

  const [loanContractData, setLoanContractData] =
    useState<DataListInterface<LoanContractViewInterface[]>>(
      INIT_LOAN_CONTRACT,
    );

  const [activeLoanContract, setActiveLoanContract] =
    useState<DataListInterface<LoanContractViewInterface[]>>(
      INIT_LOAN_CONTRACT,
    );
  const [repaidLoanContract, setRepaidLoanContract] =
    useState<DataListInterface<LoanContractViewInterface[]>>(
      INIT_LOAN_CONTRACT,
    );
  const [liquidatedLoanContract, setLiquidatedLoanContract] =
    useState<DataListInterface<LoanContractViewInterface[]>>(
      INIT_LOAN_CONTRACT,
    );

  const [selectedTypeDisplayLoanContract, setSelectedTypeDisplayLoanContract] =
    useState(StatusDisplayLoanContractEnum.ACTIVE_CONTRACT);

  const handleGetLoanContract = async (
    params: GetListLendContractParams,
    selectedType: StatusDisplayLoanContractEnum,
  ) => {
    if (!params.walletAddress) return;

    const cloneParams = {
      ...params,
      network: selectedChain,
      isLiquidated:
        selectedType === StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT
          ? true
          : false,
      statuses: getStatusLoanContractParams(selectedType),
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || AppConstant.SIZE_PAGINATION_DEFAULT,
    };

    const responseData = await handleGetLoanContractListByAddress(
      cloneParams,
      availableAssets,
    );

    if (selectedType === StatusDisplayLoanContractEnum.ACTIVE_CONTRACT) {
      setActiveLoanContract(responseData);
    } else if (selectedType === StatusDisplayLoanContractEnum.REPAID_CONTRACT) {
      setRepaidLoanContract(responseData);
    } else if (
      selectedType === StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT
    ) {
      setLiquidatedLoanContract(responseData);
    } else {
      setLoanContractData(responseData);
    }
  };

  const handleCalculateContractHealthRatio = () => {
    if (!selectedChainTokensPriceFeed.size || !loanContractData.pageData.length)
      return;

    if (
      selectedTypeDisplayLoanContract ===
        StatusDisplayLoanContractEnum.ACTIVE_CONTRACT &&
      activeLoanContract.pageData.length > 0
    ) {
      const data = getLoanContractsHealthRation(
        selectedChainTokensPriceFeed,
        activeLoanContract,
      );

      const isEqual = CommonUtils.deepEqual(activeLoanContract, data);

      if (isEqual || !data.pageData.length) return;

      setActiveLoanContract(data);
      return;
    }

    if (
      selectedTypeDisplayLoanContract ===
        StatusDisplayLoanContractEnum.REPAID_CONTRACT &&
      repaidLoanContract.pageData.length > 0
    ) {
      const data = getLoanContractsHealthRation(
        selectedChainTokensPriceFeed,
        repaidLoanContract,
      );

      const isEqual = CommonUtils.deepEqual(repaidLoanContract, data);

      if (isEqual || !data.pageData.length) return;

      setRepaidLoanContract(data);
      return;
    }

    if (
      selectedTypeDisplayLoanContract ===
        StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT &&
      liquidatedLoanContract.pageData.length > 0
    ) {
      const data = getLoanContractsHealthRation(
        selectedChainTokensPriceFeed,
        liquidatedLoanContract,
      );

      const isEqual = CommonUtils.deepEqual(liquidatedLoanContract, data);

      if (isEqual || !data.pageData.length) return;

      setLiquidatedLoanContract(data);
      return;
    }

    const data = getLoanContractsHealthRation(
      selectedChainTokensPriceFeed,
      loanContractData,
    );

    const isEqual = CommonUtils.deepEqual(loanContractData, data);

    if (isEqual || !data.pageData.length) return;

    setLoanContractData(data);
  };

  const handleGetTotalValueCardInfo = async () => {
    const responseData = await handleGetLoanDashboard(selectedChain);

    setTotalValueCardInfo(responseData);
  };

  useEffect(() => {
    if (!selectedChainTokensPriceFeed.size) return;

    handleCalculateContractHealthRatio();
  }, [
    loanContractData,
    activeLoanContract,
    repaidLoanContract,
    liquidatedLoanContract,
    selectedChainTokensPriceFeed,
  ]);

  return (
    <LoanContext.Provider
      value={{
        totalValueCardInfo,
        setTotalValueCardInfo,

        loanContractData,
        activeLoanContract,
        repaidLoanContract,
        liquidatedLoanContract,
        setLoanContractData,

        selectedTypeDisplayLoanContract,
        setSelectedTypeDisplayLoanContract,

        handleGetLoanContract,
        handleGetTotalValueCardInfo,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

interface LoanProviderProps {
  children: React.ReactNode;
}

const INIT_LOAN_CONTRACT = {
  pageData: [] as LoanContractViewInterface[],
  pagination: {
    total: 0,
    pageNum: 1,
  },
};

export enum StatusDisplayLoanContractEnum {
  ALL = 'ALL',
  ACTIVE_CONTRACT = 'ACTIVE_CONTRACT',
  REPAID_CONTRACT = 'REPAID_CONTRACT',
  LIQUIDATED_CONTRACT = 'LIQUIDATED_CONTRACT',
}

export const getStatusLoanContractParams = (
  type: StatusDisplayLoanContractEnum,
) => {
  switch (type) {
    case StatusDisplayLoanContractEnum.ACTIVE_CONTRACT:
      return [LoanStatus.FUND_TRANSFERRED, LoanStatus.MATCHED];
    case StatusDisplayLoanContractEnum.REPAID_CONTRACT:
      return [LoanStatus.BORROWER_PAID, LoanStatus.FINISHED];
    case StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT:
      return [
        LoanStatus.LIQUIDATED,
        LoanStatus.LIQUIDATING,
        LoanStatus.FINISHED,
      ];
    default:
      return undefined;
  }
};
