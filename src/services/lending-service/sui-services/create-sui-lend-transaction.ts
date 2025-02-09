import { handleSplitCoinSuiWallet } from '.';
import { CoinStruct } from '@mysten/sui.js/client';
import { BlockchainUtils, CommonUtils } from '@/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CreateLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createSuiLendTransaction = async (
  createLendTransactionData: CreateLendTransactionInterface,
) => {
  if (!createLendTransactionData) return;
  const {
    tierId,
    interest,
    lendCoin,
    lendAsset,
    numberOfOffer,
    walletAddress,
  } = createLendTransactionData;

  const target =
    `${process.env.SUI_UPGRADED_PACKAGE}::offer::create_offer` as MoveCallTargetType;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const contractConfig = process.env.SUI_CONFIGURATION || '';
  const coinType = lendAsset.tokenAddress;
  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const tx = new TransactionBlock();

  const coinObject = (await handleSplitCoinSuiWallet(
    walletAddress,
    lendAsset.tokenAddress,
  )) as CoinStruct[];

  let coin = BlockchainUtils.getAppropriateCoin(
    tx,
    coinObject,
    lendCoin * numberOfOffer,
  );

  if (!coin) {
    coin = BlockchainUtils.mergeCoins(tx, coinObject, lendCoin * numberOfOffer);
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
        tx.pure.string(tierId.toString()),
        splitCoinAmount,
        tx.pure.u64(convertInterest),
      ],
    });
  }

  return tx;
};
