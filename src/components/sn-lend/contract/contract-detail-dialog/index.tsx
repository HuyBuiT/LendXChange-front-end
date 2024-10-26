'use client';

import React, { useMemo } from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';
import { LendContractViewInterface, TokenDecimalsEnum } from '@/models';
import { CommonDialogProps } from '@/components/common/common-dialog';
import DetailContentDialog from '../../open-offer/content-detail-dialog';
import StatusComponent from '../contract-table/StatusComponent';
import { CommonUtils, FormatUtils } from '@/utils';

const ContractDetailDialog: React.FC<ContractDetailDialogProps> = ({
  isOpen,
  contractDetailData,

  onClose,
  ...otherProps
}) => {
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { waitingInterestAmount, waitingInterestPercent } = useMemo(() => {
    const waitingInterestAmount = FormatUtils.convertDisplayUnit(
      contractDetailData.waitingInterest,
      TokenDecimalsEnum.USDC,
    );

    const waitingInterestPercent = CommonUtils.calculateTotalInterestPercent({
      waitingInterestAmount,
      lendingAmount: contractDetailData.amount,
      startDate: contractDetailData.startDate,
      endDate: contractDetailData.endDateInterest,
    });

    return {
      waitingInterestAmount,
      waitingInterestPercent,
    };
  }, [contractDetailData]);

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={getLendLabel('lContractDetail')}
      titleClassName={twJoin('font-medium', 'text-sm sm:text-lg')}
      {...otherProps}
    >
      <div className={twJoin('mt-4 pt-6 mb-20', 'border-t border-neutral7')}>
        <DetailContentDialog
          chain={contractDetailData.chain}
          token={contractDetailData.token}
          amount={contractDetailData.amount}
          duration={contractDetailData.duration}
          lendInterest={contractDetailData.lendInterestPercent}
          statusLabel={<StatusComponent dataContract={contractDetailData} />}
          waitingInterestAmount={waitingInterestAmount}
          waitingInterestPercent={waitingInterestPercent}
          transactionHash={contractDetailData.transactionHash}
          lenderFee={contractDetailData.lenderFee}
          status={contractDetailData.status}
        />
      </div>
    </CommonDialog>
  );
};

export default ContractDetailDialog;

interface ContractDetailDialogProps extends CommonDialogProps {
  contractDetailData: LendContractViewInterface;
}
