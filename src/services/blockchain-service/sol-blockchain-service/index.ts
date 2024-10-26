import {
  ResGetBalanceTokenType,
  BlockchainServiceInterface,
  ReqGetBalanceTokenInterface,
  ReqSendTransactionInterface,
  ResSendTransactionInterface,
  ReqGetTransactionResultInterface,
} from '..';

import { BlockchainUtils } from '@/utils';
import { web3 } from '@project-serum/anchor';
import { getBalanceToken } from './get-balance-token';
import { BlockchainTransactionStatusEnum } from '@/models';
import { handleSendSolTransaction } from './send-transaction';
import { handleSendSolTransactions } from './send-transactions';
import { getTransactionResult } from './get-transaction-result';

export class SolBlockchainService implements BlockchainServiceInterface {
  getRpcEndpoint(): string {
    return BlockchainUtils.getSolanaRpcEndpoint();
  }

  async getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType> {
    const tokenBalance = await getBalanceToken(getTokenBalanceData);

    return tokenBalance;
  }

  async sendTransaction(
    sendTransactionData: ReqSendTransactionInterface,
  ): Promise<ResSendTransactionInterface> {
    let res;
    const rpcEndPoint = this.getRpcEndpoint();
    if (Array.isArray(sendTransactionData.transactionData)) {
      const data = {
        ...sendTransactionData,
        rpcEndpoint: rpcEndPoint,
        transactionData:
          sendTransactionData.transactionData as web3.Transaction[],
      };

      res = await handleSendSolTransactions(data);
    } else {
      const data = {
        ...sendTransactionData,
        rpcEndpoint: rpcEndPoint,
        transactionData:
          sendTransactionData.transactionData as web3.Transaction,
      };
      res = await handleSendSolTransaction(data);
    }

    return res;
  }

  async getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface,
  ): Promise<BlockchainTransactionStatusEnum> {
    const rpcEndpoint = this.getRpcEndpoint();
    const result = await getTransactionResult({
      ...getTransactionResultData,
      rpcEndpoint,
    });

    return result;
  }
}
