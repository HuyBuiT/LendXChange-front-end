import { CoinStruct } from '@mysten/sui.js/client';
import { BlockchainUtils, CommonUtils } from '@/utils';
import { handleSplitCoinSuiWallet } from '../sui-services';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CreateLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createSuiMovementLendTransaction = async (
  createLendTransactionData: CreateLendTransactionInterface,
) => {
  if (!createLendTransactionData) return;
  const {
    tierId,
    lendCoin,
    lendAsset,
    interest,
    numberOfOffer,
    walletAddress,
  } = createLendTransactionData;
  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::offer::create_offer` as MoveCallTargetType;

  const version = process.env.SUI_MOVEMENT_VERSION || '';
  const contractState = process.env.SUI_MOVEMENT_STATE || '';
  const contractConfig = process.env.SUI_MOVEMENT_CONFIGURATION || '';
  const coinType = lendAsset.tokenAddress;
  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    lendAsset.tokenAddress,
  )) as CoinStruct[];

  const tx = new TransactionBlock();

  let coin = BlockchainUtils.getAppropriateCoin(tx, coinObject, lendCoin);

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, lendCoin);
  }

  for (let i = 0; i < numberOfOffer; i++) {
    const [splitCoinAmount] = tx.splitCoins(coin.coinObjectId, [
      tx.pure(lendCoin),
    ]);

    tx.moveCall({
      target: target,
      typeArguments: [coinType],
      arguments: [
        tx.object(version),
        tx.object(contractState),
        tx.object(contractConfig),
        tx.pure.string(tierId),
        splitCoinAmount,
        tx.pure.u64(convertInterest),
      ],
    });
  }

  return tx;
};
