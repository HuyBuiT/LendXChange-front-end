import {
  LendOffersResponseInterface,
  OpenLendOfferViewInterface,
  ContractResponseInterface,
  LendContractViewInterface,
  LoanStatus,
  LendStatus,
} from '@/models';
import { Asset, EventName, SupportTokenType } from '@/models/app.model';

export const getEndDateOfferInterest = (item: LendOffersResponseInterface) => {
  const endDateEvent = item.events?.find(
    (item) => item.eventName === EventName.LendOfferCancelRequestEvent,
  )?.createdAt;
  if (
    (item.status === LendStatus.CANCELLED ||
      item.status === LendStatus.CANCELING) &&
    endDateEvent
  ) {
    return new Date(endDateEvent).getTime() / 1000;
  } else {
    return Math.floor(Date.now() / 1000);
  }
};

export const getEndDateContractInterest = (item: ContractResponseInterface) => {
  const endDateEvent = item.events?.find(
    (item) => item.eventName === EventName.LoanOfferCreateRequestEvent,
  )?.createdAt;
  if (endDateEvent) {
    return new Date(endDateEvent).getTime() / 1000;
  } else {
    return Math.floor(Date.now() / 1000);
  }
};

export const refactorLendOfferList = (
  data: LendOffersResponseInterface[],
  availableAssets: Map<SupportTokenType, Asset>,
) => {
  if (!data.length) return [];

  const refactorData = data.map((item) => {
    const decimal = availableAssets.get(item.symbol)?.decimals || 0;

    return {
      offerId: item.offerId,
      amount: item.amount / Math.pow(10, decimal),
      duration: Number(item.duration),
      lenderFee: item.lenderFee,
      borrowerFee: item.borrowerFee,
      lendInterestPercent: item.interestRate,
      waitingInterest: item.waitingInterest || 0,
      startDate: new Date(item.createdAt).getTime() / 1000,
      endDateInterest: getEndDateOfferInterest(item),
      updatedAt: new Date(item.updatedAt).getTime() / 1000,
      transactionHash: item?.events ? item.events[0]?.signature || '' : '',
      chain: item.network,
      token: item.symbol,
      status: item.status,
    };
  });

  return refactorData as OpenLendOfferViewInterface[];
};

export const refactorContractList = (
  data: ContractResponseInterface[],
  availableAssets: Map<SupportTokenType, Asset>,
) => {
  if (!data.length) return [];

  const refactorData = data.map((item) => {
    const decimal = availableAssets.get(item.symbol)?.decimals || 0;

    const repayEvent =
      item.events?.filter(
        (item) => item.eventName === EventName.SystemFinishLoanOfferEvent,
      ) || [];
    const endDateInterest = getEndDateContractInterest(item);
    return {
      payment: {
        createdAt: repayEvent[0]?.signature
          ? new Date(repayEvent[0]?.createdAt).getTime() / 1000
          : 0,
        amount: item.amount,
        fee: item.lenderFee || 0,
        network: item.network,
        symbol: item.symbol,
      },

      amount: item.amount / Math.pow(10, decimal),
      duration:
        new Date(item.endDate).getTime() / 1000 -
        new Date(item.startDate).getTime() / 1000,
      chain: item.network,
      lendInterestPercent: item.interestRate,
      waitingInterest: item.waitingInterest || 0,
      lenderFee: item.lenderFee || 0,
      token: item.symbol,
      transactionHash:
        item.status === LoanStatus.FINISHED ? repayEvent[0]?.signature : '',
      startDate: new Date(item.startDate).getTime() / 1000,
      endDate: new Date(item.endDate).getTime() / 1000,
      endDateInterest,
      status: item.status,
    };
  });

  return refactorData as LendContractViewInterface[];
};
