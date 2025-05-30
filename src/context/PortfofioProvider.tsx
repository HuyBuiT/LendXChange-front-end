'use client';

import React, { useContext, useState } from 'react';

import { CommonUtils } from '@/utils';
import { useAppContext } from './AppProvider';
import { useDeepCompareMemo } from 'use-deep-compare';
import { SupportedChainEnum } from '@/models/app.model';


import usePortfolioHooks from '@/hooks/portfolio-hooks';
import { SuppliedAssetInterface, LoanBorrowedInterface, SystemStatisticInterface } from '@/models/home.model';
import { PortfolioContextInterface } from '@/models/context.model';

const INITIAL_STATE = {} as PortfolioContextInterface;

const PortfolioContext = React.createContext(INITIAL_STATE);

export const usePortfolioContext = () => useContext(PortfolioContext);

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({
  children,
}) => {
  const { selectedChainTokensPriceFeed} = useAppContext();

  const {
    handleGetLoanBorrowed,
    handleGetSuppliedAsset,
    handleGetSystemLoanBorrowed,
    handleGetSystemSuppliedAsset,
    handleGetSystemStatistic,
  } = usePortfolioHooks();

  const [suppliedAssetData, setSuppliedAssetData] =
    useState< SuppliedAssetInterface>();
  const [loanBorrowedData, setLoanBorrowedData] =
    useState< LoanBorrowedInterface[]>();

    const [systemSuppliedAssetData, setSystemSuppliedAssetData] =
    useState< SuppliedAssetInterface>();
  const [systemLoanBorrowedData, setSystemLoanBorrowedData] =
    useState< LoanBorrowedInterface[]>();
  
  const [systemStatisticData, setSystemStatisticData] =
    useState<SystemStatisticInterface>();

  const { totalSupplyAsset, earnFromSuppliedAsset } = useDeepCompareMemo(() => {
    let totalSupplyAsset = 0;
    let earnFromSuppliedAsset = 0;

      const lendSuppliedData = suppliedAssetData?.lendSupplied;
      const lendSupplyItem =
        lendSuppliedData?.reduce(
          (sum, current) => sum + current.lendSuppliedValue,
          0,
        ) || 0;

      const collateralSuppliedData =
        suppliedAssetData?.collateralSupplied;
      const collateralSupplyItem =
        collateralSuppliedData?.reduce(
          (sum, current) => sum + current.collateralSuppliedValue,
          0,
        ) || 0;

      const interestEarnedItem =
        lendSuppliedData?.reduce(
          (sum, current) => sum + current.interestEarnedValue,
          0,
        ) || 0;

      totalSupplyAsset += lendSupplyItem;
      totalSupplyAsset += collateralSupplyItem;
      earnFromSuppliedAsset += interestEarnedItem;

    return { totalSupplyAsset, earnFromSuppliedAsset };
  }, [suppliedAssetData]);

  const { systemTotalSupplyAsset, systemEarnFromSuppliedAsset } = useDeepCompareMemo(() => {
    let systemTotalSupplyAsset = 0;
    let systemEarnFromSuppliedAsset = 0;

      const lendSuppliedData = systemSuppliedAssetData?.lendSupplied;
      const lendSupplyItem =
        lendSuppliedData?.reduce(
          (sum, current) => sum + current.lendSuppliedValue,
          0,
        ) || 0;

      const collateralSuppliedData =
      systemSuppliedAssetData?.collateralSupplied;
      const collateralSupplyItem =
        collateralSuppliedData?.reduce(
          (sum, current) => sum + current.collateralSuppliedValue,
          0,
        ) || 0;

      const interestEarnedItem =
        lendSuppliedData?.reduce(
          (sum, current) => sum + current.interestEarnedValue,
          0,
        ) || 0;

        systemTotalSupplyAsset += lendSupplyItem;
      systemTotalSupplyAsset += collateralSupplyItem;
      systemEarnFromSuppliedAsset += interestEarnedItem;

    return { systemTotalSupplyAsset, systemEarnFromSuppliedAsset };
  }, [systemSuppliedAssetData]);

  const handleGetSuppliedAssets = async () => {
    const { accessToken } = CommonUtils.getAccessToken();
    if (!accessToken ) return;
    const res = await handleGetSuppliedAsset(accessToken);
    setSuppliedAssetData(res);
  };

  const handleGetLoansBorrowed = async (chain?: SupportedChainEnum) => {

    const { accessToken } = CommonUtils.getAccessToken();
    if (!accessToken) return;
    const res = await handleGetLoanBorrowed(accessToken);
    setLoanBorrowedData(res);
  };

  const handleGetSystemSuppliedAssets = async () => {
    const { accessToken } = CommonUtils.getAccessToken();
    if (!accessToken ) return;
    const res = await handleGetSystemSuppliedAsset(accessToken);
    setSystemSuppliedAssetData(res);
  };

  const handleGetSystemLoansBorrowed = async (chain?: SupportedChainEnum) => {

    const { accessToken } = CommonUtils.getAccessToken();
    if (!accessToken) return;
    const res = await handleGetSystemLoanBorrowed(accessToken);
    setSystemLoanBorrowedData(res);
  };

  const handleGetSystemStatistics = async () => {
    const { accessToken } = CommonUtils.getAccessToken();
    if (!accessToken) return;
    const res = await handleGetSystemStatistic(accessToken);
    setSystemStatisticData(res);
  };

  return (
    <PortfolioContext.Provider
      value={{
        loanBorrowedData,
        handleGetLoansBorrowed,
        suppliedAssetData,
        handleGetSuppliedAssets,

        totalSupplyAsset,
        earnFromSuppliedAsset,

        systemLoanBorrowedData,
        handleGetSystemLoansBorrowed,
        systemSuppliedAssetData,
        handleGetSystemSuppliedAssets,

        systemStatisticData,
        handleGetSystemStatistics,

        systemTotalSupplyAsset,
        systemEarnFromSuppliedAsset,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

interface PortfolioProviderProps {
  children: React.ReactNode;
}