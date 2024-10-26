import {
  BorrowTransactionInterface,
  EditLendTransactionInterface,
  CreateLendTransactionInterface,
  CancelLendTransactionInterface,
  RepayLoanOfferTransactionInterface,
  DepositCollateralTransactionInterface,
  WithdrawCollateralTransactionInterface,
} from '@/models';

import { web3 } from '@project-serum/anchor';
import { LendingServicesInterface } from '..';
import { createSolLendTransaction } from './create-sol-lend-transaction';
import { createSolBorrowTransaction } from './create-sol-borrow-transaction';
import { createSolWithdrawTransaction } from './create-sol-withdraw-transaction';
import { createSolEditLendTransaction } from './create-sol-edit-lend-transaction';
import { createSolCancelLendTransaction } from './create-sol-cancel-lend-transaction';
import { createSolRepayLoanOfferTransaction } from './create-sol-repay-loan-offer-transaction';
import { createSolDepositCollateralTransaction } from './create-sol-deposit-collateral-transaction';

export class SolanaLendingService implements LendingServicesInterface {
  private async createTransaction<T>(
    createTransactionFn: (
      data: T,
    ) => Promise<web3.Transaction | web3.Transaction[] | undefined>,
    data: T,
  ): Promise<web3.Transaction | web3.Transaction[] | undefined> {
    return await createTransactionFn(data);
  }

  async createLendTransaction(
    createLendTransactionData: CreateLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSolLendTransaction,
      createLendTransactionData,
    );
  }
  async createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ) {
    return this.createTransaction(
      createSolBorrowTransaction,
      createBorrowTransactionData,
    );
  }
  async createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSolEditLendTransaction,
      createEditLendTransactionData,
    );
  }
  async createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSolCancelLendTransaction,
      createCancelLendTransactionData,
    );
  }
  async createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ) {
    return this.createTransaction(
      createSolRepayLoanOfferTransaction,
      createRepayLoanOfferTransactionData,
    );
  }
  async createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSolDepositCollateralTransaction,
      createDepositCollateralTransactionData,
    );
  }
  async createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSolWithdrawTransaction,
      createWithdrawCollateralTransactionData,
    );
  }
}
