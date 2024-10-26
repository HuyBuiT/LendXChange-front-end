import { Asset, SupportTokenType } from './app.model';
import { LoanStatus, SolanaSupportedTokenEnum, SupportedChainEnum } from '.';

export interface TotalCardInfoValueViewInterface {
  totalInterestPaid: number;
  totalActiveContracts: number;
  totalInterestActiveContractValue: number;
  totalBorrowed: number;
  totalContracts: number;
  fluctuationsInterest: number;
}

export interface LoanContractViewInterface {
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum;
  loanOfferId: string;
  lendOfferId: string;
  tierId: string;
  borrowerAddress: string;
  lenderAddress: string;

  amount: number;
  duration: number;
  healthRatio?: number;
  endTimestamp: number;

  borrowInterest: number;
  borrowInterestValue: number;

  borrowFee: number;
  borrowFeeValue: number;

  totalRepay: number;
  status: LoanStatus;

  collateral: CollateralViewType;
  repaidData: RepaidContractViewType;
  liquidatedData: LiquidatedContractViewType;
}

export type CollateralViewType = {
  amount: number;
  token: SolanaSupportedTokenEnum;
};

export type LiquidatedContractViewType = {
  isLiquidated: boolean;
  timestamp?: number;

  txHash?: string;
  totalRepaid?: number;
  totalReceived?: number;
  liquidatedHeathRatio?: number;
  convertedLiquidatedValue?: number;
};

export type RepaidContractViewType = {
  isRepaid: boolean;
  txHash?: string;
  timestamp?: number;
};

export interface RepayLoanOfferTransactionInterface {
  tierId: string;
  loanOfferId: string;
  walletAddress: string;
  collateralAsset: Asset;
  lendAsset: Asset;
  repayCoin?: number;
  collateralSymbol: SupportTokenType;
}

export interface DepositCollateralTransactionInterface {
  loanOfferId: string;
  tierId: string;
  amount: number;
  walletAddress: string;
  collateralAsset: Asset;
  lendAsset: Asset;
  collateralSymbol: SupportTokenType;
}

export interface WithdrawCollateralTransactionInterface {
  walletAddress: string;
  loanOfferId: string;
  tierId: string;
  amount: number;
  collateralAsset: Asset;
  lendAsset: Asset;
  collateralSymbol: SupportTokenType;
}
