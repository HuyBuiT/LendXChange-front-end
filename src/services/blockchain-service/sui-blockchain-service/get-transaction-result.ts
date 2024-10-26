import { SuiClient } from '@mysten/sui/client';
import { BlockchainTransactionStatusEnum, NetworkModeEnum } from '@/models';

export const getTransactionResult = async (
  suiClient: SuiClient,
  transactionHash: string,
) => {
  const transactionBlockData = await suiClient.waitForTransaction({
    digest: transactionHash,
    options: {
      showEffects: true,
    },
  });
  if (process.env.NETWORK_MODE !== NetworkModeEnum.MAIN_NET) {
    console.log('SUI Transaction Result', transactionBlockData);
  }
  const transactionStatus = transactionBlockData.effects?.status;
  if (transactionStatus?.status === SuiErrorStatusEnum.SUCCESS) {
    return BlockchainTransactionStatusEnum.SUCCESS;
  } else {
    return BlockchainTransactionStatusEnum.FAILED;
  }
};

enum SuiErrorStatusEnum {
  SUCCESS = 'success',
  FAILURE = 'failure',
}
