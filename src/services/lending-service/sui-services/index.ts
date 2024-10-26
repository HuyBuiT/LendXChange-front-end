import {
  SuiPythClient,
  SuiPriceServiceConnection,
} from '@pythnetwork/pyth-sui-js';

import {
  BorrowTransactionInterface,
  EditLendTransactionInterface,
  CreateLendTransactionInterface,
  CancelLendTransactionInterface,
  RepayLoanOfferTransactionInterface,
  DepositCollateralTransactionInterface,
  WithdrawCollateralTransactionInterface,
  NetworkModeEnum,
} from '@/models';

import { Network } from '@mysten/kiosk';
import { LendingServicesInterface } from '..';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { createSuiLendTransaction } from './create-sui-lend-transaction';
import { createSuiRepayTransaction } from './create-sui-repay-transaction';
import { createSuiBorrowTransaction } from './create-sui-borrow-transaction';
import { CoinStruct, SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { createSuiDepositTransaction } from './create-sui-deposit-transaction';
import { createSuiWithdrawTransaction } from './create-sui-withdraw-transaction';
import { createSuiEditLendTransaction } from './create-sui-edit-lend-transaction';
import { createSuiCancelLendTransaction } from './create-sui-cancel-lend-transaction';

const suiClient = new SuiClient({
  url: getFullnodeUrl(
    process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
      ? Network.MAINNET
      : Network.TESTNET,
  ),
});

export class SuiLendingService implements LendingServicesInterface {
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
      createSuiLendTransaction,
      createLendTransactionData,
    );
  }
  async createBorrowTransaction(
    createBorrowTransactionData: BorrowTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiBorrowTransaction,
      createBorrowTransactionData,
    );
  }
  async createEditLendTransaction(
    createEditLendTransactionData: EditLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiEditLendTransaction,
      createEditLendTransactionData,
    );
  }
  async createCancelLendTransaction(
    createCancelLendTransactionData: CancelLendTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiCancelLendTransaction,
      createCancelLendTransactionData,
    );
  }
  async createRepayLoanOfferTransaction(
    createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiRepayTransaction,
      createRepayLoanOfferTransactionData,
    );
  }
  async createDepositCollateralTransaction(
    createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiDepositTransaction,
      createDepositCollateralTransactionData,
    );
  }
  async createWithdrawCollateralTransaction(
    createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
  ) {
    return this.createTransaction(
      createSuiWithdrawTransaction,
      createWithdrawCollateralTransactionData,
    );
  }
}

export const handleSplitCoinSuiWallet = async (
  walletAddress: string,
  tokenType: string,
) => {
  try {
    let hasNextPage;
    let nextCursor;
    let myCoin = [] as CoinStruct[];
    do {
      const response = await suiClient?.getAllCoins({
        owner: walletAddress,
        cursor: nextCursor,
      });

      const allCoins = response.data;
      if (!allCoins || !allCoins.length) return;

      const coinsByPool = allCoins.filter(
        (item) => item.coinType === tokenType,
      );

      if (coinsByPool.length > 0) {
        myCoin = [...coinsByPool, ...myCoin];
      }
      nextCursor = response.nextCursor;
      hasNextPage = response.hasNextPage;
    } while (hasNextPage);

    return myCoin as CoinStruct[];
  } catch (error) {
    console.log('error', error);
    return [] as CoinStruct[];
  }
};

export const handleGetPricesObject = async (
  priceFeedIds: string,
  basePriceFeedUrl: string,
) => {
  try {
    if (!priceFeedIds.length) return '';
    const url = new URL(String(basePriceFeedUrl + '/api')).origin;

    const connection = new SuiPriceServiceConnection(url);
    const pythClient = new SuiPythClient(
      suiClient as any,
      process.env.PYTH_STATE_ID || '_',
      process.env.WORMHOLE_STATE_ID || '_',
    );
    const priceUpdateData = await connection.getPriceFeedsUpdateData([
      priceFeedIds,
    ]);

    const tx = new TransactionBlock();

    const priceInfoObjects = await pythClient.updatePriceFeeds(
      tx as any,
      priceUpdateData,
      [priceFeedIds],
    );

    return priceInfoObjects[0];
  } catch (err) {
    console.log(err);
    return '';
  }
};
