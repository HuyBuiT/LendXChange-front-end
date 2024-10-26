'use client';

import React, { useContext, useState, useEffect } from 'react';

import { AppConstant } from '@/const';
import { CommonUtils } from '@/utils';
import { useAppContext } from './AppProvider';
import { useAuthContext } from './AuthProvider';
import { ResGetBalanceTokenType } from '@/services/blockchain-service';

import {
  HomeContextInterface,
  BestOfferListViewInterface,
  ActiveLoanListViewInterface,
} from '@/models';

import {
  SupportTokenType,
  SupportedChainEnum,
  OfferDataDetailViewInterface,
} from '@/models/app.model';

import useHomeHooks from '@/hooks/home-hooks';
import useBalances from '@/hooks/blockchain-hooks/useBalances';

const INITIAL_STATE = {} as HomeContextInterface;

const HomeContext = React.createContext(INITIAL_STATE);

export const useHomeContext = () => useContext(HomeContext);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const { selectedChain, availableAssets } = useAppContext();
  const { isWalletConnected, connectedChainAddress } = useAuthContext();

  const {
    handleCheckHasNft,
    handleCheckHasSuiNft,
    handleGetInterestKamino,
    handleGetOfferTemplates,
    handleGetInterestScallop,
    handleCheckHasSuiNftFromKiosk,
    handleGetBestOffersByTemplates,
    handleGetActiveLoanListByTemplate,
  } = useHomeHooks();

  const { handleGetTokenBalance } = useBalances();

  const [selectedChainTokensBalance, setSelectedChainTokensBalance] = useState<
    Map<SupportTokenType, { balance: number }>
  >(AppConstant.INIT_BALANCES);

  const [isHasNft, setIsHasNft] = useState(false);
  const [offersTemplate, setOfferTemplate] = useState(INIT_OFFERS);
  const [activeLoanList, setActiveLoanList] = useState(INIT_ACTIVE_LOAN_LIST);
  const [bestOfferList, setBestOfferList] = useState(INIT_BEST_OFFER_LIST);
  const [isOpenNoCollaboratorDialog, setIsOpenNoCollaboratorDialog] =
    useState(false);

  const [templateIds, setTemplateIds] = useState([] as string[]);
  const [crossChainAddress, setCrossChainAddress] = useState('');

  const [interestCreateOffer, setInterestCreateOffer] = useState(0);

  const handleGetTemplates = async (selectedChain: SupportedChainEnum) => {
    const data = await handleGetOfferTemplates(selectedChain);

    setOfferTemplate([...data]);
  };

  const handleFilterTemplateIds = () => {
    if (!offersTemplate.length || offersTemplate[0].chain !== selectedChain)
      return;

    const filteredIds = offersTemplate.map((item) => item.id);

    const isEqual = CommonUtils.deepEqual(filteredIds, templateIds);

    if (isEqual) return;

    setTemplateIds(filteredIds);
  };

  const handleGetBestOffersList = async () => {
    if (!templateIds.length || !selectedChain) return;

    const data = await handleGetBestOffersByTemplates(
      templateIds,
      selectedChain,
    );

    setBestOfferList(data);
  };

  const handleGetActiveLoanList = async () => {
    if (!templateIds.length || !selectedChain) return;

    const data = await handleGetActiveLoanListByTemplate(
      templateIds,
      selectedChain,
    );

    setActiveLoanList(data);
  };

  const checkHasSuiNft = async () => {
    let hasNft = false;
    hasNft = await handleCheckHasSuiNft(connectedChainAddress);

    if (!hasNft) {
      hasNft = await handleCheckHasSuiNftFromKiosk(connectedChainAddress);
    }

    return hasNft;
  };

  const handleCheckNft = async () => {
    if (process.env.CHECK_HAS_NFT === 'true') {
      if (selectedChain === SupportedChainEnum.Solana) {
        const res = await handleCheckHasNft(connectedChainAddress);
        setIsHasNft(res);
      } else if (selectedChain === SupportedChainEnum.Sui) {
        const res = await checkHasSuiNft();
        setIsHasNft(res);
      } else {
        setIsHasNft(true);
      }
    } else {
      setIsHasNft(true);
    }
  };

  const handleGetWaitingInterest = async () => {
    if (selectedChain === SupportedChainEnum.Sui) {
      const res = await handleGetInterestScallop();

      setInterestCreateOffer(res);
      return;
    }

    if (selectedChain === SupportedChainEnum.Solana) {
      const res = await handleGetInterestKamino();

      setInterestCreateOffer(res * 100);
      return;
    }

    if (selectedChain === SupportedChainEnum.SuiMovement) {
      setInterestCreateOffer(0);
      return;
    }
  };

  const handleGetBalancesByChain = async (
    chain: SupportedChainEnum,
    address: string,
  ) => {
    if (!chain || !address) return;
    const res = (await handleGetTokenBalance(
      chain,
      address,
      availableAssets,
    )) as ResGetBalanceTokenType;

    setSelectedChainTokensBalance(res);
  };

  useEffect(() => {
    if (!selectedChain) return;
    handleGetTemplates(selectedChain);
    setCrossChainAddress('');
    handleGetWaitingInterest();
  }, [selectedChain]);

  useEffect(() => {
    if (!offersTemplate) return;

    handleFilterTemplateIds();
  }, [offersTemplate]);

  useEffect(() => {
    if (!templateIds.length || !selectedChain) return;

    handleGetBestOffersList();
    handleGetActiveLoanList();
  }, [templateIds, selectedChain]);

  useEffect(() => {
    if (!connectedChainAddress || !isWalletConnected || !selectedChain) return;
    handleCheckNft();
  }, [connectedChainAddress, isWalletConnected]);

  useEffect(() => {
    if (!selectedChain || !connectedChainAddress || !availableAssets) {
      setSelectedChainTokensBalance(AppConstant.INIT_BALANCES);
    }
    handleGetBalancesByChain(selectedChain, connectedChainAddress);
  }, [selectedChain, availableAssets, connectedChainAddress]);

  return (
    <HomeContext.Provider
      value={{
        isHasNft,
        setIsHasNft,

        offersTemplate,
        setOfferTemplate,

        activeLoanList,
        setActiveLoanList,

        bestOfferList,
        setBestOfferList,

        handleGetBalancesByChain,

        interestCreateOffer,
        selectedChainTokensBalance,
        setSelectedChainTokensBalance,

        handleGetTemplates,

        isOpenNoCollaboratorDialog,
        setIsOpenNoCollaboratorDialog,

        crossChainAddress,
        setCrossChainAddress,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

interface HomeProviderProps {
  children: React.ReactNode;
}

const INIT_OFFERS = [] as OfferDataDetailViewInterface[];
const INIT_BEST_OFFER_LIST = [] as BestOfferListViewInterface[];
const INIT_ACTIVE_LOAN_LIST = [] as ActiveLoanListViewInterface[];
