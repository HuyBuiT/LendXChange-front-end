import {
  SupportedChainEnum,
  BorrowTransactionInterface,
  EditLendTransactionInterface,
  CancelLendTransactionInterface,
  CreateLendTransactionInterface,
  RepayLoanOfferTransactionInterface,
  DepositCollateralTransactionInterface,
  WithdrawCollateralTransactionInterface,
} from '@/models';
import { web3 } from '@project-serum/anchor';
import { SuiLendingService } from './sui-services';
import { SolanaLendingService } from './solana-services';
import { EclipseLendingService } from './eclipse-services';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiMovementLendingService } from './sui-movement-service';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { AptosMovementLendingService } from './aptos-movement-service';

export interface LendingServicesInterface {
  createLendTransaction(
    createLendTransactionData: CreateLendTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ): Promise<ResCreateTransactionType>;
  createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ): Promise<ResCreateTransactionType>;
}

// to do: update later with remaining chains
export type ResCreateTransactionType =
  | web3.Transaction
  | web3.Transaction[]
  | TransactionBlock
  | InputGenerateTransactionPayloadData
  | undefined;

export const getLendingServiceByChain = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      return new SolanaLendingService();
    case SupportedChainEnum.Eclipse:
      return new EclipseLendingService();
    case SupportedChainEnum.Sui:
      return new SuiLendingService();
    case SupportedChainEnum.SuiMovement:
      return new SuiMovementLendingService();
    case SupportedChainEnum.AptosMovement:
      return new AptosMovementLendingService();
    default:
      return null;
  }
};
