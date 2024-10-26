import {
  KaminoMarket,
  DEFAULT_RECENT_SLOT_DURATION_MS,
} from '@kamino-finance/klend-sdk';

import {
  refactorBestOffers,
  refactorActiveLoans,
  refactorOfferTemplatesData,
} from './helper';

import {
  NetworkModeEnum,
  SupportedChainEnum,
  ActiveLoanListViewInterface,
  OfferDataDetailViewInterface,
} from '@/models';

import { AppConstant } from '@/const';
import { HomeService } from '@/services';
import { KioskClient, Network } from '@mysten/kiosk';
import { Scallop } from '@scallop-io/sui-scallop-sdk';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

import * as web3 from '@solana/web3.js';

const useHomeHooks = () => {
  const mainnetClient = new SuiClient({
    url: getFullnodeUrl(NetworkModeEnum.MAIN_NET),
  });

  const kioskClient = new KioskClient({
    client: mainnetClient as any,
    network: Network.MAINNET,
  });

  const handleGetOfferTemplates = async (selectedChain: SupportedChainEnum) => {
    const responseData =
      await HomeService.getOfferTemplatesService(selectedChain);

    if (!responseData) return [];

    const offerTemplatesData = responseData?.pageData;

    if (!offerTemplatesData?.length) return [];

    const refactoredData = refactorOfferTemplatesData(offerTemplatesData);

    return refactoredData as OfferDataDetailViewInterface[];
  };

  const handleGetBestOffersByTemplates = async (
    templateIds: string[],
    selectedChain: SupportedChainEnum,
  ) => {
    if (!templateIds.length) return [];

    const promises = templateIds.map((templateId) => {
      return HomeService.getBestOffersDashboard(templateId, selectedChain);
    });

    const responses = await Promise.all(promises);

    const bestOffers = responses.map((responseData, index) => {
      const refactorData = refactorBestOffers(
        templateIds[index],
        responseData?.pageData,
      );

      return {
        ...refactorData,
        totalBestOffer: responseData?.total || 0,
      };
    });

    return bestOffers;
  };

  const handleGetActiveLoanListByTemplate = async (
    templateIds: string[],
    selectedChain: SupportedChainEnum,
  ) => {
    if (!templateIds.length) return [];

    const activeLoans = await Promise.all(
      templateIds.map(async (templateId) => {
        const responseData = await HomeService.getLoansByTemplateId(
          templateId,
          selectedChain,
        );

        const refactorData = refactorActiveLoans(
          templateId,
          responseData?.pageData,
        );

        return {
          ...refactorData,
          totalActiveLoans: responseData?.total || 0,
        };
      }),
    );

    return activeLoans as ActiveLoanListViewInterface[];
  };
  const handleCheckHasNft = async (walletAddress: string) => {
    let currentData = [];
    let isHasNft = false;
    let pageNum = 1;

    do {
      const res = await HomeService.getAssetsByOwner(walletAddress, pageNum);

      if (!res) return false;

      currentData = res.items;

      const listCreatorAddress = process.env.LIST_CREATOR_ADDRESS || '';
      const listCreatorAddressSplit = listCreatorAddress.split(',');

      isHasNft = currentData.some((data: any) => {
        if (!data.creators || !data.grouping) return false;

        const isCreator =
          data.creators &&
          data.creators.length === 2 &&
          data.creators[0].address === listCreatorAddressSplit[0] &&
          data.creators[1].address === listCreatorAddressSplit[1];

        const isCollection = data.grouping.some((item: any) => {
          return (
            item.group_key === 'collection' &&
            item.group_value === process.env.COLLECTION_ID
          );
        });

        return isCollection && isCreator;
      });

      if (isHasNft) {
        break;
      }

      pageNum++;
    } while (currentData.length > 0);

    return isHasNft;
  };

  const handleCheckHasSuiNft = async (walletAddress: string) => {
    let hasNft = false;
    try {
      let hasNextPage;
      let nextCursor;

      do {
        const response: any = await mainnetClient?.getOwnedObjects({
          owner: walletAddress,
          cursor: nextCursor,
          filter: {
            StructType: AppConstant.SUI_NFT_BETA_CHECK_COIN_TYPE,
          },
        });

        const allCoins = response.data;

        if (allCoins.length > 0) {
          hasNft = true;
          break;
        } else {
          hasNft = false;
        }

        nextCursor = response.nextCursor;
        hasNextPage = response.hasNextPage;
      } while (hasNextPage);
    } catch (error) {
      console.log('error', error);
      hasNft = false;
    }

    return hasNft;
  };

  const handleCheckHasSuiNftFromKiosk = async (walletAddress: string) => {
    try {
      let hasNft = false;
      let hasNextPage;
      let nextCursor;

      do {
        const response = await kioskClient.getOwnedKiosks({
          address: walletAddress,
          pagination: {
            cursor: nextCursor as any,
          },
        });

        const res = response.kioskIds.some(async (item) => {
          const nftType = AppConstant.SUI_NFT_BETA_CHECK_COIN_TYPE;
          const { items } = await kioskClient.getKiosk({
            id: item,
            options: { objectOptions: { showContent: true } },
          });

          return items.some((item) => item.type === nftType);
        });

        if (res) {
          hasNft = true;
          break;
        }

        nextCursor = response.nextCursor;
        hasNextPage = response.hasNextPage;
      } while (hasNextPage);

      return hasNft;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleGetAllNft = async (walletAddress: string) => {
    let currentData = [];
    let listNft: any[] = [];
    let pageNum = 1;

    do {
      const res = await HomeService.getAssetsByOwner(walletAddress, pageNum);

      currentData = res?.items;

      if (!res) return [];

      listNft = [...listNft, ...res.items];

      pageNum++;
    } while (currentData.length > 0);

    return listNft;
  };

  const handleGetInterestKamino = async () => {
    try {
      const connection = new web3.Connection(
        String(process.env.RPC_URL),
        'finalized',
      );

      const market = await KaminoMarket.load(
        connection,
        new web3.PublicKey(AppConstant.KAMINO_MAIN_MARKET_ADDRESS),
        DEFAULT_RECENT_SLOT_DURATION_MS,
      );

      if (!market) return 0;
      await market.loadReserves();
      const reserve = market.getReserveBySymbol('USDC');

      const slot = await connection.getSlot();

      return reserve?.totalSupplyAPY(slot) || 0;
    } catch (error) {
      console.log('error', error);

      return 0;
    }
  };

  const handleGetInterestNavi = async () => {
    const res = await HomeService.getInterestNavi();

    if (res) {
      const resData: any = Object.values(res).filter(
        (item: any) => item?.pool === 'USDC-Sui' && item?.symbol === 'USDC',
      );
      const supplyRate = parseFloat(resData[0].supply_rate);
      const boosted = parseFloat(resData[0].boosted);

      return supplyRate + boosted;
    } else {
      return 0;
    }
  };

  const handleGetInterestScallop = async () => {
    const scallopSDK = new Scallop({
      networkType: NetworkModeEnum.MAIN_NET,
    });

    const scallopQuery = await scallopSDK.createScallopIndexer();

    const usdcMarketSpool = await scallopQuery.getSpool('susdc');

    const usdcMarketPool = await scallopQuery.getMarketPool('usdc');

    let totalApy = usdcMarketPool.supplyApy;

    if (
      !isNaN(usdcMarketSpool.rewardApr) &&
      isFinite(usdcMarketSpool.rewardApr)
    ) {
      totalApy += usdcMarketSpool.rewardApr;
    }
    return totalApy * 100;
  };

  return {
    handleGetAllNft,
    handleCheckHasNft,
    handleCheckHasSuiNft,
    handleGetInterestNavi,
    handleGetInterestKamino,
    handleGetOfferTemplates,
    handleGetInterestScallop,
    handleCheckHasSuiNftFromKiosk,
    handleGetBestOffersByTemplates,
    handleGetActiveLoanListByTemplate,
  };
};

export default useHomeHooks;
