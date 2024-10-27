import {
  BestOfferListViewInterface,
  BestOfferItemViewInterface,
  ActiveLoanItemViewInterface,
  ActiveLoanListViewInterface,
  OfferTemplateResponseInterface,
} from '@/models';
import { DISPLAY_ACTIVE_LOAN_BEST_OFFER } from '@/const/app.const';
import { ActiveLoansDashboardResponseInterface } from '@/models/lend.model';

export const refactorOfferTemplatesData = (
  offerTemplates: OfferTemplateResponseInterface[],
) => {
  if (!offerTemplates.length) return [];

  const refactoredData = offerTemplates.map((item) => {
    return {
      id: item.id,
      amount: Number(item?.amount / Math.pow(10, 6)),
      volume: item?.volume7d
        ? Number(item?.volume7d / Math.pow(10, 6))
        : 0,
      durations: Math.floor(item.duration / (3600 * 24)),
      chain: item.network,
      token: item.symbol,
      bestOffer: item?.bestOffer?.interestRate || 0,
      borrowInterest: item?.bestOffer?.interestRate || 0,

      // TODO: Update when have this fields
      waitingInterest: 0,
      lendFee: item.lenderFee || 0,
      borrowFee: item.borrowerFee || 0,

      bestOfferData: {
        lenderAddress: item.bestOffer?.lenderAddress,
        offerId: item.bestOffer?.offerId || '',
        tierId: item.bestOffer?.templateId || '',
      },
    };
  });

  return refactoredData;
};

export const refactorBestOffers = (
  tierId: string,
  bestOffers?: BestOfferItemViewInterface[],
) => {
  if (!tierId) return { tierId: '', bestOffers: [] };

  if (!bestOffers || !bestOffers.length)
    return { tierId: tierId, bestOffers: [] };

  if (bestOffers.length > DISPLAY_ACTIVE_LOAN_BEST_OFFER) {
    return {
      tierId: tierId,
      bestOffers: bestOffers.slice(0, DISPLAY_ACTIVE_LOAN_BEST_OFFER),
    } as BestOfferListViewInterface;
  } else {
    return { tierId: tierId, bestOffers } as BestOfferListViewInterface;
  }
};

export const refactorActiveLoans = (
  tierId: string,
  activeLoans?: ActiveLoansDashboardResponseInterface[],
) => {
  if (!tierId) return { tierId: '', activeLoans: [] };

  if (!activeLoans || !activeLoans.length)
    return { tierId: tierId, activeLoans: [] };

  const data = activeLoans.map((item) => {
    return {
      borrowOfferId: item.borrowOfferId,
      borrowerAddress: item.borrowerAddress,
      interestPercent: item.interestPercent,
      lendOfferId: item.lendOfferId,
      lenderAddress: item.lenderAddress,
      startDate: new Date(item.startDate).getTime() / 1000,
    } as ActiveLoanItemViewInterface;
  });

  if (data.length > DISPLAY_ACTIVE_LOAN_BEST_OFFER) {
    return {
      tierId: tierId,
      activeLoans: data
        .slice(0, DISPLAY_ACTIVE_LOAN_BEST_OFFER)
        .sort((loan1, loan2) => loan1.startDate - loan2.startDate),
    } as ActiveLoanListViewInterface;
  } else {
    return { tierId: tierId, activeLoans: data } as ActiveLoanListViewInterface;
  }
};
