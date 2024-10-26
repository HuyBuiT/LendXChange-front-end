import { CommonUtils } from '@/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { EditLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createSuiMovementEditLendTransaction = async (
  createEditLendTransactionData: EditLendTransactionInterface,
) => {
  if (!createEditLendTransactionData) return;

  const { offerId, interest, lendAsset } = createEditLendTransactionData;
  const target =
    `${process.env.SUI_MOVEMENT_UPGRADED_PACKAGE}::offer::edit_offer` as MoveCallTargetType;

  const coinType = lendAsset.tokenAddress;

  const version = process.env.SUI_MOVEMENT_VERSION || '';
  const contractState = process.env.SUI_MOVEMENT_STATE || '';
  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: target,
    typeArguments: [coinType],
    arguments: [
      tx.object(version),
      tx.object(contractState),
      tx.pure.id(offerId),
      tx.pure.u64(convertInterest),
    ],
  });

  return tx;
};
