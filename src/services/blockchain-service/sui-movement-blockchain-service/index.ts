import { SuiBlockchainService } from '../sui-blockchain-service';
import { ResGetBalanceTokenType, ReqGetBalanceTokenInterface } from '..';
import { getBalanceToken } from './get-balance-token';

export class SuiMovementBlockchainService extends SuiBlockchainService {
  async getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType> {
    return getBalanceToken(this.suiClient, getTokenBalanceData);
  }
}
