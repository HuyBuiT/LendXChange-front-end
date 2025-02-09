import { BlockchainUtils } from '@/utils';
import { SupportTokenType } from '@/models';
import { ReqGetBalanceTokenInterface } from '..';

export const getBalanceToken = async (
  getTokenBalanceData: ReqGetBalanceTokenInterface,
) => {
  const { walletAddress, assets } = getTokenBalanceData;
  const balances = new Map<SupportTokenType, { balance: number }>();

  if (!walletAddress || !assets.size) return balances;

  return balances;
};
