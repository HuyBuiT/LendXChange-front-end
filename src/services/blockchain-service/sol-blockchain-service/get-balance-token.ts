import { BlockchainUtils } from '@/utils';
import { ReqGetBalanceTokenInterface } from '..';
import { SolanaSupportedTokenEnum, SupportTokenType } from '@/models';

export const getBalanceToken = async (
  getTokenBalanceData: ReqGetBalanceTokenInterface,
) => {
  const { walletAddress, assets } = getTokenBalanceData;
  const balances = new Map<SupportTokenType, { balance: number }>();

  if (!walletAddress || !assets.size) return balances;

  await Promise.all(
    Array.from(assets.values()).map(async (asset) => {
      const rpcUrl = BlockchainUtils.getSolanaRpcEndpoint();
      const balance = await (asset.symbol === SolanaSupportedTokenEnum.SOL
        ? BlockchainUtils.getSolanaNativeTokenBalance(walletAddress, rpcUrl)
        : BlockchainUtils.getSolanaSplTokenBalance(
            walletAddress,
            asset.tokenAddress,
            'solana',
          ));

      balances.set(asset.symbol as SolanaSupportedTokenEnum, { balance });
    }),
  );

  return balances;
};
