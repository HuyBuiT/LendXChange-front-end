'use client';

import React, { Fragment } from 'react';
import { DateUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { InfoIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonDialog, PercentageInput } from '@/components/common';
import { CommonDialogProps } from '@/components/common/common-dialog';

import {
  OpenLendOfferViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import DialogHeader from '@/components/sn-home/create-lend-offer-dialog/DialogHeader';
import DialogInterestDetail from '@/components/sn-home/create-lend-offer-dialog/DialogInterestDetail';

const OfferDetailDialog: React.FC<OfferDetailDialogProps> = ({
  isOpen,
  variant,
  children,
  txStatus,
  isDisable,
  txErrorMessage,
  detailOfferData,
  newLendInterestValue,

  onClose,
  onChangeLendInterest,
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const handleChangeInterestValue = (value: string) => {
    if (value && onChangeLendInterest instanceof Function) {
      onChangeLendInterest(Number(value));
    }
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={
        variant === OfferDetailDialogVariantEnum.Edit
          ? getLendLabel('lEditOffer')
          : getLendLabel('lCancelOffer')
      }
      titleClassName={twJoin('font-semibold', 'text-sm sm:text-lg')}
    >
      <div className={twJoin('mt-4 pt-6', 'border-t border-neutral7')}>
        <DialogHeader
          chain={detailOfferData.chain}
          token={detailOfferData.token}
          amount={detailOfferData.amount}
          durations={
            DateUtils.convertSecondsToDayHourMinute(detailOfferData.duration)
              .day
          }
        />

        {variant !== OfferDetailDialogVariantEnum.Cancel ? (
          <div className="border-b border-characterBackground2 pb-5">
            <span
              className={twJoin('mb-2 inline-block', 'text-sm font-medium')}
            >
              {getHomeLabel('lAPRForYourOffer')}
            </span>
            <PercentageInput
              className="w-full"
              wrapperInputClassName="w-full"
              onChangeValue={handleChangeInterestValue}
              defaultValue={detailOfferData.lendInterestPercent}
              disabled={isDisable}
            />
          </div>
        ) : (
          <Fragment />
        )}

        <DialogInterestDetail
          token={detailOfferData.token}
          variant={variant}
          durations={
            DateUtils.convertSecondsToDayHourMinute(detailOfferData.duration)
              .day
          }
          lendAmount={detailOfferData.amount}
          numberOffers={1}
          interestValue={
            newLendInterestValue &&
            newLendInterestValue !== detailOfferData.lendInterestPercent
              ? newLendInterestValue
              : detailOfferData.lendInterestPercent
          }
          lenderFee={detailOfferData.lenderFee}
          waitingInterest={detailOfferData.waitingInterest}
          startDate={detailOfferData.startDate}
          endDateInterest={detailOfferData.endDateInterest}
        />

        {children}

        {txStatus === BlockchainTransactionStatusEnum.FAILED ? (
          <span
            className={twJoin(
              'mt-4',
              'center-root gap-x-1',
              'text-warning2 text-center',
            )}
          >
            <InfoIcon />
            {txErrorMessage
              ? txErrorMessage
              : getHomeLabel('msgSomethingWentWrong')}
          </span>
        ) : (
          ''
        )}
      </div>
    </CommonDialog>
  );
};

export default OfferDetailDialog;

interface OfferDetailDialogProps extends CommonDialogProps {
  isOpen: boolean;
  isDisable?: boolean;
  txErrorMessage: string;
  newLendInterestValue?: number;
  variant: OfferDetailDialogVariantEnum;
  txStatus: BlockchainTransactionStatusEnum;
  detailOfferData: OpenLendOfferViewInterface;

  onClose: () => void;
  onChangeLendInterest?: (value: number) => void;
}

export const enum OfferDetailDialogVariantEnum {
  Default = 'default',
  Edit = 'edit',
  Cancel = 'cancel',
}
