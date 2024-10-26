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
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { AptosPriceServiceConnection } from '@pythnetwork/pyth-aptos-js';
import { createAptosMovementLendTransaction } from './create-aptos-movement-lend-transaction';
import { createAptosMovementRepayTransaction } from './create-aptos-movement-repay-transaction';
import { createAptosMovementBorrowTransaction } from './create-aptos-movement-borrow-transaction';
import { createAptosMovementCancelTransaction } from './create-aptos-movement-cancel-transaction';
import { createAptosMovementDepositTransaction } from './create-aptos-movement-deposit-transaction';
import { createAptosMovementWithdrawTransaction } from './create-aptos-movement-withdraw-transaction';
import { createAprosMovementEditLendTransaction } from './create-aptos-movement-edit-lend-transaction';

export class AptosMovementLendingService implements LendingServicesInterface {
  private async createTransaction<T>(
    createTransactionFn: (
      data: T,
    ) => Promise<InputGenerateTransactionPayloadData | undefined>,
    data: T,
  ): Promise<InputGenerateTransactionPayloadData | undefined> {
    return await createTransactionFn(data);
  }

  async createLendTransaction(
    createLendTransactionData: CreateLendTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementLendTransaction,
      createLendTransactionData,
    );
  }
  async createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementBorrowTransaction,
      createBorrowTransactionData,
    );
  }
  async createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ) {
    return this.createTransaction(
      createAprosMovementEditLendTransaction,
      createEditLendTransactionData,
    );
  }
  async createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementCancelTransaction,
      createCancelLendTransactionData,
    );
  }
  async createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementRepayTransaction,
      createRepayLoanOfferTransactionData,
    );
  }
  async createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementDepositTransaction,
      createDepositCollateralTransactionData,
    );
  }
  async createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createAptosMovementWithdrawTransaction,
      createWithdrawCollateralTransactionData,
    );
  }
}

export const handleGetAptosMovementPricesObject = async (
  basePriceFeedUrl: string,
  priceFeedId: string,
) => {
  try {
    if (!priceFeedId || !basePriceFeedUrl) return [];
    const url = new URL(String(basePriceFeedUrl + '/api')).origin;

    const connection = new AptosPriceServiceConnection(url);

    const res = await connection.getPriceFeedsUpdateData([priceFeedId]);

    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};
