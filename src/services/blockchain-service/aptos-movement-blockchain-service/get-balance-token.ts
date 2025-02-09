import { AppConstant } from '@/const';
import { ReqGetBalanceTokenInterface } from '..';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { SupportTokenType } from '@/models';

const aptosConfig = new AptosConfig({
  network: Network.CUSTOM,
  fullnode: process.env.APTOS_MOVEMENT_RPC_URL,
  indexer: process.env.APTOS_MOVEMENT_INDEXER_RPC_URL,
});
const aptosMovementClient = new Aptos(aptosConfig);

export const getBalanceToken = async (
  getTokenBalanceData: ReqGetBalanceTokenInterface,
) => {
  const { walletAddress, assets } = getTokenBalanceData;

  const balances = new Map<SupportTokenType, { balance: number }>();
  if (!walletAddress || !assets.size) return balances;
  try {
    if (!aptosMovementClient) return balances;
    const data = await aptosMovementClient.getAccountResources({
      accountAddress: walletAddress,
    });

    if (!data.length) {
      return balances;
    }
    return balances;
  } catch (error) {
    console.log(error, error);
    return balances;
  }
};

interface CoinStore {
  coin: {
    value: string;
  };
}
