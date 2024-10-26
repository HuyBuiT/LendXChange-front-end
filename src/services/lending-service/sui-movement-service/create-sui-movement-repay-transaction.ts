import {
  MoveCallTargetType,
  RepayLoanOfferTransactionInterface,
} from '@/models';
import { BlockchainUtils } from '@/utils';
import { CoinStruct } from '@mysten/sui.js/client';
import { handleSplitCoinSuiWallet } from '../sui-services';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export const createSuiMovementRepayTransaction = async (
  createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
) => {
  const { loanOfferId, repayCoin, lendAsset, collateralAsset, walletAddress } =
    createRepayLoanOfferTransactionData;

  if (!loanOfferId || !repayCoin) return;
  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::loan::repay` as MoveCallTargetType;
  const coinType = lendAsset.tokenAddress;
  const collateralType = collateralAsset.tokenAddress;

  const version = process.env.SUI_MOVEMENT_VERSION || '';
  const contractState = process.env.SUI_MOVEMENT_STATE || '';
  const contractConfig = process.env.SUI_MOVEMENT_CONFIGURATION || '';
  const contractCustodian = process.env.SUI_MOVEMENT_CUSTODIAN || '';

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    lendAsset.tokenAddress,
  )) as CoinStruct[];

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(tx, coinObject, repayCoin);

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, repayCoin);
  }

  const [splitCoinAmount] = tx.splitCoins(coin.coinObjectId, [
    tx.pure(repayCoin),
  ]);

  tx.moveCall({
    target: target,
    typeArguments: [coinType, collateralType],
    arguments: [
      tx.object(version),
      tx.object(contractConfig),
      tx.object(contractCustodian),
      tx.object(contractState),
      tx.pure.id(loanOfferId),
      splitCoinAmount,
      tx.object('0x6'),
    ],
  });

  return tx;
};
