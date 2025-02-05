import {
  SupportTokenType,
  DataListInterface,
  LoanContractViewInterface,
  BestOfferListViewInterface,
  ActiveLoanListViewInterface,
  BestOfferSocketResponseInterface,
  ActiveLoanSocketResponseInterface,
} from '@/models';

export const getLoanContractsHealthRation = (
  priceMap: Map<
    SupportTokenType,
    {
      price: number;
      priceFeedId: string;
    }
  >,
  loanContracts: DataListInterface<LoanContractViewInterface[]>,
) => {
  if (!loanContracts.pageData.length || !priceMap.size)
    return {
      ...loanContracts,
      pageData: [],
    } as DataListInterface<LoanContractViewInterface[]>;

  const loanContractsWithHealthRatio = loanContracts.pageData.map((item) => {
    const convertedCollateral =
      (priceMap.get(item.collateral.token)?.price || 0) *
      item.collateral.amount;

    const healthRatio = convertedCollateral / item.amount;

    return { ...item, healthRatio: healthRatio || 0 };
  });

  return {
    ...loanContracts,
    pageData: [...loanContractsWithHealthRatio],
  } as DataListInterface<LoanContractViewInterface[]>;
};

export const pushNewActiveLoan = (
  newLoan: ActiveLoanSocketResponseInterface,
  activeLoanList: ActiveLoanListViewInterface[],
) => {
  if (!newLoan.id || !activeLoanList.length) return [];

  const clonedArray = [...activeLoanList];

  const refactorNewLoan = {
    startDate: new Date(newLoan.createdAt).getTime() / 1000 || 0,
    lenderAddress: newLoan.lenderAddress,
    interestPercent: newLoan.interestRate,
    borrowerAddress: newLoan.borrowerAddress,
    lendOfferId: newLoan.lendOfferId,
    borrowOfferId: newLoan.loanOfferId,
  };

  for (let i = 0; i < clonedArray.length; i++) {
    if (clonedArray[i].tierId === newLoan.templateId) {
      if (clonedArray[i].activeLoans.length >= 5) {
        clonedArray[i].activeLoans.splice(-1);
      }

      clonedArray[i].activeLoans = [refactorNewLoan].concat(
        clonedArray[i].activeLoans,
      );
    }
  }

  return clonedArray;
};

export const removeBestOffer = (
  offerTaken:
    | ActiveLoanSocketResponseInterface
    | BestOfferSocketResponseInterface,
  bestOffers: BestOfferListViewInterface[],
) => {
  if (!offerTaken.id || !bestOffers.length) return [];

  const clonedArray = [...bestOffers];

  for (let i = 0; i < clonedArray.length; i++) {
    if (clonedArray[i].tierId === offerTaken.templateId) {
      const newBestOffers = clonedArray[i].bestOffers.filter((item) => {
        if ('lendOfferId' in offerTaken) {
          return item.lendOfferId !== offerTaken.lendOfferId;
        } else if ('offerId' in offerTaken) {
          return item.lendOfferId !== offerTaken.offerId;
        }
        return false;
      });

      clonedArray[i].bestOffers = newBestOffers;
    }
  }

  return clonedArray;
};

export const pushNewOffer = (
  newOffer: BestOfferSocketResponseInterface,
  bestOffers: BestOfferListViewInterface[],
) => {
  if (!newOffer.id || !bestOffers.length) return [];

  const clonedArray = [...bestOffers];

  const refactorNewOffer = {
    lenderAddress: newOffer.lenderAddress,
    lendOfferId: newOffer.offerId,
    interestPercent: newOffer.interestRate,
  };

  for (let i = 0; i < clonedArray.length; i++) {
    if (clonedArray[i].tierId === newOffer.templateId) {
      if (clonedArray[i].bestOffers.length >= 5) {
        clonedArray[i].bestOffers.splice(-1);
      }

      clonedArray[i].bestOffers = [refactorNewOffer].concat(
        clonedArray[i].bestOffers,
      );
    }
  }

  return clonedArray;
};


