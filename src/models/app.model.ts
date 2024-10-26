export enum SupportedChainEnum {
  Sui = 'SUI',
  SuiMovement = 'SUI_MOVEMENT',
  Monad = 'MONAD',
  Solana = 'SOLANA',
  Injective = 'INJECTIVE',
  AptosMovement = 'APTOS_MOVEMENT',
  Eclipse = 'ECLIPSE',
}

export enum NetworkModeEnum {
  DEV_NET = 'devnet',
  TEST_NET = 'testnet',
  MAIN_NET = 'mainnet',
}

export enum SolanaSupportedTokenEnum {
  USDC = 'USDC',
  SOL = 'SOL',
  BSOL = 'BSOL',
  MSOL = 'MSOL',
  JITOSOL = 'JITOSOL',
  INF = 'INF',
}

export enum EclipseSupportedTokenEnum {
  USDC = 'USDC',
  ETH = 'ETH',
}

export enum SuiMovementSupportedTokenEnum {
  USDC = 'USDC',
  WBTC = 'WBTC',
  WETH = 'WETH',
}

export enum SuiSupportedTokenEnum {
  USDC = 'USDC',
  SUI = 'SUI',
}

export enum AptosMovementSupportedTokenEnum {
  USDC = 'USDC',
  WBTC = 'WBTC',
  WETH = 'WETH',
  APT = 'APT',
}

export enum ConnectNotificationStatusEnum {
  Authenticated = 'authenticated',
  LoggedOut = 'loggedOut',
  Expired = 'expired',
}

/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum TokenDecimalsEnum {
  SOL = 9,
  USDC = 6,
  SUI = 9,
  SUI_MOVEMENT = 9,
  WBTC = 9,
  WETH = 9,
}
/* eslint-enable @typescript-eslint/no-duplicate-enum-values */

export enum SupportedTokenSuiMovementIndexEnum {
  USDC = 0,
  WBTC = 1,
  WETH = 2,
}

export enum SupportedTokenSuiIndexEnum {
  USDC = 0,
  SUI = 1,
}

export enum EventName {
  // Smart contract event handle
  InitSettingAccountEvent = 'InitSettingAccountEvent',
  CreateLendOfferEvent = 'CreateLendOfferEvent',
  LendOfferCancelRequestEvent = 'LendOfferCancelRequestEvent',
  LendOfferCanceledEvent = 'LendOfferCanceledEvent',
  EditLendOfferEvent = 'EditLendOfferEvent',
  LoanOfferCreateRequestEvent = 'LoanOfferCreateRequestEvent',
  RepayLoanOfferEvent = 'RepayLoanOfferEvent',
  // SystemRepayLoanOfferNativeEvent = 'SystemRepayLoanOfferNativeEvent',
  SystemRepayLoanOfferEvent = 'SystemRepayLoanOfferEvent',
  LiquidatingCollateralEvent = 'LiquidatingCollateralEvent',
  LiquidatedCollateralEvent = 'LiquidatedCollateralEvent',
  SystemFinishLoanOfferEvent = 'SystemFinishLoanOfferEvent',
  WithdrawCollateralEvent = 'WithdrawCollateralEvent',
  WithdrawRequestEvent = 'WithdrawRequestEvent',
  DepositCollateralLoanOfferEvent = 'DepositCollateralLoanOfferEvent',
  LoanOfferUpdateEvent = 'LoanOfferUpdateEvent',
}

export type SupportTokenType =
  | SolanaSupportedTokenEnum
  | EclipseSupportedTokenEnum
  | SuiMovementSupportedTokenEnum
  | SuiSupportedTokenEnum
  | AptosMovementSupportedTokenEnum;

export interface OfferDataDetailViewInterface {
  id: string;
  amount: number;
  volume: number;
  bestOffer: number;
  durations: number;
  borrowInterest: number;
  waitingInterest: number;
  lendFee: number;
  borrowFee: number;
  chain: SupportedChainEnum;
  token: SolanaSupportedTokenEnum;

