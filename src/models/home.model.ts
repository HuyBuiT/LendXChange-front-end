import { Asset, SupportTokenType } from './app.model';
import { SolanaSupportedTokenEnum, SupportedChainEnum } from '.';
import { ActiveLoansDashboardResponseInterface } from './lend.model';

export interface OfferTemplateResponseInterface {
  id: number;
  offerTemplateId: string;
  amount: number;
  symbol: SolanaSupportedTokenEnum;
  network: SupportedChainEnum;
  duration: number;
  volume7d?: number;
  bestOffer?: BestOfferResponseType;
  lenderFee: number;
  borrowerFee: number;
  asset: Asset;
}

export type BestOfferResponseType = {
  createdAt: string;
  updatedAt: string;
  id: string;
  offerId: string;
  accountId: number;
  templateId: string;
  interestRate: number;
  lenderAddress: string;
  amount: number;
  symbol: SolanaSupportedTokenEnum;
  network: SupportedChainEnum;
  duration: string;
};

export interface OfferTemplatesApiResponseInterface {
  pageData: OfferTemplateResponseInterface[];
  pageNum: number;
  total: number;
}

export interface ActiveLoanItemViewInterface {
  startDate: number;
  lenderAddress: string;
  interestPercent: number;
  borrowerAddress: string;
  lendOfferId: string;
  borrowOfferId: string;
}

export interface BestOfferItemViewInterface {
  lenderAddress: string;
  lendOfferId: string;
  interestPercent: number;
}

export interface ActiveLoanListViewInterface {
  tierId: string;
  activeLoans: ActiveLoanItemViewInterface[];
  totalActiveLoans: number;
}

export interface BestOfferListViewInterface {
  tierId: string;
  bestOffers: BestOfferItemViewInterface[];
  totalBestOffer: number;
}

export interface BestOfferListResponseInterface {
  pageData: BestOfferItemViewInterface[];
  pageNum: number;
  total: number;
}

export interface ActiveLoanListResponseInterface {
  pageData: ActiveLoansDashboardResponseInterface[];
  pageNum: number;
  total: number;
}

export interface ActiveLoanSocketResponseInterface {
  id: string;
  templateId: string;
  lenderAddress: string;
  borrowerAddress: string;
  interestRate: number;
  lendOfferId: string;
  loanOfferId: string;
  createdAt: string;
}

export interface BestOfferSocketResponseInterface {
  id: string;
  templateId: string;
  lenderAddress: string;
  borrowerAddress: string;
  interestRate: number;
  offerId: string;
  loanOfferId: string;
  createdAt: string;
}

export interface CreateLendTransactionInterface {
  lendAsset: Asset;
  walletAddress: string;
  numberOfOffer: number;
  interest: number;
  tierId: string;
  lendCoin: number;
}

export interface BorrowTransactionInterface {
  collateralAsset: Asset;
  lendAsset: Asset;
  collateralAmount: number;
  interest: number;
  walletAddress: string;
  lenderAddress: string;
  lendOfferId: string;
  tierId: string;
  collateralSymbol?: SupportTokenType;
}

export interface ResSuppliedAssetInterface {
  lendSupplied: LendSuppliedAssetInterface[];
  collateralSupplied: CollateralSuppliedAssetInterface[];
}

export interface LendSuppliedAssetInterface {
  asset: Asset;
  lendSuppliedAmount: number;
  interestEarnedAmount: number;
  activeContractPerAsset: number;
  lendSuppliedValue: number;
  interestEarnedValue: number;
}

export interface CollateralSuppliedAssetInterface {
  asset: Asset;
  collateralSuppliedAmount: number;
  collateralSuppliedValue: number;
}

export interface ResLoanBorrowedInterface {
  asset: Asset;
  borrowedAmount: number;
  interestOwedAmount: number;
  activeContractPerAsset: number;
}

export interface SuppliedAssetInterface {
  lendSupplied: LendSuppliedAssetInterface[];
  collateralSupplied: CollateralSuppliedAssetInterface[];
}

export interface LoanBorrowedInterface {
  asset: Asset;
  borrowedValue: number;
  borrowedAmount: number;
  interestOwedValue: number;
  interestOwedAmount: number;
  activeContractPerAsset: number;
}