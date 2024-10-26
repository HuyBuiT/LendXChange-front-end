import {
  SupportedChainEnum,
  WithdrawCollateralTransactionInterface,
} from '@/models';
import { LendingService } from '@/services';

import useTransaction from '../blockchain-hooks';

const useWithdrawCollateral = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleWithdrawCollateralContract = async (
    chain: SupportedChainEnum,
    data: WithdrawCollateralTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const withdrawTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createWithdrawCollateralTransaction(data);

    if (!withdrawTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      withdrawTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetWithdrawCollateralStatus = async (
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
    handleWithdrawCollateralContract,
    handleGetWithdrawCollateralStatus,
  };
};

export default useWithdrawCollateral;
