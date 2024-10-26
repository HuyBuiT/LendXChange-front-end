'use client';
import React, { useEffect } from 'react';

import {
  StatusDisplayOfferEnum,
  StatusDisplayLendContractEnum,
} from '@/context/LendProvider';

import { twJoin } from 'tailwind-merge';
import { redirect } from 'next/navigation';
import { AppConstant, PathConstant } from '@/const';
import { LendContent, LendHeader } from '@/components/sn-lend';
import { useAppContext, useAuthContext, useLendContext } from '@/context';

import Cookies from 'js-cookie';

const Lend = () => {
  const cookieToken = Cookies.get(AppConstant.KEY_TOKEN);
  const { selectedChain, availableAssets } = useAppContext();
  const { handleGetDataStatistic, handleGetLendList, handleGetContractList } =
    useLendContext();
  const { isWalletConnected, setIsOpenConnectDialog, connectedChainAddress } =
    useAuthContext();

  useEffect(() => {
    if (!cookieToken) {
      if (!isWalletConnected) {
        setIsOpenConnectDialog(true);
      }

      redirect(PathConstant.ROOT);
    }
  }, [cookieToken, isWalletConnected]);

  useEffect(() => {
    if (!connectedChainAddress || !selectedChain) return;
    handleGetDataStatistic();
  }, [connectedChainAddress, selectedChain]);

  useEffect(() => {
    if (!connectedChainAddress) return;
    // open offer
    handleGetLendList(
      { walletAddress: connectedChainAddress },
      StatusDisplayOfferEnum.OPEN_OFFER,
    );
    handleGetLendList(
      { walletAddress: connectedChainAddress },
      StatusDisplayOfferEnum.CANCELED_OFFER,
    );

    handleGetLendList(
      { walletAddress: connectedChainAddress },
      StatusDisplayOfferEnum.ALL,
    );

    // lend contract
    handleGetContractList(
      { walletAddress: connectedChainAddress },
      StatusDisplayLendContractEnum.ACTIVE_CONTRACT,
    );
    handleGetContractList(
      { walletAddress: connectedChainAddress },
      StatusDisplayLendContractEnum.REPAID_CONTRACT,
    );

    handleGetContractList(
      { walletAddress: connectedChainAddress },
      StatusDisplayLendContractEnum.ALL,
    );
  }, [connectedChainAddress, availableAssets]);

  return (
    <div className={twJoin('w-full', 'flex flex-col gap-y-6 sm:gap-y-8')}>
      <LendHeader />
      <LendContent />
    </div>
  );
};

export default Lend;
