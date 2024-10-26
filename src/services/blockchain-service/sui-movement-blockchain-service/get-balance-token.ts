import { SuiClient } from '@mysten/sui/client';
import { ReqGetBalanceTokenInterface } from '..';
import { SupportTokenType } from '@/models';

export const getBalanceToken = async (
  suiClient: SuiClient,
  getTokenBalanceData: ReqGetBalanceTokenInterface,
) => {
  const { walletAddress, assets } = getTokenBalanceData;

  const balances = new Map<SupportTokenType, { balance: number }>();

  if (!walletAddress || !assets.size) return balances;

  try {
    if (!walletAddress) return balances;
    const data = await suiClient.getAllBalances({
      owner: walletAddress,
    });
    if (!data.length) {
      return balances;
    }

    Array.from(assets.values()).map((asset) => {
      const index = data
        .map((item) => item.coinType)
        .indexOf(asset.tokenAddress);

      balances.set(asset.symbol, {
        balance:
          index >= 0
            ? Number(data[index].totalBalance) / Math.pow(10, asset.decimals)
            : 0,
      });
    });
  } catch (error) {
    console.error(error);
  }
  return balances;
};
