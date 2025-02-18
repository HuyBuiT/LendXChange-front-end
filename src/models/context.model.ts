import { SetStateAction } from 'react';
import {
  Asset,
  SupportTokenType,
  SolanaWalletsEnum,
  SupportedChainEnum,
  AccountInfoInterface,
  OfferDataDetailViewInterface,
  NotificationSettingInterface,
  NotificationHistoryInterface,
} from './app.model';

import {
  LoanContractViewInterface,
  TotalCardInfoValueViewInterface,
} from './loan.model';

import {
  GetListOfferParams,
  GetListLendContractParams,
  LendContractViewInterface,
  OpenLendOfferViewInterface,
  StatisticLendOfferViewInterface,
} from './lend.model';

import {
  ActiveLoanListViewInterface,
  BestOfferListViewInterface,
  LoanBorrowedInterface,
  SuppliedAssetInterface,
} from './home.model';
import {
  PaginationType,
  DataListInterface,
} from '.';
import {
  StatusDisplayLendContractEnum,
  StatusDisplayOfferEnum,
} from '@/context/LendProvider';
import { StatusDisplayLoanContractEnum } from '@/context/LoanProvider';

export interface AppContextInterface {
  accountInfo: AccountInfoInterface;
  setAccountInfo: React.Dispatch<SetStateAction<AccountInfoInterface>>;

  selectedChain: SupportedChainEnum;
  setSelectedChain: React.Dispatch<SetStateAction<SupportedChainEnum>>;

  selectedWallet: SolanaWalletsEnum;
  setSelectedWallet: React.Dispatch<SetStateAction<SolanaWalletsEnum>>;

  selectedChainTokensPriceFeed: Map<
    SupportTokenType,
    { price: number; priceFeedId: string }
  >;

  availableAssets: Map<SupportTokenType, Asset>;
  handleGetPriceFeeds: (chain: SupportedChainEnum) => void;
}

export interface AuthContextInterface {
  isConnecting: boolean;
  setIsConnecting: React.Dispatch<SetStateAction<boolean>>;

  isOpenConnectDialog: boolean;
  setIsOpenConnectDialog: React.Dispatch<SetStateAction<boolean>>;

  isWalletConnected: boolean;
  connectedChainAddress: string;
  setConnectedChainAddress: React.Dispatch<SetStateAction<string>>;

  handleDisconnect: () => void;
  handleSwitchChain: (chain: SupportedChainEnum) => void;
  handleAccountInfo: () => void;

  handleLoginSui: (chain: SupportedChainEnum) => void;
  handleConnectSol: (selectedWallet: SolanaWalletsEnum) => void;
}

export interface NotificationContextInterface {
  isChangeSetting: boolean;
  setIsChangeSetting: React.Dispatch<SetStateAction<boolean>>;

  unreadNotificationCount: number;
  setUnreadNotificationCount: React.Dispatch<SetStateAction<number>>;

  isTelegramLinked: boolean;
  setIsTelegramLinked: React.Dispatch<SetStateAction<boolean>>;

  currentNotifiSetting: NotificationSettingInterface;
  setCurrentNotifiSetting: React.Dispatch<
    SetStateAction<NotificationSettingInterface>
  >;

  notificationHistory: NotificationHistoryInterface[];
  setNotificationHistory: React.Dispatch<
    SetStateAction<NotificationHistoryInterface[]>
  >;

  paginationNotifiHistory: PaginationType;
  setPaginationNotifiHistory: React.Dispatch<SetStateAction<PaginationType>>;

  handleGetNotifiHistory: (pageNum?: number, isScroll?: boolean) => void;
}

export interface ErrorContextInterface {
  errorData: ConnectErrorData;
  setErrorData: React.Dispatch<SetStateAction<ConnectErrorData>>;
}

export type ConnectErrorData = {
  title: string;
  message: string;
};

export interface LoanContextInterface {
  totalValueCardInfo: TotalCardInfoValueViewInterface;
  setTotalValueCardInfo: React.Dispatch<
    SetStateAction<TotalCardInfoValueViewInterface>
  >;

  loanContractData: DataListInterface<LoanContractViewInterface[]>;
  activeLoanContract: DataListInterface<LoanContractViewInterface[]>;
  repaidLoanContract: DataListInterface<LoanContractViewInterface[]>;
  liquidatedLoanContract: DataListInterface<LoanContractViewInterface[]>;

