'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  CreateLendTransactionInterface,
} from '@/models';

import {
  useAppContext,
  useAuthContext,
  useHomeContext,
  useLendContext,
} from '@/context';
import { CommonTransactionToast } from '@/components/common';

import useCreateLendOffer from '@/hooks/lend-hooks/useCreateLendOffer';
import { StatusDisplayOfferEnum } from '@/context/LendProvider';

const withCreateLendOfferController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithCreateLendOfferComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleCreateLendOffer,
      handleGetCreateLendStatus,
    } = useCreateLendOffer();

    const { selectedChain } = useAppContext();
    const { connectedChainAddress } = useAuthContext();
    const { handleGetBalancesByChain } = useHomeContext();
    const {
      handleGetLendList,
      handleGetDataStatistic,
      setSelectedTypeDisplayOffer,
    } = useLendContext();

    const handleStartCreateLendOffer = async (
      data: CreateLendTransactionInterface,
    ) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleCreateLendOffer(selectedChain, data);
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetCreateLendStatus(selectedChain, hash);
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
      if (transactionStatus === BlockchainTransactionStatusEnum.SUCCESS) {
        const timeoutRecall = setTimeout(() => {
          handleGetBalancesByChain(selectedChain, connectedChainAddress);
        }, 3000);

        return () => {
          clearTimeout(timeoutRecall);
        };
      }
    }, [transactionStatus, selectedChain, connectedChainAddress]);

    useEffect(() => {
      if (
        transactionStatus === BlockchainTransactionStatusEnum.SUCCESS &&
        connectedChainAddress
      ) {
        handleGetLendList(
          { walletAddress: connectedChainAddress },
          StatusDisplayOfferEnum.OPEN_OFFER,
        );
        setSelectedTypeDisplayOffer(StatusDisplayOfferEnum.OPEN_OFFER);
        handleGetDataStatistic();
      }
    }, [connectedChainAddress, transactionStatus]);

    return (
      <>
        <StarterComponent
          txHash={transactionHash}
          txStatus={transactionStatus}
          onResetData={handleResetData}
          txErrorMessage={transactionError}
          onCreateLendOffer={handleStartCreateLendOffer}
          {...props}
        />

        {transactionHash &&
          ReactDOM.createPortal(
            <CommonTransactionToast
              chain={selectedChain}
              status={transactionStatus}
              transactionHash={transactionHash}
            />,
            document.body,
          )}
      </>
    );
  };

  return WithCreateLendOfferComponent;
};

export default withCreateLendOfferController;

export interface WithCreateLendOfferComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onCreateLendOffer: (data: CreateLendTransactionInterface) => void;
}
