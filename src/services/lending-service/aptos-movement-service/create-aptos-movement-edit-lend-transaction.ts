import { CommonUtils } from '@/utils';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { EditLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createAprosMovementEditLendTransaction = async (
  createEditLendTransactionData: EditLendTransactionInterface,
) => {
  const { offerId, interest, lendAsset } = createEditLendTransactionData;
  if (!offerId || !interest || !lendAsset) return;
  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::offer::edit_offer` as MoveCallTargetType;

  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress],
    functionArguments: [offerId, convertInterest],
  };

  return tx as InputGenerateTransactionPayloadData;
};
