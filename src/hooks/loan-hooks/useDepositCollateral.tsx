import {
  SupportedChainEnum,
  DepositCollateralTransactionInterface,
} from '@/models';
import { LendingService } from '@/services';

import useTransaction from '../blockchain-hooks';

const useDepositCollateral = () => {
  const {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  } = useTransaction();

  const handleDepositCollateral = async (
    chain: SupportedChainEnum,
    data: DepositCollateralTransactionInterface,
  ) => {
    const { walletAddress } = data;

    const depositCollateralTransaction =
      await LendingService.getLendingServiceByChain(
        chain,
      )?.createDepositCollateralTransaction(data);

    if (!depositCollateralTransaction) return '';

    const txHash = await handleSendTransaction(
      chain,
      depositCollateralTransaction,
      walletAddress,
    );

    return txHash;
  };

  const handleGetDepositCollateralStatus = async (
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
    handleDepositCollateral,
    handleGetDepositCollateralStatus,
  };
};

export default useDepositCollateral;
