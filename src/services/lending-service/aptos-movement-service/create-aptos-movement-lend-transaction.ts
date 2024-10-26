import { CommonUtils } from '@/utils';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { CreateLendTransactionInterface, MoveCallTargetType } from '@/models';

export const createAptosMovementLendTransaction = async (
  createLendTransactionData: CreateLendTransactionInterface,
) => {
  const { walletAddress, tierId, interest, lendAsset } =
    createLendTransactionData;

  if (!walletAddress || !tierId || !interest || !lendAsset) return;

  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::offer::create_offer` as MoveCallTargetType;

  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress],
    functionArguments: [tierId, convertInterest],
  };

  return tx as InputGenerateTransactionPayloadData;
};
