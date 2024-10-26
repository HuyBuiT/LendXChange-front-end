import {
  Asset,
  SupportTokenType,
  SupportedChainEnum,
} from '@/models/app.model';
import { BlockchainService } from '@/services';

const useBalances = () => {
  const handleGetTokenBalance = async (
    chain: SupportedChainEnum,
    walletAddress: string,
    assets: Map<SupportTokenType, Asset>,
  ) => {
    try {
      const tokenBalance = await BlockchainService.getBlockchainServiceByChain(
        chain,
      )?.getBalanceToken({ walletAddress, assets });

      return tokenBalance;
    } catch (error) {
      console.log('error', error);
      return new Map<SupportTokenType, { balance: number }>();
    }
  };

  return {
    handleGetTokenBalance,
  };
};

export default useBalances;
