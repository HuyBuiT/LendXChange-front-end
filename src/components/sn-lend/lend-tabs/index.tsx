'use client';

import React, { ComponentPropsWithoutRef, useMemo, useState } from 'react';

import {
  StatusDisplayOfferEnum,
  StatusDisplayLendContractEnum,
} from '@/context/LendProvider';

import { AppConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useAuthContext, useLendContext } from '@/context';
import { CommonPagination, TabsContent, TabsRoot } from '@/components/common';

import LendTabHeader from './LendTabHeader';
import SortContract from '../contract/SortContract';
import SortOpenOffer from '../open-offer/SortOpenOffer';
import LendContractCard from '../contract/contract-card';
import OpenOfferCard from '../open-offer/open-offer-card';

const LendTabs: React.FC<ComponentPropsWithoutRef<'div'>> = ({
  className,
  ...otherProps
}) => {
  const {
    lendOffers,
    openOffers,
    canceledOffers,
    lendContracts,
    activeContracts,
    repaidContracts,
    handleGetLendList,
    handleGetContractList,
    selectedTypeDisplayOffer,
    selectedTypeDisplayLendContract,
    setSelectedTypeDisplayOffer,
    setSelectedTypeDisplayLendContract,
  } = useLendContext();
  const { connectedChainAddress } = useAuthContext();

  const [selectedTab, setSelectedTab] = useState(LendTabEnum.OpenOffer);

  const listOffer = useMemo(() => {
    if (selectedTypeDisplayOffer === StatusDisplayOfferEnum.OPEN_OFFER) {
      return openOffers;
    } else if (
      selectedTypeDisplayOffer === StatusDisplayOfferEnum.CANCELED_OFFER
    ) {
      return canceledOffers;
    } else {
      return lendOffers;
    }
  }, [selectedTypeDisplayOffer, openOffers, canceledOffers, lendOffers]);

  const listLendContract = useMemo(() => {
    if (
      selectedTypeDisplayLendContract ===
      StatusDisplayLendContractEnum.ACTIVE_CONTRACT
    ) {
      return activeContracts;
    } else if (
      selectedTypeDisplayLendContract ===
      StatusDisplayLendContractEnum.REPAID_CONTRACT
    ) {
      return repaidContracts;
    } else {
      return lendContracts;
    }
  }, [
    selectedTypeDisplayLendContract,
    activeContracts,
    repaidContracts,
    lendContracts,
  ]);

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

  const handleGetContract = async (
    selectType: StatusDisplayLendContractEnum,
    pageNum = 1,
    pageSize = 5,
  ) => {
    const params = {
      walletAddress: connectedChainAddress,
      pageNum: pageNum,
      pageSize: pageSize,
    };

    await handleGetContractList(params, selectType);
  };

  return (
    <div className={twMerge('w-full', className)} {...otherProps}>
      <TabsRoot
        value={selectedTab}
        defaultValue={LendTabEnum.OpenOffer}
        className="w-full gap-y-4"
      >
        <LendTabHeader onChangeTab={(value) => setSelectedTab(value)} />

        <TabsContent value={LendTabEnum.OpenOffer}>
          <div className="flex flex-col gap-y-4">
            <SortOpenOffer
              totalItem={listOffer.pagination.total}
              onSelectOptionSort={(value) => {
                handleGetLend(
                  value,
                  value === StatusDisplayOfferEnum.OPEN_OFFER
                    ? openOffers.pagination.pageNum
                    : value === StatusDisplayOfferEnum.CANCELED_OFFER
                      ? canceledOffers.pagination.pageNum
                      : openOffers.pagination.pageNum,
                );
                setSelectedTypeDisplayOffer(value);
              }}
            />
            {listOffer.pageData.map((item, index) => (
              <OpenOfferCard key={index} openLendOfferData={item} />
            ))}

            {listOffer.pagination.total >
              AppConstant.SIZE_PAGINATION_DEFAULT && (
              <CommonPagination
                currentPage={listOffer.pagination.pageNum}
                totalItem={listOffer.pagination.total}
                onChangePagination={(data) =>
                  handleGetLend(
                    selectedTypeDisplayOffer,
                    data.pageNum,
                    data.pageSize,
                  )
                }
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value={LendTabEnum.Contract}>
          <div className="flex flex-col gap-y-4">
            <SortContract
              totalItem={listLendContract.pagination.total}
              onSelectOptionSort={(value) => {
                handleGetContract(
                  value,
                  value === StatusDisplayLendContractEnum.ACTIVE_CONTRACT
                    ? activeContracts.pagination.pageNum
                    : value === StatusDisplayLendContractEnum.REPAID_CONTRACT
                      ? repaidContracts.pagination.pageNum
                      : lendContracts.pagination.pageNum,
                );
                setSelectedTypeDisplayLendContract(value);
              }}
            />
            {listLendContract.pageData.map((item, index) => (
              <LendContractCard key={index} contractData={item} />
            ))}

            {listLendContract.pagination.total >
              AppConstant.SIZE_PAGINATION_DEFAULT && (
              <CommonPagination
                currentPage={listLendContract.pagination.pageNum}
                totalItem={listLendContract.pagination.total}
                onChangePagination={(data) =>
                  handleGetContract(
                    selectedTypeDisplayLendContract,
                    data.pageNum,
                    data.pageSize,
                  )
                }
              />
            )}
          </div>
        </TabsContent>
      </TabsRoot>
    </div>
  );
};

export default LendTabs;

export enum LendTabEnum {
  OpenOffer = 'Open Offer',
  Contract = 'Contract',
}
