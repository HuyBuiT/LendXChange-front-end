'use client';

import React, { useMemo } from 'react';
import { CommonUtils } from '@/utils';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';
import { AppConstant, LangConstant } from '@/const';
import { OfferDataDetailViewInterface } from '@/models';
import { useAuthContext, useHomeContext } from '@/context';
import { CommonDialogProps } from '@/components/common/common-dialog';

import DetailRowItem, { DetailRowItemVariantEnum } from './DetailRowItem';

import ContentHeader from './ContentHeader';
import HeaderInfo from './HeaderInfo';

const OfferInfoDialog: React.FC<OfferInfoDialogProps> = ({
  isOpen,
  offerData,

  onClose,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { connectedChainAddress } = useAuthContext();
  const { bestOfferList, activeLoanList } = useHomeContext();

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
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="p-0 py-4"
      closeIconClassName="right-4"
      dialogTitle={
        <HeaderInfo
          selectedChain={offerData?.chain}
          selectedToken={offerData?.token}
          tokenOfferInfo={{
            value: offerData?.amount,
            duration: offerData?.durations,
          }}
        />
      }
      {...otherProps}
    >
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
    </CommonDialog>
  );
};

export default OfferInfoDialog;

interface OfferInfoDialogProps extends CommonDialogProps {
  offerData: OfferDataDetailViewInterface;
}
