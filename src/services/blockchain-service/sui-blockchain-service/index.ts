import {
  ResGetBalanceTokenType,
  BlockchainServiceInterface,
  ReqGetBalanceTokenInterface,
  ReqSendTransactionInterface,
  ResSendTransactionInterface,
  ReqGetTransactionResultInterface,
} from '..';
import { Network } from '@mysten/kiosk';
import { SuiClient } from '@mysten/sui/client';
import { getBalanceToken } from './get-balance-token';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { getTransactionResult } from './get-transaction-result';
import { BlockchainTransactionStatusEnum, NetworkModeEnum } from '@/models';

export class SuiBlockchainService implements BlockchainServiceInterface {
  protected readonly suiClient: SuiClient;

  constructor() {
    this.suiClient = new SuiClient({ url: this.getRpcEndpoint() });
  }

  async getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType> {
    return getBalanceToken(this.suiClient, getTokenBalanceData);
  }

  async getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface,
  ): Promise<BlockchainTransactionStatusEnum> {
    return getTransactionResult(
      this.suiClient,
      getTransactionResultData.txHash,
    );
  }

  getRpcEndpoint(): string {
    return getFullnodeUrl(
      process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
        ? Network.MAINNET
        : Network.TESTNET,
    );
  }

  sendTransaction?(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendTransactionData: ReqSendTransactionInterface,
  ): Promise<ResSendTransactionInterface> {
    throw new Error('Method not implemented.');
  }
}
