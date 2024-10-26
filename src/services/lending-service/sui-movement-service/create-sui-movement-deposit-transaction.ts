import {
  MoveCallTargetType,
  DepositCollateralTransactionInterface,
} from '@/models';
import { BlockchainUtils } from '@/utils';
import { CoinStruct } from '@mysten/sui.js/client';
import { handleSplitCoinSuiWallet } from '../sui-services';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiMovementDepositTransaction = async (
  createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
) => {
  if (!createDepositCollateralTransactionData) return;

  const { loanOfferId, amount, collateralAsset, lendAsset, walletAddress } =
    createDepositCollateralTransactionData;

  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::loan::deposit_collateral_loan_offer` as MoveCallTargetType;

  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_MOVEMENT_VERSION || '';
  const contractState = process.env.SUI_MOVEMENT_STATE || '';
  const contractConfig = process.env.SUI_MOVEMENT_CONFIGURATION || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    collateralAsset.tokenAddress,
  )) as CoinStruct[];

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(tx, coinObject, amount);

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, amount);
  }

  const [splitCoinAmount] = tx.splitCoins(coin.coinObjectId, [tx.pure(amount)]);

  tx.moveCall({
    target: target,
    typeArguments: [coinType, collateralType],
    arguments: [
      tx.object(version),
      tx.object(contractConfig),
      tx.object(contractState),
      tx.pure.id(loanOfferId),
      splitCoinAmount,
      tx.object('0x6'),
    ],
  });

  return tx;
};
