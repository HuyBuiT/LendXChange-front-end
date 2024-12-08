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
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';

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
    case SupportedChainEnum.Sui:
      return new SuiLendingService();
    default:
      return null;
  }
};
