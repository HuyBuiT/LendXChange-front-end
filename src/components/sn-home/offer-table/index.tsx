'use client';

import React, { Fragment, useState } from 'react';

import {
  CommonTr,
  CommonTd,
  CommonTable,
  CommonTBody,
  CommonButton,
} from '@/components/common';

import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonUtils, FormatUtils } from '@/utils';
import { AppConstant, LangConstant } from '@/const';
import { useWindowSize } from '@/hooks/common-hooks';
import { MenuTwoLineIcon } from '@/components/icons';
import { OfferDataDetailViewInterface } from '@/models';
import { useAuthContext, useHomeContext } from '@/context';
import { OfferInfoDialog, OfferInfoTooltip } from '../offers-info';
import { BorrowButton, LendButton } from '../offers-action-buttons';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

import Image from 'next/image';
import HomeTableHead from './HomeTableHead';
import CreateLendOfferDialog from '../create-lend-offer-dialog';
import CreateBorrowOfferDialog from '../create-borrow-offer-dialog';

const OfferTable: React.FC<OfferTableProps> = ({ offerTableData }) => {
  const { t: getLabel } = useTranslation(LangConstant.NS_HOME);

  const { windowWidth } = useWindowSize();

  const { setIsOpenNoCollaboratorDialog, isHasNft } = useHomeContext();
  const { isWalletConnected, setIsOpenConnectDialog } = useAuthContext();

  const [isOpenBorrowDialog, setIsOpenBorrowDialog] = useState(false);
  const [isOpenOfferInfoDialog, setIsOpenOfferInfoDialog] = useState(false);
  const [isOpenCreateLendDialog, setIsShowCreateLendDialog] = useState(false);

  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  const handleOpenCreateBorrowDialog = (index: number) => {
    if (!isWalletConnected) {
      setIsOpenConnectDialog(true);
      return;
    }

    if (!isHasNft) {
      setIsOpenNoCollaboratorDialog(true);
      return;
    }

    if (!offerTableData[index].bestOffer) return;

    setSelectedOfferIndex(index);
    setIsOpenBorrowDialog(true);
  };

  const handleOpenCreateLendDialog = (index: number) => {
    if (!isWalletConnected) {
      setIsOpenConnectDialog(true);
      return;
    }

    if (!isHasNft) {
      setIsOpenNoCollaboratorDialog(true);
      return;
    }

    setSelectedOfferIndex(index);
    setIsShowCreateLendDialog(true);
  };

  const handleGetLocationOffer = (id: string) => {
    const element = document.getElementById(id);
    const viewportHeight = window.innerHeight;

    if (!element) return 0;

    return viewportHeight - element.getBoundingClientRect().bottom;
  };

  return (
    <>
      <CommonTable className="w-full">
        <HomeTableHead />
        <CommonTBody>
          {offerTableData.map((item, index: number) => (
            <CommonTr key={index}>
              {windowWidth >= AppConstant.BREAK_POINTS.lg ? (
                <CommonTd
                  className={twJoin(
                    'p-0',
                    'absolute',
                    'bg-transparent',
                    'w-[70%] h-full',
                  )}
                >
                  <div className="w-full h-full" id={`id-${index}`}>
                    <OfferInfoTooltip
                      locationOffer={handleGetLocationOffer(`id-${index}`)}
                      offerData={item}
                      trigger={<span className="w-full h-full" />}
                      triggerClassName="w-full h-full"
                      contentClassName={index < 2 ? '-mb-[178px]' : ''}
                    />
                  </div>
                </CommonTd>
              ) : (
                <Fragment />
              )}

              <CommonTd
                className={twJoin(
                  'uppercase',
                  'sm:px-2 md:px-4',
                  'flex items-center gap-x-2',
                )}
              >
                {item.amount ? (
                  <>
                    <div className={twJoin('relative')}>
                      <Image
                        width={32}
                        height={32}
                        alt={`${item.token} token`}
                        src={CommonUtils.getTokenImageSrcByValue(item.token)}
                      />
                      {/* <Image
                        width={21}
                        height={21}
                        alt={`${item.chain} chain`}
                        src={CommonUtils.getChainImageSrcByValue(item.chain)}
                        className={twJoin(
                          "absolute -right-1 -bottom-1",
                          "border border-neutral4 rounded-full"
                        )}
                      /> */}
                    </div>
                    {FormatUtils.formatNumber(item.amount)} {item.token}
                  </>
                ) : (
                  '--'
                )}
              </CommonTd>

              <CommonTd
                className={twJoin(
                  'sm:px-1 md:px-4 min-w-20',
                  item.bestOffer && 'text-success3',
                )}
              >
                {item.bestOffer ? `${item.bestOffer}%` : '--'}
              </CommonTd>

              <CommonTd className="sm:px-1 md:px-4">
                {item.durations
                  ? getLabel('fmDays', { duration: item.durations })
                  : '--'}
              </CommonTd>

              <CommonTd className="sm:px-1 md:px-4">
                {FormatUtils.convertLargeNumber(
                  item.volume,
                  AppConstant.USD_FORMAT,
                ) || '--'}
              </CommonTd>

              <CommonTd className="lg:px-0 sm:px-1 md:px-2">
                <LendButton onClick={() => handleOpenCreateLendDialog(index)} />
              </CommonTd>

              <CommonTd className="lg:px-0 sm:px-1 md:px-2">
                <BorrowButton
                  onClick={() => handleOpenCreateBorrowDialog(index)}
                />
              </CommonTd>

              <CommonTd className="lg:px-0 sm:px-1 md:px-2 lg:hidden">
                <CommonButton
                  variant={CommonButtonVariantEnum.Grey}
                  onClick={() => {
                    setSelectedOfferIndex(index);
                    setIsOpenOfferInfoDialog(true);
                  }}
                >
                  <MenuTwoLineIcon />
                </CommonButton>
              </CommonTd>
            </CommonTr>
          ))}
        </CommonTBody>
      </CommonTable>

      <CreateLendOfferDialog
        isOpen={isOpenCreateLendDialog}
        offerData={offerTableData[selectedOfferIndex]}
        onClose={() => setIsShowCreateLendDialog(false)}
      />

      <CreateBorrowOfferDialog
        isOpen={isOpenBorrowDialog}
        offerData={offerTableData[selectedOfferIndex]}
        onClose={() => setIsOpenBorrowDialog(false)}
      />

      <OfferInfoDialog
        isOpen={isOpenOfferInfoDialog}
        offerData={offerTableData[selectedOfferIndex]}
        onClose={() => setIsOpenOfferInfoDialog(false)}
      />
    </>
  );
};

export default OfferTable;

interface OfferTableProps {
  offerTableData: OfferDataDetailViewInterface[];
}
