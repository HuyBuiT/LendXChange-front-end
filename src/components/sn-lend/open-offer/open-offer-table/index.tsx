'use client';

import React, { ComponentPropsWithoutRef } from 'react';

import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { TabsRoot } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useAuthContext, useLendContext } from '@/context';
import { TabsContent, TabsList } from '@radix-ui/react-tabs';
import { LendTabTrigger } from '../../lend-tabs/LendTabHeader';
import { StatusDisplayOfferEnum } from '@/context/LendProvider';

import OpenTable from './OpenTable';
import CanceledTable from './CanceledTable';

const OpenOfferTable: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { connectedChainAddress } = useAuthContext();
  const {
    openOffers,
    canceledOffers,
    selectedTypeDisplayOffer,
    handleGetLendList,
    setSelectedTypeDisplayOffer,
  } = useLendContext();

  const handleGetLend = async (
    selectType: StatusDisplayOfferEnum,
    pageNum = 1,
    pageSize = 5,
  ) => {
    const params = {
      walletAddress: connectedChainAddress,
      pageNum: pageNum,
      pageSize: pageSize,
    };

    await handleGetLendList(params, selectType);
  };

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <p>{getLendLabel('lOpenOffer')}</p>

      <TabsRoot
        value={selectedTypeDisplayOffer}
        defaultValue={StatusDisplayOfferEnum.OPEN_OFFER}
        className="w-full"
      >
        <OpenOfferTab
          totalOpenOffer={openOffers.pagination.total}
          totalCanceledOffer={canceledOffers.pagination.total}
          onChangeTab={(value) => {
            handleGetLend(
              value,
              value === StatusDisplayOfferEnum.OPEN_OFFER
                ? openOffers.pagination.pageNum
                : canceledOffers.pagination.pageNum,
            );
            setSelectedTypeDisplayOffer(value);
          }}
        />

        <TabsContent value={StatusDisplayOfferEnum.OPEN_OFFER}>
          <OpenTable
            onChangePageNum={(data) =>
              handleGetLend(
                selectedTypeDisplayOffer,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>

        <TabsContent value={StatusDisplayOfferEnum.CANCELED_OFFER}>
          <CanceledTable
            onChangePageNum={(data) =>
              handleGetLend(
                selectedTypeDisplayOffer,
                data.pageNum,
                data.pageSize,
              )
            }
          />
        </TabsContent>
      </TabsRoot>
    </div>
  );
};

export default OpenOfferTable;

const OpenOfferTab: React.FC<OpenOfferTabProps> = ({
  totalOpenOffer,
  totalCanceledOffer,
  onChangeTab,
}) => {
  return (
    <TabsList className="w-full flex items-center">
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayOfferEnum.OPEN_OFFER}
        onClick={() => onChangeTab(StatusDisplayOfferEnum.OPEN_OFFER)}
      >
        {`Open Offer (${totalOpenOffer})`}
      </LendTabTrigger>
      <LendTabTrigger
        className="text-sm"
        value={StatusDisplayOfferEnum.CANCELED_OFFER}
        onClick={() => onChangeTab(StatusDisplayOfferEnum.CANCELED_OFFER)}
      >
        {`Canceled Offer (${totalCanceledOffer})`}
      </LendTabTrigger>
    </TabsList>
  );
};

interface OpenOfferTabProps extends ComponentPropsWithoutRef<'div'> {
  totalOpenOffer: number;
  totalCanceledOffer: number;
  onChangeTab: (value: StatusDisplayOfferEnum) => void;
}
