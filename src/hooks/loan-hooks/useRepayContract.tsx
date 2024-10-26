import {
  SupportedChainEnum,
  RepayLoanOfferTransactionInterface,
} from '@/models';
import { LendingService } from '@/services';

import useTransaction from '../blockchain-hooks';

const useRepayContract = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleRepayContract = async (
    chain: SupportedChainEnum,
    data: RepayLoanOfferTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const repayContractTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createRepayLoanOfferTransaction(data);

    if (!repayContractTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      repayContractTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetRepayContractStatus = async (
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
    handleRepayContract,
    handleGetRepayContractStatus,
  };
};

export default useRepayContract;
