'use client';

import React, { useMemo, useState } from 'react';
import { CommonUtils } from '@/utils';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { CommonTooltip } from '@/components/common';
import { AppConstant, LangConstant } from '@/const';
import { OfferDataDetailViewInterface } from '@/models';
import { useHomeContext, useAuthContext } from '@/context';

import {
  CommonTooltipProps,
  CommonTooltipVariantEnum,
} from '@/components/common/common-tooltip';

import HeaderInfo from './HeaderInfo';
import ContentHeader from './ContentHeader';

import DetailRowItem, { DetailRowItemVariantEnum } from './DetailRowItem';

const OfferInfoTooltip: React.FC<OfferInfoTooltipProps> = ({
  trigger,
  offerData,
  locationOffer,
  triggerClassName,
  contentClassName,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const heightContentTooltip =
    Number(document.getElementById('content-tooltip')?.offsetHeight) ||
    DEFAULT_HEIGHT_TOOLTIP;

  const { connectedChainAddress } = useAuthContext();
  const { bestOfferList, activeLoanList } = useHomeContext();

  const [isShowTooltip, setIsShowTooltip] = useState(false);

  const { bestOfferByTemplate, totalBestOffer } = useMemo(() => {
    if (!bestOfferList.length)
      return { bestOfferByTemplate: [], totalBestOffer: 0 };

    const data = bestOfferList.filter((item) => item.tierId === offerData.id);

    return {
      bestOfferByTemplate: data[0]?.bestOffers,
      totalBestOffer: data[0]?.totalBestOffer,
    };
  }, [bestOfferList, offerData]);

  const { activeLoanByTemplate, totalActiveLoans } = useMemo(() => {
    if (!activeLoanList.length)
      return { activeLoanByTemplate: [], totalActiveLoans: 0 };

    const data = activeLoanList.filter((item) => item.tierId === offerData.id);

    return {
      activeLoanByTemplate: data[0]?.activeLoans,
      totalActiveLoans: data[0]?.totalActiveLoans,
    };
  }, [activeLoanList, offerData]);

  return (
    <CommonTooltip
      isOpen={isShowTooltip}
      variant={CommonTooltipVariantEnum.Info}
      contentProps={{
        align: 'center',
        side: 'bottom',
        sideOffset:
          locationOffer >= heightContentTooltip
            ? 0
            : locationOffer - heightContentTooltip - 10,
        className: twJoin(
          'py-4',
          'mb-[-70px]',
          'w-[270px] !max-h-[calc(100vh-80px)] !overflow-y-scroll',
          contentClassName,
        ),
        id: 'content-tooltip',
      }}
      disableHoverableContent={true}
      trigger={
        <div
          onMouseEnter={() => setIsShowTooltip(true)}
          onMouseLeave={() => setIsShowTooltip(false)}
          className={twMerge('w-fit relative z-50', triggerClassName)}
        >
          {trigger}
        </div>
      }
      {...otherProps}
    >
      <HeaderInfo
        selectedChain={offerData?.chain}
        selectedToken={offerData?.token}
        tokenOfferInfo={{
          value: offerData.amount,
          duration: offerData.durations,
        }}
      />

      <ContentHeader
        label={getLabel('lBestOffers')}
        endLabel={getLabel('lStatus')}
        className="mt-3 mb-2"
      />

      <div className={twJoin('w-full', 'flex flex-col items-center')}>
        {bestOfferByTemplate?.map((item, index) => {
          return (
            <DetailRowItem
              key={index}
              interestPercent={item.interestPercent}
              endLabel={getHomeLabel('lNotTaken')}
              variant={DetailRowItemVariantEnum.Open}
              subLabel={
                item.lenderAddress === connectedChainAddress
                  ? `(${getHomeLabel('lYourOffer')})`
                  : ''
              }
            />
          );
        })}
        {totalBestOffer > AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER && (
          <p className="text-xs text-neutral5">
            {getHomeLabel('fmMore', {
              value: totalBestOffer - bestOfferByTemplate.length,
            })}
          </p>
        )}
      </div>

      <ContentHeader
        label={getLabel('lActiveLoan')}
        endLabel={getLabel('lTaken')}
        className="mt-3 mb-2"
      />

      <div className={twJoin('w-full', 'flex flex-col items-center')}>
        {activeLoanByTemplate?.map((item, index) => {
          return (
            <DetailRowItem
              key={index}
              interestPercent={item.interestPercent}
              subLabel={
                item.lenderAddress === connectedChainAddress
                  ? `(${getHomeLabel('lYourOffer')})`
                  : ''
              }
              variant={DetailRowItemVariantEnum.Filled}
              endLabel={getLabel('fmAgo', {
                value: CommonUtils.getTimeLabel(getLabel, item.startDate),
              })}
            />
          );
        })}
        {totalActiveLoans > AppConstant.DISPLAY_ACTIVE_LOAN_BEST_OFFER && (
          <p className="text-xs text-neutral5">
            {getHomeLabel('fmMore', {
              value: totalActiveLoans - activeLoanByTemplate.length,
            })}
          </p>
        )}
      </div>
    </CommonTooltip>
  );
};

export default OfferInfoTooltip;

interface OfferInfoTooltipProps extends CommonTooltipProps {
  locationOffer: number;
  triggerClassName?: string;
  contentClassName?: string;
  offerData: OfferDataDetailViewInterface;
}

const DEFAULT_HEIGHT_TOOLTIP = 582;
