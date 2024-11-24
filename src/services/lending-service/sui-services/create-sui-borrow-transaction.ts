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

  const coinType ="0x934eccc71e031fffb7d5fb597e2058a1be267320e9355961c593590f810d50e3::usdc::USDC";

  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const contractConfig = process.env.SUI_CONFIGURATION || '';
  const lendMetadata = '0x8adc4a98b8ab67bc3948c7a62233b666c47a5851245a1092888b363c5ca18b44';
  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const collateralMetadata =
    CommonUtils.getSuiEnvByToken(
      collateralSymbol as SuiSupportedTokenEnum,
      process.env.SUI_COLLATERAL_COIN_METADATA,
    ) || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    coinType,
  )) as CoinStruct[];

  const basePriceFeedUrl = 'https://hermes-beta.pyth.network';

  const [priceObjectLending, priceObjectCollateral] = await Promise.all([
    handleGetPricesObject('0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722', basePriceFeedUrl),
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
