import { AppConstant } from '@/const';
import { PriceFeedsResponseInterface } from '@/models';
import { Asset, SupportTokenType } from '@/models/app.model';

export const handleRefactorSolPriceFeeds = (
  data: PriceFeedsResponseInterface[],
  availableAssets: Map<SupportTokenType, Asset>,
) => {
  if (!data || !data.length) return AppConstant.INIT_PRICE_FEED;
  const priceFeeds = new Map();

  Array.from(availableAssets.values()).map((asset, index) => {
    if (!asset.priceFeedId) return;

    const price =
      Number(data[index].price.price) * Math.pow(10, data[index].price.expo);
    priceFeeds.set(asset.symbol, {
      price: isNaN(price) ? 0 : price,
      priceFeedIf: asset.priceFeedId,
    });
  });

  return priceFeeds;
};
