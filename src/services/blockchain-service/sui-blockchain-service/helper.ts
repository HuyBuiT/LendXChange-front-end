const getListErrorWithModule = (module: string) => {
  switch (module) {
    case 'offer':
      return OfferErrorEnum;
    case 'offer_registry':
      return OfferRegistryErrorEnum;
    case 'loan_registry':
      return LoanRegistryErrorEnum;
    case 'loan':
      return LoanErrorEnum;
    default:
      return null;
  }
};

const extractErrorCode = (errorString: string) => {
  const match = errorString.match(/, (\d+)\)/);
  return match ? +match[1] : null;
};

const extractModuleError = (errorString: string) => {
  const match = errorString.match(/Identifier\("([^"]+)"\)/);
  return match ? match[1] : null;
};

export const handleGetErrorMessage = (errorString: string) => {
  const moduleError = extractModuleError(errorString);
  const errorCode = extractErrorCode(errorString);

  if (!moduleError || !errorCode)
    return 'Oops! Something went wrong. Please try again';

  const errorMessage = getListErrorWithModule(moduleError);
  return errorMessage
    ? errorMessage[errorCode].replace(/([A-Z])/g, ' $1').trim()
    : 'Oops! Something went wrong. Please try again';
};

enum OfferErrorEnum {
  InvalidInterestValue = 1,
  NotFoundAssetTier = 2,
  NotEnoughBalanceToCreateOffer = 3,
  NotFoundOfferToEdit = 5,
  InvalidLendCoin = 6,
}

enum OfferRegistryErrorEnum {
  InvalidOfferStatus = 1,
  SenderIsNotOfferOwner = 2,
  LendCoinIsInvalid = 3,
}

enum LoanRegistryErrorEnum {
  CollateralNotValidToMinHealthRatio = 1,
  SenderIsNotLoanBorrower = 2,
  InvalidLoanStatus = 3,
  NotEnoughBalanceToRepay = 4,
  CanNotRepayExpiredLoan = 5,
  LiquidationIsNull = 7,
  InvalidCoinInput = 8,
  CollateralIsInsufficient = 9,
  CanNotLiquidateValidCollateral = 10,
  CanNotLiquidateUnexpiredLoan = 11,
}

enum LoanErrorEnum {
  OfferNotFound = 1,
  OfferIsNotActive = 2,
  LoanNotFound = 3,
  PriceInfoObjectLendingIsInvalid = 4,
  PriceInfoObjectCollateralIsInvalid = 5,
  LendCoinIsInvalid = 6,
  CollateralCoinIsInvalid = 7,
  InterestIsInvalid = 8,
}
