import {
  BorrowTransactionInterface,
  EditLendTransactionInterface,
  CreateLendTransactionInterface,
  CancelLendTransactionInterface,
  RepayLoanOfferTransactionInterface,
  DepositCollateralTransactionInterface,
  WithdrawCollateralTransactionInterface,
} from '@/models';

import { LendingServicesInterface } from '..';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { createSuiMovementLendTransaction } from './create-sui-movement-lend-transaction';
import { createSuiMovementRepayTransaction } from './create-sui-movement-repay-transaction';
import { createSuiMovementBorrowTransaction } from './create-sui-movement-borrow-transaction';
import { createSuiMovementDepositTransaction } from './create-sui-movement-deposit-transaction';
import { createSuiMovementWithdrawTransaction } from './create-sui-movement-withdraw-transaction';
import { createSuiMovementEditLendTransaction } from './create-sui-movement-edit-lend-transaction';
import { createSuiMovementCancelLendTransaction } from './create-sui-movement-cancel-lend-transaction';

export class SuiMovementLendingService implements LendingServicesInterface {
  private async createTransaction<T>(
    createTransactionFn: (data: T) => Promise<TransactionBlock | undefined>,
    data: T,
  ): Promise<TransactionBlock | undefined> {
    return await createTransactionFn(data);
  }

  async createLendTransaction(
    createLendTransactionData: CreateLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementLendTransaction,
      createLendTransactionData,
    );
  }
  async createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementBorrowTransaction,
      createBorrowTransactionData,
    );
  }
  async createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementEditLendTransaction,
      createEditLendTransactionData,
    );
  }
  async createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementCancelLendTransaction,
      createCancelLendTransactionData,
    );
  }
  async createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementRepayTransaction,
      createRepayLoanOfferTransactionData,
    );
  }
  async createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementDepositTransaction,
      createDepositCollateralTransactionData,
    );
  }
  async createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiMovementWithdrawTransaction,
      createWithdrawCollateralTransactionData,
    );
  }
}
