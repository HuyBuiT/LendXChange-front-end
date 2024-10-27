'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  SolanaWalletsEnum,
  SupportedChainEnum,
  AppContextInterface,
  AccountInfoInterface,
} from '@/models';
import { useAppService } from '@/hooks/service-hooks';
import { AppConstant } from '@/const';
import '@/language';
import {
  Asset,
  SupportTokenType,
  SolanaSupportedTokenEnum,
} from '@/models/app.model';
import { useSearchParams } from 'next/navigation';
import { handleRefactorListCampaignRes } from './helper';

const INITIAL_STATE = {} as AppContextInterface;

const AppContext = React.createContext(INITIAL_STATE);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  campaignData,
}) => {
  const searchParam = useSearchParams();
  const { handleGetTokensPriceFeed, getAssets } = useAppService();

  const [selectedWallet, setSelectedWallet] = useState<SolanaWalletsEnum>(
    SolanaWalletsEnum.Phantom,
  );

  const [selectedChain, setSelectedChain] = useState<SupportedChainEnum>(
    localStorage.getItem(AppConstant.KEY_CHAIN) as SupportedChainEnum,
  );

  // Assets

  const [availableAssets, setAvailableAssets] = useState<
    Map<SupportTokenType, Asset>
  >(new Map());

  // price feed
  const [selectedChainTokensPriceFeed, setSelectedChainTokensPriceFeed] =
    useState(AppConstant.INIT_PRICE_FEED);

  const [accountInfo, setAccountInfo] = useState({} as AccountInfoInterface);

  const listCampaignByChain = useMemo(() => {
    const filterByChain = campaignData
      .filter((item) => item.network === selectedChain)
      .map((item) => handleRefactorListCampaignRes(item));

    if (!filterByChain.length) return [];

    return filterByChain.sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    );
  }, [campaignData, selectedChain]);

  const handleGetAssets = async () => {
    const availableAssets = await getAssets({ network: selectedChain });

    const availableAssetsMap = new Map<SolanaSupportedTokenEnum, Asset>();

    availableAssets.forEach((asset) => {
      availableAssetsMap.set(asset.symbol as SolanaSupportedTokenEnum, asset);
    });

    setAvailableAssets(availableAssetsMap);
  };

  const handleGetPriceFeeds = async () => {
    const tokensPriceFeeds = await handleGetTokensPriceFeed(availableAssets);

    setSelectedChainTokensPriceFeed(tokensPriceFeeds);
  };

  useEffect(() => {
    if (!selectedChain) return;
    handleGetAssets();
  }, [selectedChain]);

  useEffect(() => {
    if (!selectedChain) return;
    handleGetPriceFeeds();

    const priceFeedInterval = setInterval(() => {
      handleGetPriceFeeds();
    }, 30000);

    return () => {
      clearInterval(priceFeedInterval);
    };
  }, [availableAssets]);

  useEffect(() => {
    const chainParam = searchParam.get(
      AppConstant.KEY_CHAIN,
    ) as SupportedChainEnum;
    const chain = localStorage.getItem(
      AppConstant.KEY_CHAIN,
    ) as SupportedChainEnum;

    if (chainParam) {
      localStorage.setItem(AppConstant.KEY_CHAIN, chainParam);
      setSelectedChain(chainParam);
    } else if (chain) {
      setSelectedChain(chain);
    } else {
      localStorage.setItem(AppConstant.KEY_CHAIN, SupportedChainEnum.Sui);
      setSelectedChain(SupportedChainEnum.Sui);
    }
  }, [searchParam]);

  return (
    <AppContext.Provider
      value={{
        accountInfo,
        setAccountInfo,

        selectedChain,
        setSelectedChain,

        selectedWallet,
        setSelectedWallet,

        selectedChainTokensPriceFeed,

        handleGetPriceFeeds,

        availableAssets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

interface AppProviderProps {
  children: React.ReactNode;
  campaignData: any[];
}
