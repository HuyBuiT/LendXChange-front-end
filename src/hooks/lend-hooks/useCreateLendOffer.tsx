import { LendingService } from '@/services';
import { CreateLendTransactionInterface, SupportedChainEnum } from '@/models';

import useTransaction from '../blockchain-hooks';

const useCreateLendOffer = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleCreateLendOffer = async (
    chain: SupportedChainEnum,
    data: CreateLendTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const createLendTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createLendTransaction(data);

    if (!createLendTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      createLendTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetCreateLendStatus = async (
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
    handleCreateLendOffer,
    handleGetCreateLendStatus,
  };
};

export default useCreateLendOffer;
