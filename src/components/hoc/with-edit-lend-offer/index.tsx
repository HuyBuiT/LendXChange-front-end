'use client';

import React, { useEffect } from 'react';

import {
  HOCControllerInterface,
  EditLendTransactionInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  useAppContext,
  useHomeContext,
  useAuthContext,
  useLendContext,
} from '@/context';

import { CommonTransactionToast } from '@/components/common';

import useEditLendOffer from '@/hooks/lend-hooks/useEditLendOffer';

const withEditLendOfferController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithEditLendOfferComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleEditLendOffer,
      handleGetEditLendStatus,
    } = useEditLendOffer();

    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();
    const { handleGetBalancesByChain } = useHomeContext();
    const { selectedTypeDisplayOffer, handleGetLendList } = useLendContext();

    const handleStartEditLendOffer = async (
      data: EditLendTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleEditLendOffer(selectedChain, data);
    };

    const handleResetData = () => {
      handleReset();
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetEditLendStatus(selectedChain, hash);
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
          onEditLendOffer={handleStartEditLendOffer}
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
  return WithEditLendOfferComponent;
};

export default withEditLendOfferController;

export interface WithEditLendOfferComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onEditLendOffer: (data: EditLendTransactionInterface) => void;
}
