import {
  MoveCallTargetType,
  SuiMovementSupportedTokenEnum,
  WithdrawCollateralTransactionInterface,
} from '@/models';
import { CommonUtils } from '@/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiMovementWithdrawTransaction = async (
  createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
) => {
  if (!createWithdrawCollateralTransactionData) return;

  const { loanOfferId, amount, collateralSymbol, lendAsset, collateralAsset } =
    createWithdrawCollateralTransactionData;

  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::loan::withdraw_collateral_loan_offer` as MoveCallTargetType;
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