  bestOfferData?: {
    lenderAddress: string;
    offerId: string;
    tierId: string;
  };
}
export interface NotificationListDataInterface {
  id: string;
  title: string;
  content: string;
  time: number;
  isRead: boolean;
}

export enum HeathRatioStatusEnum {
  ExtremelyRisky = 'Extremely Risky',
  Risky = 'Risky',
  Normal = 'Normal',
  Good = 'Good',
  VeryGood = 'Very Good',
}

export enum SolanaWalletsEnum {
  Backpack = 'Backpack',
  Phantom = 'Phantom',
  Solflare = 'Solflare',
  Bitget = 'Bitget',
  Salmon = 'Salmon',
}

export interface GetNonceResponseInterface {
  walletAddress: string;
  nonce: string;
}

export interface PostLoginResponseInterface {
  accessToken: string;
  refreshToken?: string;
}

export interface PriceFeedsResponseInterface {
  id: string;
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

export interface Asset {
  id: string;
  isCollateralAsset: boolean;
  isLendAsset: boolean;
  name: string;
  network: SupportedChainEnum;
  priceFeedAccountAddress: string;
  priceFeedId: string;
  symbol: SupportTokenType;
  tokenAddress: string;
  decimals: number;
  priceFeedProvider: {
    id: string;
    name: string;
    type: string;
    url: string;
  };
}

export interface NotificationInfoInterface {
  telegramId: string;
  topicName: string;
  isConfirmed: boolean;
  confirmationUrl: string;
}

export interface PageNotifiInfoInterface {
  hasNextPage: boolean;
  endCursor: string;
}

export interface NotificationSettingInterface {
  createdAt: string;
  updatedAt: string;
  accountId: string;
  healthRatioThreshold: number;
  id: string;
  userName: string;
  telegramChatId: number;
  enable: boolean;
}

export interface NotificationHistoryInterface {
  accountId: number;
  refId: number;
  notificationType: NotificationTypeEnum;
  metadata: {
    message: string;
  };
  seenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountInfoInterface {
  showFeedbackOnRepay: boolean;
  showFeedbackOnCancel: boolean;
}

export interface GetAssetsQueryParams {
  isLendAsset?: boolean;
  isCollateralAsset?: boolean;
  network: SupportedChainEnum;
}

export interface ResGetAccountInfoInterface {
  walletAddress: string;
  refCode: null;
  metadata: Metadata;
}

export interface Metadata {
  show_feedback_on_repay: boolean;
  show_feedback_on_cancel: boolean;
}

export enum LendOfferStatus {
  CREATED = 'Created',
  CANCELING = 'Canceling',
  CANCELLED = 'Cancelled',
  LOANED = 'Loaned',
}

export enum LoanStatus {
  MATCHED = 'Matched',
  FUND_TRANSFERRED = 'FundTransferred',
  REPAY = 'Repay',
  FINISHED = 'Finished',
  LIQUIDATING = 'Liquidating',
  LIQUIDATED = 'Liquidated',
  BORROWER_PAID = 'BorrowerPaid',
}

export enum LendStatus {
  CREATED = 'Created',
  CANCELING = 'Canceling',
  CANCELLED = 'Cancelled',
  LOANED = 'Loaned',
}

export enum NotificationTypeEnum {
  HEALTH_RATIO = 'health_ratio',
  LIQUIDATION = 'liquidation',
  CONTRACT_EXPIRES_1_HOUR = 'contract_expires_1',
  CONTRACT_EXPIRES_12_HOURS = 'contract_expires_12',
  OFFER_CANCELLED = 'offer_cancelled',
  CONTRACT_FINISHED = 'contract_finished',
  BORROWER_PAID = 'borrower_repaid',
}

export type MoveCallTargetType = `${string}::${string}::${string}`;
