import {
  Asset,
  LendStatus,
  LoanStatus,
  LendOfferStatus,
  SupportTokenType,
  SupportedChainEnum,
  SolanaSupportedTokenEnum,
} from './app.model';

export interface StatisticLendOfferViewInterface {
  totalInterestEarned: number;
  totalOpenOffersValue: number;
  totalActiveContracts: number;
  totalOpenOffersContracts: number;
  totalActiveContractsValue: number;
  totalInterestEarnedContracts: number;
  totalInterestInActiveContract: number;
}

export interface OpenLendOfferViewInterface {
  offerId: string;
  amount: number;
  duration: number;
  lenderFee: number;
  lendInterestPercent: number;
  waitingInterest: number;
  updatedAt: number;
  startDate: number;
  endDateInterest: number;
  transactionHash: string;
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum; // NOTE: Might update when implement others chain
  status: LendStatus;
}

export interface LendContractViewInterface {
  payment: PaymentContractOfferType;
  amount: number;
  duration: number;
  chain: SupportedChainEnum;
  lendInterestPercent: number;
  lenderFee: number;
  waitingInterest: number;
  token: SolanaSupportedTokenEnum;
  transactionHash: string;
  endDate: number;
  startDate: number;
  endDateInterest: number;
  status: LoanStatus;
}

export type PaymentContractOfferType = {
  createdAt: number;
  amount: number;
  fee: number;
  network: SupportedChainEnum;
  symbol: SolanaSupportedTokenEnum;
};

export interface LendOffersListByAddressResponseInterface {
  pageData: LendOffersResponseInterface[];
  pageNum: number;
  total: number;
}

export interface LendOffersResponseInterface {
  offerId: string;
  interestRate: number;
  lenderFee: number;
  borrowerFee: number;
  amount: number;
  duration: string;
  network: SupportedChainEnum;
  symbol: SolanaSupportedTokenEnum;
  createdAt: string;
  updatedAt: string;
  lenderAddress: string;
  waitingInterest: number;
  events?: EventWithHashResponseInterface[];
  status: LendStatus;
}

interface EventWithHashResponseInterface {
  eventName: string;
  signature: string;
  createdAt: string;
}

export interface ContractResponseInterface {
  loanOfferId: string;
  lendOfferId: string;
  interestRate: number;
  amount: number;
  templateId: string;
  network: SupportedChainEnum;
  symbol: SupportTokenType;
  isPaid: boolean;
  isDue: boolean;
  status: LoanStatus;
  waitingInterest: number;

  lenderFee: number;
  borrowerFee: number;

  startDate: string;
  endDate: string;

  lenderAddress: string;
  borrowerAddress: string;

  collaterals: ContractCollateralResponseInterface[];
  payments: ContractPaymentResponseInterface[];

  events?: EventWithHashResponseInterface[];
  liquidationEvents?: LiquidationEventWithHashResponseInterface[];
}

export interface ActiveLoansDashboardResponseInterface {
  borrowOfferId: string;
  borrowerAddress: string;
  interestPercent: number;
  lendOfferId: string;
  lenderAddress: string;
  startDate: string;
}

interface LiquidationEventWithHashResponseInterface {
  eventName: string;
  signature: string;
  createdAt: string;
  metadata: any;
}

interface ContractCollateralResponseInterface {
  amount: number;
  network: SupportedChainEnum;
  symbol: SolanaSupportedTokenEnum;
  createdAt: string;
}

interface ContractPaymentResponseInterface {
  amount: number;
  fee: number;
  network: SupportedChainEnum;
  symbol: SolanaSupportedTokenEnum;
  createdAt: string;
}

export interface ContractListByAddressResponseInterface {
  pageData: ContractResponseInterface[];
  pageNum: number;
  total: number;
}

export interface GetListOfferParams {
  network?: SupportedChainEnum;
  walletAddress: string;
  templateId?: string;
  status?: LendOfferStatus;
  sorts?: any;
  pageNum?: number;
  pageSize?: number;
}

export interface GetListLendContractParams {
  network?: SupportedChainEnum;
  walletAddress: string;
  templateId?: string;
  statuses?: LoanStatus[];
  isLiquidated?: boolean;
  sorts?: any;
  pageNum?: number;
  pageSize?: number;
}

export interface EditLendTransactionInterface {
  walletAddress: string;
  interest: number;
  offerId: string;
  lendAsset: Asset;
}

export interface CancelLendTransactionInterface {
  lendAsset: Asset;
  walletAddress: string;
  offerId: string;
}
