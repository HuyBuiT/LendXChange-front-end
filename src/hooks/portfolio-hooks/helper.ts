import { ResLoanBorrowedInterface, ResSuppliedAssetInterface } from "@/models/home.model";


export const refactorSuppliedAsset = (data: ResSuppliedAssetInterface) => {
  const { lendSupplied, collateralSupplied } = data;

  const refactorLendSupplied = lendSupplied.map((item) => {
    return {
      lendSuppliedAmount:
        Number(item.lendSuppliedAmount) / Math.pow(10, item.asset.decimals),
      asset: item.asset,
      activeContractPerAsset: Number(item.activeContractPerAsset),
      interestEarnedAmount:
        Number(item.interestEarnedAmount) / Math.pow(10, item.asset.decimals),
    };
  });

  const refactorCollateralSupplied = collateralSupplied.map((item) => {
    return {
      collateralSuppliedAmount:
        Number(item.collateralSuppliedAmount) /
        Math.pow(10, item.asset.decimals),
      asset: item.asset,
    };
  });

  return {
    lendSupplied: refactorLendSupplied,
    collateralSupplied: refactorCollateralSupplied,
  };
};

export const refactorLoanBorrowed = (data: ResLoanBorrowedInterface[]) => {
  return data.map((item) => {
    return {
      asset: item.asset,
      borrowedAmount:
        Number(item.borrowedAmount) / Math.pow(10, item.asset.decimals),
      interestOwedAmount:
        Number(item.interestOwedAmount) / Math.pow(10, item.asset.decimals),
      activeContractPerAsset: Number(item.activeContractPerAsset),
    };
  });
};
