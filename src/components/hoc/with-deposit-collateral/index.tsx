'use client';

import React, { useEffect } from 'react';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  DepositCollateralTransactionInterface,
} from '@/models';

import {
  useAppContext,
  useAuthContext,
  useHomeContext,
  useLoanContext,
} from '@/context';

import { CommonTransactionToast } from '@/components/common';

import useDepositCollateral from '@/hooks/loan-hooks/useDepositCollateral';

const withDepositCollateralController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithDepositCollateralComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleDepositCollateral,
      handleGetDepositCollateralStatus,
    } = useDepositCollateral();

    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();

    const { handleGetLoanContract, selectedTypeDisplayLoanContract } =
      useLoanContext();
    const { handleGetBalancesByChain } = useHomeContext();

    const handleStartDepositCollateral = async (
      data: DepositCollateralTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleDepositCollateral(selectedChain, data);
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetDepositCollateralStatus(selectedChain, hash);
    };

    const handleResetData = () => {
      handleReset();
      handleGetLoanContract(
        { walletAddress: connectedChainAddress },
        selectedTypeDisplayLoanContract,
      );
    };

    useEffect(() => {
      if (
        !transactionHash ||
        transactionStatus !== BlockchainTransactionStatusEnum.LOADING
      )
        return;

      const getStatusInterval = setInterval(async () => {
        handleGetTxStatus(transactionHash);
      }, 5000);

      return () => {
        clearInterval(getStatusInterval);
      };
    }, [transactionHash, transactionStatus]);

    useEffect(() => {
      if (transactionStatus === BlockchainTransactionStatusEnum.SUCCESS) {
        const timeoutRecall = setTimeout(() => {
          handleGetBalancesByChain(selectedChain, connectedChainAddress);
        }, 3000);

        return () => {
          clearTimeout(timeoutRecall);
        };
      }
    }, [transactionStatus, selectedChain, connectedChainAddress]);

    return (
      <>
        <StarterComponent
          depositProps={{
            txHash: transactionHash,
            txStatus: transactionStatus,
            onResetData: handleResetData,
            txErrorMessage: transactionError,
            onDepositCollateral: handleStartDepositCollateral,
          }}
          {...props}
        />

        <CommonTransactionToast
          chain={selectedChain}
          status={transactionStatus}
          transactionHash={transactionHash}
        />
      </>
    );
  };

  return WithDepositCollateralComponent;
};

export default withDepositCollateralController;

export interface WithDepositCollateralComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onDepositCollateral: (data: DepositCollateralTransactionInterface) => void;
}
