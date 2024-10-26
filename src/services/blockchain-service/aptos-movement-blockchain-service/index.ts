import {
  ResGetBalanceTokenType,
  BlockchainServiceInterface,
  ReqGetBalanceTokenInterface,
  ReqGetTransactionResultInterface,
  ReqSendTransactionInterface,
  ResSendTransactionInterface,
} from '..';
import { getBalanceToken } from './get-balance-token';
import { BlockchainTransactionStatusEnum } from '@/models';
import { getTransactionResult } from './get-transaction-result';

export class AptosMovementBlockchainService
  implements BlockchainServiceInterface
{
  async getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType> {
    const tokenBalance = await getBalanceToken(getTokenBalanceData);

    return tokenBalance;
  }

  async getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface,
  ): Promise<BlockchainTransactionStatusEnum> {
    const result = await getTransactionResult(getTransactionResultData.txHash);

    return result;
  }
  getRpcEndpoint(): string {
    throw new Error('Method not implemented.');
  }
  sendTransaction?(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendTransactionData: ReqSendTransactionInterface,
  ): Promise<ResSendTransactionInterface> {
    throw new Error('Method not implemented.');
  }
}
