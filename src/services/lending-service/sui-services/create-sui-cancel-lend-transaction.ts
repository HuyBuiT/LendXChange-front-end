import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CancelLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createSuiCancelLendTransaction = async (
  createCancelLendTransactionData: CancelLendTransactionInterface,
) => {
  if (!createCancelLendTransactionData.offerId) return;

  const { offerId, lendAsset } = createCancelLendTransactionData;
  const target =
    `${process.env.SUI_UPGRADED_PACKAGE}::offer::request_cancel_offer` as MoveCallTargetType;

  const version = process.env.SUI_VERSION || '';
  const contractState = process.env.SUI_STATE || '';
  const coinType = lendAsset.tokenAddress;

  const tx = new TransactionBlock();

  tx.moveCall({
    target: target,
    typeArguments: [coinType],
    arguments: [
      tx.object(version),
      tx.object(contractState),
      tx.pure.id(offerId),
    ],
  });

  return tx;
};
