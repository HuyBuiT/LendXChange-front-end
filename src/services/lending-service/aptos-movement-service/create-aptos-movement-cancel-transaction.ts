import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { CancelLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createAptosMovementCancelTransaction = async (
  createCancelLendTransactionData: CancelLendTransactionInterface,
) => {
  const { offerId, lendAsset } = createCancelLendTransactionData;

  if (!offerId || !lendAsset) return;
  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::offer::request_cancel_offer` as MoveCallTargetType;

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress],
    functionArguments: [offerId],
  };

  return tx as InputGenerateTransactionPayloadData;
};
