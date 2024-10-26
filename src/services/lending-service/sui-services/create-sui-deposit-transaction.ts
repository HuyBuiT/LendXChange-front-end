import {
  MoveCallTargetType,
  SuiSupportedTokenEnum,
  DepositCollateralTransactionInterface,
} from '@/models';
import { BlockchainUtils } from '@/utils';
import { handleSplitCoinSuiWallet } from '.';
import { CoinStruct } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiDepositTransaction = async (
  createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
) => {
  if (!createDepositCollateralTransactionData) return;

  const {
    amount,
    lendAsset,
    loanOfferId,
    walletAddress,
    collateralAsset,
    collateralSymbol,
  } = createDepositCollateralTransactionData;

  const target =
    `${process.env.SUI_UPGRADED_PACKAGE}::loan::deposit_collateral_loan_offer` as MoveCallTargetType;

  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const contractConfig = process.env.SUI_CONFIGURATION || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    collateralAsset.tokenAddress,
  )) as CoinStruct[];

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(tx, coinObject, amount);

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, amount);
  }

  const [splitCoinAmount] = tx.splitCoins(
    collateralSymbol === SuiSupportedTokenEnum.SUI ? tx.gas : coin.coinObjectId,
    [tx.pure(amount)],
  );

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
