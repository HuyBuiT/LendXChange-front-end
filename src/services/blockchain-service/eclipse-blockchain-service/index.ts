import { BlockchainUtils } from '@/utils';
import { getBalanceToken } from './get-balance-token';
import { SolBlockchainService } from '../sol-blockchain-service';
import { ResGetBalanceTokenType, ReqGetBalanceTokenInterface } from '..';

export class EclipseBlockchainService extends SolBlockchainService {
  getRpcEndpoint(): string {
    return BlockchainUtils.getEclipseRpcEndpoint();
  }

  async getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType> {
    const tokenBalance = await getBalanceToken(getTokenBalanceData);

    return tokenBalance;
  }
}
