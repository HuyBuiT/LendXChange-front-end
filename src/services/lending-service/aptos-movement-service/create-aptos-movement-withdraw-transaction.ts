import {
  MoveCallTargetType,
  WithdrawCollateralTransactionInterface,
} from '@/models';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';

export const createAptosMovementWithdrawTransaction = async (
  createWithdrawCollateralTransactionData: WithdrawCollateralTransactionInterface,
) => {
  const { loanOfferId, amount, collateralAsset, lendAsset } =
    createWithdrawCollateralTransactionData;

  if (!loanOfferId || !amount || !collateralAsset || !lendAsset) return;

  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::loan::deposit_collateral_loan_offer` as MoveCallTargetType;

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress, collateralAsset.tokenAddress],
    functionArguments: [loanOfferId, amount],
  };

  return tx as InputGenerateTransactionPayloadData;
};
