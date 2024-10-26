'use client';

import React, { useEffect } from 'react';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  RepayLoanOfferTransactionInterface,
} from '@/models';

import {
  useAppContext,
  useLoanContext,
  useAuthContext,
  useHomeContext,
} from '@/context';

import { CommonTransactionToast } from '@/components/common';

import useRepayContract from '@/hooks/loan-hooks/useRepayContract';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';

const withRepayContractController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithRepayContractComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleRepayContract,
      handleGetRepayContractStatus,
    } = useRepayContract();

    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();
    const { handleGetBalancesByChain } = useHomeContext();
    const {
      handleGetLoanContract,
      handleGetTotalValueCardInfo,
      setSelectedTypeDisplayLoanContract,
    } = useLoanContext();

    const handleStartRepay = async (
      data: RepayLoanOfferTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleRepayContract(selectedChain, data);
    };

    const handleResetData = () => {
      handleReset();
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetRepayContractStatus(selectedChain, hash);
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
      if (
        transactionStatus === BlockchainTransactionStatusEnum.SUCCESS &&
        connectedChainAddress
      ) {
        const timeoutRecall = setTimeout(() => {
          handleGetBalancesByChain(selectedChain, connectedChainAddress);
          handleGetTotalValueCardInfo();
          handleGetLoanContract(
            { walletAddress: connectedChainAddress },
            StatusDisplayLoanContractEnum.REPAID_CONTRACT,
          );
          setSelectedTypeDisplayLoanContract(
            StatusDisplayLoanContractEnum.REPAID_CONTRACT,
          );
        }, 3000);

        return () => {
          clearTimeout(timeoutRecall);
        };
      }
    }, [transactionStatus, connectedChainAddress, selectedChain]);

    return (
      <>
        <StarterComponent
          txHash={transactionHash}
          txStatus={transactionStatus}
          onResetData={handleResetData}
          txErrorMessage={transactionError}
          onRepayContract={handleStartRepay}
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

  return WithRepayContractComponent;
};

export default withRepayContractController;

export interface WithRepayContractComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onRepayContract: (data: RepayLoanOfferTransactionInterface) => void;
}
