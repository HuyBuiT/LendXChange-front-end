'use client';

import { LendingService } from '@/services';
import { BorrowTransactionInterface, SupportedChainEnum } from '@/models';

import useTransaction from '../blockchain-hooks';

const useCreateBorrow = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleCreateBorrow = async (
    chain: SupportedChainEnum,
    data: BorrowTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const borrowTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createBorrowTransaction(data);

    if (!borrowTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      borrowTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetBorrowStatus = async (
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
    handleCreateBorrow,
    handleGetBorrowStatus,
  };
};

export default useCreateBorrow;
