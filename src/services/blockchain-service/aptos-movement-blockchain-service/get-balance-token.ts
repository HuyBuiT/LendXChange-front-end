import { AppConstant } from '@/const';
import { ReqGetBalanceTokenInterface } from '..';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { AptosMovementSupportedTokenEnum, SupportTokenType } from '@/models';

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

    Array.from(assets.values()).map((asset) => {
      const tokenAddress =
        asset.symbol !== AptosMovementSupportedTokenEnum.APT
          ? asset.tokenAddress
          : AppConstant.APTOS_MOVEMENT_COIN_TYPE;

      const index = data
        .map((item) => item.type)
        .indexOf(`${AppConstant.APTOS_MOVEMENT_COIN_STORE}<${tokenAddress}>`);

      if (index >= 0) {
        const coinStore = data[index].data as CoinStore;
        const balanceValue = coinStore?.coin?.value;

        balances.set(asset.symbol, {
          balance: balanceValue
            ? Number(balanceValue) / Math.pow(10, asset.decimals)
            : 0,
        });
      } else {
        balances.set(asset.symbol, { balance: 0 });
      }
    });
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
