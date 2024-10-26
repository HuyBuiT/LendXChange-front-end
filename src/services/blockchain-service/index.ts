import { web3 } from '@project-serum/anchor';
import { Asset, SupportedChainEnum } from '@/models/app.model';
import { SolBlockchainService } from './sol-blockchain-service';
import { SuiBlockchainService } from './sui-blockchain-service';
import { EclipseBlockchainService } from './eclipse-blockchain-service';
import { BlockchainTransactionStatusEnum, SupportTokenType } from '@/models';
import { SuiMovementBlockchainService } from './sui-movement-blockchain-service';
import { AptosMovementBlockchainService } from './aptos-movement-blockchain-service';

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
    case SupportedChainEnum.Solana:
      return new SolBlockchainService();
    case SupportedChainEnum.Eclipse:
      return new EclipseBlockchainService();
    case SupportedChainEnum.Sui:
      return new SuiBlockchainService();
    case SupportedChainEnum.SuiMovement:
      return new SuiMovementBlockchainService();
    case SupportedChainEnum.AptosMovement:
      return new AptosMovementBlockchainService();
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
