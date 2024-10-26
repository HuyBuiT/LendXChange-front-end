'use client';

import React, { useEffect } from 'react';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  WithdrawCollateralTransactionInterface,
} from '@/models';

import {
  useAppContext,
  useAuthContext,
  useHomeContext,
  useLoanContext,
} from '@/context';

import { CommonTransactionToast } from '@/components/common';

import useWithdrawCollateral from '@/hooks/loan-hooks/useWithdrawCollateral';

const withWithdrawCollateralController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithWithdrawCollateralComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleWithdrawCollateralContract,
      handleGetWithdrawCollateralStatus,
    } = useWithdrawCollateral();

    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();

    const { handleGetBalancesByChain } = useHomeContext();
    const { selectedTypeDisplayLoanContract, handleGetLoanContract } =
      useLoanContext();

    const handleWithdrawCollateral = async (
      data: WithdrawCollateralTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleWithdrawCollateralContract(selectedChain, data);
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetWithdrawCollateralStatus(selectedChain, hash);
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
          withdrawProps={{
            txHash: transactionHash,
            txStatus: transactionStatus,
            onResetData: handleResetData,
            txErrorMessage: transactionError,
            onWithdrawCollateral: handleWithdrawCollateral,
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

  return WithWithdrawCollateralComponent;
};

export default withWithdrawCollateralController;

export interface WithWithdrawCollateralComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onWithdrawCollateral: (data: WithdrawCollateralTransactionInterface) => void;
}
