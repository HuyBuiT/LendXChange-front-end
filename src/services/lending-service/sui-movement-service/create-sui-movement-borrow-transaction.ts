import {
  MoveCallTargetType,
  BorrowTransactionInterface,
  SuiMovementSupportedTokenEnum,
} from '@/models';
import { CoinStruct } from '@mysten/sui.js/client';
import { BlockchainUtils, CommonUtils } from '@/utils';
import { handleSplitCoinSuiWallet } from '../sui-services';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiMovementBorrowTransaction = async (
  createBorrowTransactionData: BorrowTransactionInterface,
) => {
  if (!createBorrowTransactionData) return;
  const {
    lendAsset,
    lendOfferId,
    walletAddress,
    collateralAsset,
    collateralSymbol,
    collateralAmount,
  } = createBorrowTransactionData;
  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::loan::take_loan` as MoveCallTargetType;
  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_MOVEMENT_VERSION || '';
  const contractState = process.env.SUI_MOVEMENT_STATE || '';
  const contractConfig = process.env.SUI_MOVEMENT_CONFIGURATION || '';
  const lendMetadata = process.env.SUI_MOVEMENT_LEND_COIN_METADATA || '';
  const priceObjectLending = process.env.SUI_MOVEMENT_PYTH_LENDING || '';

  const collateralMetadata =
    CommonUtils.getSuiMovementEnvByToken(
      collateralSymbol as SuiMovementSupportedTokenEnum,
      process.env.SUI_MOVEMENT_COLLATERAL_COIN_METADATA,
    ) || '';

  const priceObjectCollateral =
    CommonUtils.getSuiMovementEnvByToken(
      collateralSymbol as SuiMovementSupportedTokenEnum,
      process.env.SUI_MOVEMENT_PYTH_COLLATERAL,
    ) || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    lendAsset.tokenAddress,
  )) as CoinStruct[];

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(
    tx,
    coinObject,
    collateralAmount,
  );

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, collateralAmount);
  }

  const [splitCoinAmount] = tx.splitCoins(coin.coinObjectId, [
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
