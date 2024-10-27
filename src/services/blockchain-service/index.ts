import { web3 } from '@project-serum/anchor';
import { Asset, SupportedChainEnum } from '@/models/app.model';
import { SuiBlockchainService } from './sui-blockchain-service';
import { BlockchainTransactionStatusEnum, SupportTokenType } from '@/models';

export interface BlockchainServiceInterface {
  getRpcEndpoint(): string;
  sendTransaction?(
    sendTransactionData: ReqSendTransactionInterface,
  ): Promise<ResSendTransactionInterface>;
  getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface,
  ): Promise<BlockchainTransactionStatusEnum>;
  getBalanceToken(
    getTokenBalanceData: ReqGetBalanceTokenInterface,
  ): Promise<ResGetBalanceTokenType>;
}

export const getBlockchainServiceByChain = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Sui:
      return new SuiBlockchainService();
    default:
      return null;
  }
};

export interface ResSendTransactionInterface {
  txHash: string;
  messageError: string;
}

export type ResGetBalanceTokenType = Map<SupportTokenType, { balance: number }>;

export interface ReqSendTransactionInterface {
  transactionData: web3.Transaction | web3.Transaction[];
  rpcEndpoint?: string;
  walletAddress?: string;
  getLabel?: any;
}

export interface ReqGetTransactionResultInterface {
  txHash: string;
  rpcEndpoint?: string | web3.Cluster;
}

export interface ReqGetBalanceTokenInterface {
  walletAddress: string;
  assets: Map<SupportTokenType, Asset>;
}
