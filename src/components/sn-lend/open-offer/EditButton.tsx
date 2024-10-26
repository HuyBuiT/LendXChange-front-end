'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  OpenLendOfferViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  withEditLendOfferController,
  WithEditLendOfferComponentProps,
} from '@/components/hoc';

import {
  CommonButtonProps,
  CommonButtonVariantEnum,
} from '@/components/common/CommonButton';

import { LangConstant } from '@/const';
import { twMerge } from 'tailwind-merge';
import { useAppContext, useAuthContext, useLendContext } from '@/context';
import { EditIcon, RefreshIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonButton } from '@/components/common';

import OfferDetailDialog, {
  OfferDetailDialogVariantEnum,
} from './offer-detail-dialog';
import { Asset } from '@/models/app.model';

const EditButton: React.FC<EditButtonProps> = ({
  txHash,
  txStatus,
  className,
  txErrorMessage,
  detailOfferData,

  onResetData,
  onEditLendOffer,

  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { availableAssets } = useAppContext();
  const { connectedChainAddress } = useAuthContext();
  const { selectedTypeDisplayOffer, handleGetLendList } = useLendContext();

  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState<number>();

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return getHomeLabel('lUpdateOffer');
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return getLendLabel('lUpdateOffer');
    }
  }, [txStatus]);

  const handleEditLendOffer = async () => {
    if (!newValue || !connectedChainAddress) return;

    const lendAsset = availableAssets.get(detailOfferData.token);

    const data = {
      walletAddress: connectedChainAddress,
      interest: newValue,
      offerId: detailOfferData.offerId,
      lendAsset: lendAsset as Asset,
    };

    await onEditLendOffer(data);
  };

  const handleCloseEditDialog = () => {
    setIsOpen(false);
    setNewValue(detailOfferData.lendInterestPercent);

    onResetData();
  };

  const handleEditLendOfferSuccess = async () => {
    await handleGetLendList(
      { walletAddress: connectedChainAddress },
      selectedTypeDisplayOffer,
    );
    handleCloseEditDialog();
  };

  useEffect(() => {
    setNewValue(detailOfferData.lendInterestPercent);
  }, [detailOfferData.lendInterestPercent]);

  return (
    <>
      <CommonButton
        className={twMerge('w-full gap-x-1', className)}
        variant={CommonButtonVariantEnum.Edit}
        onClick={() => setIsOpen(true)}
        {...otherProps}
      >
        <EditIcon className="sm:hidden lg:block" />
        <p className="text-sm font-semibold">{getLendLabel('lEdit')}</p>
      </CommonButton>

      <OfferDetailDialog
        isOpen={isOpen}
        txStatus={txStatus}
        isDisable={Boolean(txHash)}
        txErrorMessage={txErrorMessage}
        newLendInterestValue={newValue}
        onClose={handleCloseEditDialog}
        detailOfferData={detailOfferData}
        variant={OfferDetailDialogVariantEnum.Edit}
        onChangeLendInterest={(value) => setNewValue(value)}
      >
        {newValue === detailOfferData.lendInterestPercent ? (
          <CommonButton
            className="w-full"
            onClick={handleCloseEditDialog}
            variant={CommonButtonVariantEnum.OutlinePrimary}
          >
            {getLabel('lCancel')}
          </CommonButton>
        ) : (
          <CommonButton
            className="w-full"
            onClick={
              txStatus === BlockchainTransactionStatusEnum.SUCCESS
                ? handleEditLendOfferSuccess
                : handleEditLendOffer
            }
            disabled={txStatus === BlockchainTransactionStatusEnum.LOADING}
          >
            {statusLabel}
          </CommonButton>
        )}
      </OfferDetailDialog>
    </>
  );
};

export default withEditLendOfferController(EditButton);

interface EditButtonProps
  extends CommonButtonProps,
    WithEditLendOfferComponentProps {
  detailOfferData: OpenLendOfferViewInterface;
}
