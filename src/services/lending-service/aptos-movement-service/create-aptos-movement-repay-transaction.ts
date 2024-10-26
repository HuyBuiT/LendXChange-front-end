import {
  MoveCallTargetType,
  RepayLoanOfferTransactionInterface,
} from '@/models';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';

export const createAptosMovementRepayTransaction = async (
  createRepayLoanOfferTransactionData: RepayLoanOfferTransactionInterface,
) => {
  const { loanOfferId, lendAsset, collateralAsset } =
    createRepayLoanOfferTransactionData;

  if (!loanOfferId || !lendAsset || !collateralAsset) return;

  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::loan::repay` as MoveCallTargetType;

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress, collateralAsset.tokenAddress],
    functionArguments: [loanOfferId],
  };

  return tx as InputGenerateTransactionPayloadData;
};
