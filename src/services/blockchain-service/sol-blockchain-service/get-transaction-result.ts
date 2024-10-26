import { web3 } from '@project-serum/anchor';
import { ReqGetTransactionResultInterface } from '..';
import { BlockchainTransactionStatusEnum } from '@/models';

export const getTransactionResult = async (
  getTransactionResultData: ReqGetTransactionResultInterface,
) => {
  const { txHash, rpcEndpoint } = getTransactionResultData;
  if (!txHash || !rpcEndpoint) return BlockchainTransactionStatusEnum.FAILED;

  try {
    const connection = new web3.Connection(rpcEndpoint, 'finalized');

    const result = await connection.getSignatureStatus(txHash, {
      searchTransactionHistory: true,
    });

    const status = result.value?.confirmationStatus;
    const error = result.value?.err;

    if (error) {
      return BlockchainTransactionStatusEnum.FAILED;
    }

    if (!result?.value) {
      return BlockchainTransactionStatusEnum.LOADING;
    }

    if (status === 'finalized') {
      return BlockchainTransactionStatusEnum.SUCCESS;
    } else {
      return BlockchainTransactionStatusEnum.LOADING;
    }
  } catch (error) {
    console.log(error);

    return BlockchainTransactionStatusEnum.FAILED;
  }
};
