import {
  MoveCallTargetType,
  SuiSupportedTokenEnum,
  WithdrawCollateralTransactionInterface,
} from '@/models';
import { CommonUtils } from '@/utils';
import { handleGetPricesObject } from '.';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiWithdrawTransaction = async (
  createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
) => {
  if (!createWithdrawCollateralTransactionData) return;

  const { loanOfferId, amount, collateralSymbol, collateralAsset, lendAsset } =
    createWithdrawCollateralTransactionData;

  const target =
    `${process.env.SUI_UPGRADED_PACKAGE}::loan::withdraw_collateral_loan_offer` as MoveCallTargetType;

  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const contractConfig = process.env.SUI_CONFIGURATION || '';
  const lendMetadata = process.env.SUI_LEND_COIN_METADATA || '';

  const collateralMetadata =
    CommonUtils.getSuiEnvByToken(
      collateralSymbol as SuiSupportedTokenEnum,
      process.env.SUI_COLLATERAL_COIN_METADATA,
    ) || '';

  const basePriceFeedUrl = lendAsset.priceFeedProvider.url;

  const [priceObjectLending, priceObjectCollateral] = await Promise.all([
    handleGetPricesObject(lendAsset.priceFeedId, basePriceFeedUrl),
    handleGetPricesObject(collateralAsset.priceFeedId, basePriceFeedUrl),
  ]);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: target,
    typeArguments: [coinType, collateralType],
    arguments: [
      tx.object(version),
      tx.object(contractConfig),
      tx.object(contractState),
      tx.pure.id(loanOfferId),
      tx.pure.u64(amount),
      tx.object(lendMetadata),
      tx.object(collateralMetadata),
      tx.object(priceObjectLending),
      tx.object(priceObjectCollateral),
      tx.object('0x6'),
    ],
  });

  return tx;
};
