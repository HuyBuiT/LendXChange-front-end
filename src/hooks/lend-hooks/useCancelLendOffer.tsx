import { LendingService } from '@/services';
import { CancelLendTransactionInterface, SupportedChainEnum } from '@/models';

import useTransaction from '../blockchain-hooks';

const useCancelLendOffer = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleCancelLendOffer = async (
    chain: SupportedChainEnum,
    data: CancelLendTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const cancelLendTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createCancelLendTransaction(data);

    if (!cancelLendTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      cancelLendTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetCancelLendStatus = async (
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
    handleCancelLendOffer,
    handleGetCancelLendStatus,
  };
};

export default useCancelLendOffer;
