import { ApiConstant } from '@/const';
import { ApiResponse } from 'apisauce';
import { createPriceFeedApi } from '../config';
import { PriceFeedsResponseInterface } from '@/models';
import { Asset, SupportTokenType } from '@/models/app.model';
import { isNil } from 'lodash';

export const getSolTokensPriceFeedService = async (
  availableAssets: Map<SupportTokenType, Asset>,
) => {
  if (!availableAssets.size) return undefined;
  const assets = Array.from(availableAssets, ([, asset]) => asset).filter(
    (asset) => !isNil(asset.priceFeedId),
  );
  if (assets.length == 0) return undefined;
  let queryString = '?';

  assets.forEach((asset) => {
    queryString += `ids[]=${asset.priceFeedId}&`;
  });

  const url = ApiConstant.GET_LATEST_PRICE_FEEDS + queryString;

  const response: ApiResponse<PriceFeedsResponseInterface[]> =
    await createPriceFeedApi('https://hermes-beta.pyth.network' + '/api').get(url);

  if (!response.status) return undefined;

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
};
