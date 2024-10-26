import { CommonUtils } from '@/utils';
import { handleGetAptosMovementPricesObject } from '.';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { BorrowTransactionInterface, MoveCallTargetType } from '@/models';

export const createAptosMovementBorrowTransaction = async (
  createBorrowTransactionData: BorrowTransactionInterface,
) => {
  const {
    interest,
    lendAsset,
    lendOfferId,
    collateralAsset,
    collateralAmount,
  } = createBorrowTransactionData;

  const target =
    `${process.env.APTOS_MOVEMENT_PACKAGE}::loan::take_loan` as MoveCallTargetType;

  const convertInterest = CommonUtils.convertInterestPushContractSui(interest);

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
      lendOfferId,
      convertInterest,
      collateralAmount,
      lendPriceObject,
      collateralPriceObject,
    ],
  };

  return tx as InputGenerateTransactionPayloadData;
};
