import { AppConstant } from '@/const';
import { AppService } from '@/services';
import { AccountInfoInterface } from '@/models';
import { handleRefactorSolPriceFeeds } from './helper';
import {
  Asset,
  GetAssetsQueryParams,
  SupportTokenType,
} from '@/models/app.model';

const useAppService = () => {
  const handleGetTokensPriceFeed = async (
    availableAssetsMap: Map<SupportTokenType, Asset>,
  ) => {
    const data =
      await AppService.getSolTokensPriceFeedService(availableAssetsMap);

    if (!data) return AppConstant.INIT_PRICE_FEED;

    const refactorPriceFeedData = handleRefactorSolPriceFeeds(
      data,
      availableAssetsMap,
    );

    return refactorPriceFeedData;
  };

  const handleGetAccountInfo = async () => {
    const res = await AppService.getAccountInfo();

    if (res) {
      return {
        showFeedbackOnRepay: res.metadata.show_feedback_on_repay,
        showFeedbackOnCancel: res.metadata.show_feedback_on_cancel,
      };
    } else {
      return {} as AccountInfoInterface;
    }
  };

  const handlePostAccountSetting = async (params: AccountInfoInterface) => {
    const res = AppService.accountSetting(params);

    return res;
  };

  const getAssets = async (params: GetAssetsQueryParams) => {
    const res = await AppService.getAssets(params);

    return res?.data || [];
  };

  return {
    handleGetAccountInfo,
    handlePostAccountSetting,
    handleGetTokensPriceFeed,
    getAssets,
  };
};

export default useAppService;
