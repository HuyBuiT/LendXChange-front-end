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
import { createEclipseLendTransaction } from './create-eclipse-lend-transaction';
import { createEclipseRepayTransaction } from './create-eclipse-repay-transaction';
import { createEclipseBorrowTransaction } from './create-eclipse-borrow-transaction';
import { createEclipseDepositTransaction } from './create-eclipse-deposit-transaction';
import { createEclipseWithdrawTransaction } from './create-eclipse-withdraw-transaction';
import { createEclipseEditLendTransaction } from './create-eclipse-edit-lend-transaction';
import { createEclipseCancelLendTransaction } from './create-eclipse-cancel-lend-transaction';

export class EclipseLendingService implements LendingServicesInterface {
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
      createEclipseLendTransaction,
      createLendTransactionData,
    );
  }
  async createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseBorrowTransaction,
      createBorrowTransactionData,
    );
  }
  async createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseEditLendTransaction,
      createEditLendTransactionData,
    );
  }
  async createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseCancelLendTransaction,
      createCancelLendTransactionData,
    );
  }
  async createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseRepayTransaction,
      createRepayLoanOfferTransactionData,
    );
  }
  async createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseDepositTransaction,
      createDepositCollateralTransactionData,
    );
  }
  async createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createEclipseWithdrawTransaction,
      createWithdrawCollateralTransactionData,
    );
  }
}
