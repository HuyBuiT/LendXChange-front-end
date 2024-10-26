import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { BlockchainTransactionStatusEnum, NetworkModeEnum } from '@/models';

const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: process.env.APTOS_MOVEMENT_RPC_URL,
  indexer: process.env.APTOS_MOVEMENT_INDEXER_RPC_URL,
});
const aptosMovementClient = new Aptos(aptosConfig);

export const getTransactionResult = async (transactionHash: string) => {
  const transactionBlockData = await aptosMovementClient.waitForTransaction({
    transactionHash: transactionHash,
  });
  if (process.env.NETWORK_MODE !== NetworkModeEnum.MAIN_NET) {
    console.log('SUI Transaction Result', transactionBlockData);
  }
  const transactionStatus = (await transactionBlockData).success;
  if (transactionStatus) {
    return BlockchainTransactionStatusEnum.SUCCESS;
  } else {
    return BlockchainTransactionStatusEnum.FAILED;
  }
};
