import {
  MoveCallTargetType,
  SuiSupportedTokenEnum,
  BorrowTransactionInterface,
} from '@/models';
import { CoinStruct } from '@mysten/sui.js/client';
import { BlockchainUtils, CommonUtils } from '@/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { handleGetPricesObject, handleSplitCoinSuiWallet } from '.';

export const createSuiBorrowTransaction = async (
  createBorrowTransactionData: BorrowTransactionInterface,
) => {
  if (!createBorrowTransactionData) return;
  const {
    interest,
    lendAsset,
    lendOfferId,
    walletAddress,
    collateralAsset,
    collateralSymbol,
    collateralAmount,
  } = createBorrowTransactionData;

  const target =
    `${process.env.SUI_UPGRADED_PACKAGE}::loan::take_loan` as MoveCallTargetType;

  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const contractConfig = process.env.SUI_CONFIGURATION || '';
  const lendMetadata = process.env.SUI_LEND_COIN_METADATA || '';
  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const collateralMetadata =
    CommonUtils.getSuiEnvByToken(
      collateralSymbol as SuiSupportedTokenEnum,
      process.env.SUI_COLLATERAL_COIN_METADATA,
    ) || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    lendAsset.tokenAddress,
  )) as CoinStruct[];

  const basePriceFeedUrl = lendAsset.priceFeedProvider.url;

  const [priceObjectLending, priceObjectCollateral] = await Promise.all([
    handleGetPricesObject(lendAsset.priceFeedId, basePriceFeedUrl),
    handleGetPricesObject(collateralAsset.priceFeedId, basePriceFeedUrl),
  ]);

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(
    tx,
    coinObject,
    collateralAmount,
  );

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, collateralAmount);
  }

  const [splitCoinAmount] = tx.splitCoins(tx.gas, [
    tx.pure(Math.floor(collateralAmount)),
  ]);

  tx.moveCall({
    target: target,
    typeArguments: [coinType, collateralType],
    arguments: [
      tx.object(version),
      tx.object(contractConfig),
      tx.object(contractState),
      tx.pure.id(lendOfferId),
      tx.pure.u64(convertInterest),
      splitCoinAmount,
      tx.object(lendMetadata),
      tx.object(collateralMetadata),
      tx.object(priceObjectLending),
      tx.object(priceObjectCollateral),
      tx.object('0x6'),
    ],
  });

  return tx;
};
