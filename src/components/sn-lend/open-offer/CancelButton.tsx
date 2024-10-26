'use client';

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonButton, FeedbackPopup } from '@/components/common';
import {
  useAppContext,
  useAuthContext,
  useHomeContext,
  useLendContext,
} from '@/context';
import { CloseIcon, RefreshIcon } from '@/components/icons';

import {
  OpenLendOfferViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  withCancelLendOfferController,
  WithCancelLendOfferComponentProps,
} from '@/components/hoc';

import OfferDetailDialog, {
  OfferDetailDialogVariantEnum,
} from './offer-detail-dialog';
import { Asset } from '@/models/app.model';

const CancelButton: React.FC<CancelButtonProps> = ({
  txStatus,
  className,
  txErrorMessage,
  detailOfferData,

  onResetData,
  onCancelLendOffer,

  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { connectedChainAddress } = useAuthContext();
  const { handleGetBalancesByChain } = useHomeContext();
  const { accountInfo, selectedChain, availableAssets } = useAppContext();
  const {
    handleGetLendList,
    handleGetDataStatistic,
    selectedTypeDisplayOffer,
  } = useLendContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFeedbackPopup, setIsOpenFeedbackPopup] = useState(false);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return getLendLabel('lCancelOffer');
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return getLendLabel('lCancelOffer');
    }
  }, [txStatus]);

  const handleCancelLendOffer = async () => {
    if (!connectedChainAddress) return;

    const lendAsset = availableAssets.get(detailOfferData.token);

    const data = {
      walletAddress: connectedChainAddress,
      offerId: detailOfferData.offerId,
      lendAsset: lendAsset as Asset,
    };

    await onCancelLendOffer(data);
  };

  const handleCancelLendOfferSuccess = async () => {
    await handleGetLendList(
      { walletAddress: connectedChainAddress },
      selectedTypeDisplayOffer,
    );
    handleCloseEditDialog();
  };

  const handleCloseEditDialog = () => {
    setIsOpen(false);

    onResetData();
  };

  const handleCloseFeedbackPopup = async () => {
    handleGetBalancesByChain(selectedChain, connectedChainAddress);
    handleGetLendList(
      { walletAddress: connectedChainAddress },
      selectedTypeDisplayOffer,
    );
    handleGetDataStatistic();

    setIsOpenFeedbackPopup(false);
  };

  useEffect(() => {
    if (
      txStatus === BlockchainTransactionStatusEnum.SUCCESS &&
      accountInfo.showFeedbackOnCancel
    ) {
      setIsOpen(false);
      setIsOpenFeedbackPopup(true);
    }
  }, [txStatus, accountInfo]);

  return (
    <>
      <button
        className={twMerge(
          'w-full',
          'rounded-lg',
          'text-error2',
          'px-3 py-2.5',
          'bg-error2/15',
          'center-root gap-x-1',
          className,
        )}
        onClick={() => setIsOpen(true)}
        {...otherProps}
      >
        <CloseIcon width={16} height={16} className="sm:hidden lg:block" />
        <p className="text-sm font-semibold">{getLabel('lCancel')}</p>
      </button>

      <OfferDetailDialog
        isOpen={isOpen}
        txStatus={txStatus}
        txErrorMessage={txErrorMessage}
        onClose={handleCloseEditDialog}
        detailOfferData={detailOfferData}
        variant={OfferDetailDialogVariantEnum.Cancel}
      >
        <CommonButton
          disabled={txStatus === BlockchainTransactionStatusEnum.LOADING}
          onClick={
            txStatus === BlockchainTransactionStatusEnum.SUCCESS
              ? handleCancelLendOfferSuccess
              : handleCancelLendOffer
          }
          className={twMerge('w-full', 'bg-error2 hover:bg-error2/70')}
        >
          {statusLabel}
        </CommonButton>
      </OfferDetailDialog>

      <FeedbackPopup
        paramsPost={{ ...accountInfo, showFeedbackOnCancel: false }}
        isOpen={isOpenFeedbackPopup}
        onClose={handleCloseFeedbackPopup}
      />
    </>
  );
};

export default withCancelLendOfferController(CancelButton);

interface CancelButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    WithCancelLendOfferComponentProps {
  detailOfferData: OpenLendOfferViewInterface;
}
