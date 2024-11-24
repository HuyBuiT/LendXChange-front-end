import { useState } from 'react';
import { AppConstant } from '@/const';
import { web3 } from '@project-serum/anchor';
import { useTranslation } from 'react-i18next';
import { AppService, BlockchainService } from '@/services';
import { ResSendTransactionInterface } from '@/services/blockchain-service';
import { BlockchainTransactionStatusEnum, SupportedChainEnum } from '@/models';
import { SolBlockchainService } from '@/services/blockchain-service/sol-blockchain-service';
import { EclipseBlockchainService } from '@/services/blockchain-service/eclipse-blockchain-service';

import useSuiTransaction from './useSuiTransaction';
import useAptosMovementTransaction from './useAptosMovementTransaction';

const useTransaction = () => {
  const { t: getLabel } = useTranslation();
  const { handleSendSuiTransaction } = useSuiTransaction();
  const { handleSendAptosMovementTransaction } = useAptosMovementTransaction();

  const [transactionHash, setTransactionHash] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<
    BlockchainTransactionStatusEnum | undefined
  >(undefined);

  const handleSendTransaction = async (
    selectedChain: SupportedChainEnum,
    data: web3.Transaction | web3.Transaction[] | any, // NOTE: Update additional type when implement new chain
    walletAddress?: string,
  ) => {
    setTransactionStatus(BlockchainTransactionStatusEnum.LOADING);
    try {
      let resTransaction = { txHash: '', messageError: '' };

      if (
        selectedChain === SupportedChainEnum.Sui
      ) {
        resTransaction = (await handleSendSuiTransaction(
          data,
        )) as ResSendTransactionInterface;
      }

      if (resTransaction.txHash) {
        await AppService.syncTransaction(resTransaction.txHash, selectedChain);
      } else {
        if (resTransaction.messageError !== AppConstant.USER_REJECTED_MESSAGE) {
          setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
          setTransactionError(resTransaction.messageError);
        } else {
          setTransactionStatus(undefined);
        }
      }

      setTransactionHash(resTransaction.txHash);

      return resTransaction.txHash;
    } catch (error) {
      console.log(error);
      setTransactionHash('');
    }
  };

  // NOTE: setInterval this function to get tx status
  const handleGetTransactionResult = async (
    chain: SupportedChainEnum,
    txHash: string,
  ) => {
    try {
      let txStatus = BlockchainTransactionStatusEnum.LOADING;

      txStatus = (await BlockchainService.getBlockchainServiceByChain(
        chain,
      )?.getTransactionResult({
        txHash,
      })) as BlockchainTransactionStatusEnum;

      setTransactionStatus(txStatus);
      return txStatus as BlockchainTransactionStatusEnum;
    } catch (error) {
      console.log(error);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      setTransactionError(error ? error.toString() : 'Something went wrong');
      return BlockchainTransactionStatusEnum.FAILED;
    }
  };

  const handleReset = () => {
    setTransactionHash('');
    setTransactionError('');
    setTransactionStatus(undefined);
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    handleSendTransaction,
    handleGetTransactionResult,
  };
};

export default useTransaction;
