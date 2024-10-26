'use client';

import { LendingService } from '@/services';
import { EditLendTransactionInterface, SupportedChainEnum } from '@/models';

import useTransaction from '../blockchain-hooks';

const useEditLendOffer = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleEditLendOffer = async (
    chain: SupportedChainEnum,
    data: EditLendTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const editLendTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createEditLendTransaction(data);

    if (!editLendTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      editLendTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetEditLendStatus = async (
    chain: SupportedChainEnum,
    txHash: string,
  ) => {
    const status = await handleGetTransactionResult(chain, txHash);

    return status;
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleEditLendOffer,
    handleGetEditLendStatus,
  };
};

export default useEditLendOffer;