  selectedTypeDisplayLoanContract: StatusDisplayLoanContractEnum;
  setSelectedTypeDisplayLoanContract: React.Dispatch<
    SetStateAction<StatusDisplayLoanContractEnum>
  >;

  setLoanContractData: React.Dispatch<
    SetStateAction<DataListInterface<LoanContractViewInterface[]>>
  >;

  handleGetLoanContract: (
    params: GetListLendContractParams,
    selectedType: StatusDisplayLoanContractEnum,
  ) => void;
  handleGetTotalValueCardInfo: () => void;
}

export interface HomeContextInterface {
  isHasNft: boolean;
  setIsHasNft: React.Dispatch<SetStateAction<boolean>>;

  offersTemplate: OfferDataDetailViewInterface[];
  setOfferTemplate: React.Dispatch<
    SetStateAction<OfferDataDetailViewInterface[]>
  >;

  activeLoanList: ActiveLoanListViewInterface[];
  setActiveLoanList: React.Dispatch<
    SetStateAction<ActiveLoanListViewInterface[]>
  >;

  bestOfferList: BestOfferListViewInterface[];
  setBestOfferList: React.Dispatch<
    SetStateAction<BestOfferListViewInterface[]>
  >;

  interestCreateOffer: number;
  selectedChainTokensBalance: Map<SupportTokenType, { balance: number }>;
  setSelectedChainTokensBalance: React.Dispatch<
    SetStateAction<Map<SupportTokenType, { balance: number }>>
  >;

  handleGetBalancesByChain: (
    chain: SupportedChainEnum,
    address: string,
  ) => void;

  handleGetTemplates: (selectedChain: SupportedChainEnum) => void;

  isOpenNoCollaboratorDialog: boolean;
  setIsOpenNoCollaboratorDialog: React.Dispatch<SetStateAction<boolean>>;

  crossChainAddress: string;
  setCrossChainAddress: React.Dispatch<SetStateAction<string>>;
}

export interface LendContextInterface {
  lendOffers: DataListInterface<OpenLendOfferViewInterface[]>;
  openOffers: DataListInterface<OpenLendOfferViewInterface[]>;
  canceledOffers: DataListInterface<OpenLendOfferViewInterface[]>;
  setLendOffers: React.Dispatch<
    SetStateAction<DataListInterface<OpenLendOfferViewInterface[]>>
  >;

  lendContracts: DataListInterface<LendContractViewInterface[]>;
  activeContracts: DataListInterface<LendContractViewInterface[]>;
  repaidContracts: DataListInterface<LendContractViewInterface[]>;
  setLendContracts: React.Dispatch<
    SetStateAction<DataListInterface<LendContractViewInterface[]>>
  >;

  lendStatistic: StatisticLendOfferViewInterface;
  setLendStatistic: React.Dispatch<
    SetStateAction<StatisticLendOfferViewInterface>
  >;

  selectedTypeDisplayOffer: StatusDisplayOfferEnum;
  setSelectedTypeDisplayOffer: React.Dispatch<
    SetStateAction<StatusDisplayOfferEnum>
  >;

  selectedTypeDisplayLendContract: StatusDisplayLendContractEnum;
  setSelectedTypeDisplayLendContract: React.Dispatch<
    SetStateAction<StatusDisplayLendContractEnum>
  >;

  handleGetLendList: (
    params: GetListOfferParams,
    selectedType: StatusDisplayOfferEnum,
  ) => void;
  handleGetContractList: (
    params: GetListLendContractParams,
    selectedType: StatusDisplayLendContractEnum,
  ) => void;
  handleGetDataStatistic: () => void;
}

export interface PortfolioContextInterface {
  suppliedAssetData:  SuppliedAssetInterface | undefined;
  handleGetSuppliedAssets: () => Promise<void>;
  loanBorrowedData:  LoanBorrowedInterface[] | undefined;
  handleGetLoansBorrowed: () => Promise<void>;

  totalSupplyAsset: number;
  earnFromSuppliedAsset: number;

  systemSuppliedAssetData:  SuppliedAssetInterface | undefined;
  handleGetSystemSuppliedAssets: () => Promise<void>;
  systemLoanBorrowedData:  LoanBorrowedInterface[] | undefined;
  handleGetSystemLoansBorrowed: () => Promise<void>;

  systemTotalSupplyAsset: number;
  systemEarnFromSuppliedAsset: number;
}