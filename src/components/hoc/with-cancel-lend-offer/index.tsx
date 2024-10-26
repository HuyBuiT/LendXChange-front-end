'use client';

import React, { useEffect } from 'react';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  CancelLendTransactionInterface,
} from '@/models';

import {
  useAppContext,
  useLendContext,
  useAuthContext,
  useHomeContext,
} from '@/context';

import { CommonTransactionToast } from '@/components/common';

import useCancelLendOffer from '@/hooks/lend-hooks/useCancelLendOffer';

const withCancelLendOfferController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithCancelLendOfferComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleCancelLendOffer,
      handleGetCancelLendStatus,
    } = useCancelLendOffer();

    const { selectedChain, accountInfo } = useAppContext();
    const {
      selectedTypeDisplayOffer,
      handleGetLendList,
      handleGetDataStatistic,
    } = useLendContext();
    const { handleGetBalancesByChain } = useHomeContext();
    const { connectedChainAddress } = useAuthContext();

    const handleStartCancelLendOffer = async (
      data: CancelLendTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleCancelLendOffer(selectedChain, data);
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetCancelLendStatus(selectedChain, hash);
    };

    const handleResetData = () => {
      handleReset();
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
        connectedChainAddress &&
        !accountInfo.showFeedbackOnCancel
      ) {
        const timeoutRecall = setTimeout(() => {
          handleGetBalancesByChain(selectedChain, connectedChainAddress);
          handleGetDataStatistic();
          handleGetLendList(
            { walletAddress: connectedChainAddress },
            selectedTypeDisplayOffer,
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
          onCancelLendOffer={handleStartCancelLendOffer}
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

  return WithCancelLendOfferComponent;
};

export default withCancelLendOfferController;

export interface WithCancelLendOfferComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onCancelLendOffer: (data: CancelLendTransactionInterface) => void;
}
