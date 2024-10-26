'use client';

import React, { useMemo, useState } from 'react';
import { CommonUtils, FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { OpenLendOfferViewInterface, TokenDecimalsEnum } from '@/models';
import { CommonButton, CommonDialog } from '@/components/common';
import {
  CommonButtonProps,
  CommonButtonVariantEnum,
} from '@/components/common/CommonButton';
import DetailContentDialog from './content-detail-dialog';

const DetailOfferButton: React.FC<DetailOfferButtonProps> = ({
  className,
  detailOfferData,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const getLabelCanceledStatus = (cancelTime: number) => {
    const timeLabel = CommonUtils.getTimeLabel(getLabel, cancelTime);

    return getLendLabel('fmCancelAgo', { time: timeLabel });
  };

  const { waitingInterestAmount, waitingInterestPercent } = useMemo(() => {
    const waitingInterestAmount = FormatUtils.convertDisplayUnit(
      detailOfferData.waitingInterest,
      TokenDecimalsEnum.USDC,
    );

    const waitingInterestPercent = CommonUtils.calculateTotalInterestPercent({
      waitingInterestAmount,
      lendingAmount: detailOfferData.amount,
      startDate: detailOfferData.startDate,
      endDate: detailOfferData.endDateInterest,
    });

    return {
      waitingInterestAmount,
      waitingInterestPercent,
    };
  }, [detailOfferData]);

  return (
    <>
      <CommonButton
        className={twMerge('w-full font-semibold', className)}
        variant={CommonButtonVariantEnum.Edit}
        onClick={() => setIsOpenDialog(true)}
        {...otherProps}
      >
        {getLendLabel('lDetail')}
      </CommonButton>

      <CommonDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        dialogTitle={getLendLabel('lCancelOfferDetail')}
        titleClassName={twJoin('font-medium', 'text-sm sm:text-lg')}
      >
        <div className={twJoin('mt-4 pt-6 mb-20', 'border-t border-neutral7')}>
          <DetailContentDialog
            chain={detailOfferData.chain}
            token={detailOfferData.token}
            amount={detailOfferData.amount}
            duration={detailOfferData.duration}
            lendInterest={detailOfferData.lendInterestPercent}
            statusLabel={getLabelCanceledStatus(detailOfferData.updatedAt)}
            waitingInterestAmount={waitingInterestAmount}
            waitingInterestPercent={waitingInterestPercent}
            transactionHash={detailOfferData.transactionHash}
            lenderFee={detailOfferData.lenderFee}
            status={detailOfferData.status}
          />
        </div>
      </CommonDialog>
    </>
  );
};

export default DetailOfferButton;

interface DetailOfferButtonProps extends CommonButtonProps {
  detailOfferData: OpenLendOfferViewInterface;
}
