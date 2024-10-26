import {
  MoveCallTargetType,
  DepositCollateralTransactionInterface,
} from '@/models';
import { handleGetAptosMovementPricesObject } from '.';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';

export const createAptosMovementDepositTransaction = async (
  createDepositCollateralTransactionData: DepositCollateralTransactionInterface,
) => {
  const { loanOfferId, amount, collateralAsset, lendAsset } =
    createDepositCollateralTransactionData;

  if (!loanOfferId || !amount || !collateralAsset || !lendAsset) return;

  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::loan::withdraw_collateral_loan_offer` as MoveCallTargetType;

  const basePriceFeedUrl = lendAsset.priceFeedProvider.url;

  const [lendPriceObject, collateralPriceObject] = await Promise.all([
    handleGetAptosMovementPricesObject(basePriceFeedUrl, lendAsset.priceFeedId),
    handleGetAptosMovementPricesObject(
      basePriceFeedUrl,
      collateralAsset.priceFeedId,
    ),
  ]);

  const tx = {
    function: target,
    typeArguments: [lendAsset.tokenAddress, collateralAsset.tokenAddress],
    functionArguments: [
      loanOfferId,
      amount,
      lendPriceObject,
      collateralPriceObject,
    ],
  };

  return tx as InputGenerateTransactionPayloadData;
};
