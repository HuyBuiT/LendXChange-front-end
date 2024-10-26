'use client';
import React, { useEffect } from 'react';

import { redirect } from 'next/navigation';
import { AppConstant, PathConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { LoanHeader, LoanContent } from '@/components/sn-loan';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';
import { useAppContext, useAuthContext, useLoanContext } from '@/context';

import Cookies from 'js-cookie';

const Loan = () => {
  const cookieToken = Cookies.get(AppConstant.KEY_TOKEN);
  const { windowWidth } = useWindowSize();
  const { selectedChain, availableAssets } = useAppContext();
  const { handleGetLoanContract, handleGetTotalValueCardInfo } =
    useLoanContext();
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
    handleGetTotalValueCardInfo();
  }, [connectedChainAddress, selectedChain]);

  useEffect(() => {
    if (!connectedChainAddress) return;

    handleGetLoanContract(
      { walletAddress: connectedChainAddress },
      StatusDisplayLoanContractEnum.ACTIVE_CONTRACT,
    );
    handleGetLoanContract(
      { walletAddress: connectedChainAddress },
      StatusDisplayLoanContractEnum.REPAID_CONTRACT,
    );
    handleGetLoanContract(
      { walletAddress: connectedChainAddress },
      StatusDisplayLoanContractEnum.LIQUIDATED_CONTRACT,
    );

    handleGetLoanContract(
      { walletAddress: connectedChainAddress },
      StatusDisplayLoanContractEnum.ALL,
    );
  }, [connectedChainAddress, windowWidth, availableAssets]);

  return (
    <div className={'w-full'}>
      <LoanHeader />
      <LoanContent />
    </div>
  );
};

export default Loan;
