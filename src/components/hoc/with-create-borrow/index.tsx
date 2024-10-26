'use client';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
  HOCControllerInterface,
  BlockchainTransactionStatusEnum,
  BorrowTransactionInterface,
} from '@/models';

import { CommonTransactionToast } from '@/components/common';
import {
  useAppContext,
  useAuthContext,
  useHomeContext,
  useLoanContext,
} from '@/context';

import useCreateBorrow from '@/hooks/home-hooks/useCreateBorrow';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';

const withCreateBorrowController = (
  StarterComponent: HOCControllerInterface,
) => {
  const WithCreateBorrowComponent = (props: any) => {
    const {
      transactionHash,
      transactionError,
      transactionStatus,

      handleReset,
      handleCreateBorrow,
      handleGetBorrowStatus,
    } = useCreateBorrow();

    const { selectedChain } = useAppContext();
    const { handleGetTemplates, handleGetBalancesByChain } = useHomeContext();
    const { connectedChainAddress } = useAuthContext();
    const {
      handleGetLoanContract,
      handleGetTotalValueCardInfo,
      setSelectedTypeDisplayLoanContract,
    } = useLoanContext();

    const handleStartBorrow = async (data: BorrowTransactionInterface) => {
      const { walletAddress } = data;

      if (!walletAddress) return '';

      await handleCreateBorrow(selectedChain, data);
    };

    const handleGetTxStatus = async (hash: string) => {
      if (!hash) return;

      await handleGetBorrowStatus(selectedChain, hash);
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
        handleGetLoanContract(
          { walletAddress: connectedChainAddress },
          StatusDisplayLoanContractEnum.ACTIVE_CONTRACT,
        );
        setSelectedTypeDisplayLoanContract(
          StatusDisplayLoanContractEnum.ACTIVE_CONTRACT,
        );
        handleGetTotalValueCardInfo();
        handleGetTemplates(selectedChain);
      }
    }, [connectedChainAddress, transactionStatus, selectedChain]);

    return (
      <>
        <StarterComponent
          txHash={transactionHash}
          txStatus={transactionStatus}
          txErrorMessage={transactionError}
          onBorrow={handleStartBorrow}
          onResetData={handleResetData}
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
  return WithCreateBorrowComponent;
};

export default withCreateBorrowController;

export interface WithCreateBorrowComponentProps {
  txHash: string;
  txErrorMessage: string;
  txStatus: BlockchainTransactionStatusEnum;

  onResetData: () => void;
  onBorrow: (data: BorrowTransactionInterface) => void;
}
