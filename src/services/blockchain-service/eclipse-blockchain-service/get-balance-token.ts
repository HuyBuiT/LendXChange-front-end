import { BlockchainUtils } from '@/utils';
import { SupportTokenType } from '@/models';
import { ReqGetBalanceTokenInterface } from '..';
import { EclipseSupportedTokenEnum } from '@/models/app.model';

export const getBalanceToken = async (
  getTokenBalanceData: ReqGetBalanceTokenInterface,
) => {
  const { walletAddress, assets } = getTokenBalanceData;
  const balances = new Map<SupportTokenType, { balance: number }>();

  if (!walletAddress || !assets.size) return balances;

  await Promise.all(
    Array.from(assets.values()).map(async (asset) => {
      const rpcUrl = BlockchainUtils.getEclipseRpcEndpoint();
      const balance = await (asset.symbol === EclipseSupportedTokenEnum.ETH
        ? BlockchainUtils.getSolanaNativeTokenBalance(walletAddress, rpcUrl)
        : BlockchainUtils.getSolanaSplTokenBalance(
            walletAddress,
            asset.tokenAddress,
            'eclipse',
          ));

      balances.set(asset.symbol as EclipseSupportedTokenEnum, { balance });
    }),
  );

  return balances;
};
