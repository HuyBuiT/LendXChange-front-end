'use client';

import React, { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { LangConstant } from '@/const';
import { useTranslation } from 'react-i18next';
import { CaretIcon } from '@/components/icons';
import { twJoin, twMerge } from 'tailwind-merge';
import { LendContractViewInterface, TokenDecimalsEnum } from '@/models';
import { CommonUtils, DateUtils, FormatUtils } from '@/utils';

import LendAndWaitingInterest from '../../open-offer/open-offer-card/LendAndWaitingInterest';
import StatusComponent from '../contract-table/StatusComponent';
import ContractDetailDialog from '../contract-detail-dialog';
import ContractCardRow from './ContractCardRow';
import Image from 'next/image';

const LendContractCard: React.FC<LendContractCardProps> = ({
  className,
  contractData,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { lendInterest, waitingInterestAmount, waitingInterestPercent } =
    useMemo(() => {
      const totalOffersValue = CommonUtils.calculateInterestValue(
        contractData.amount,
        contractData.lendInterestPercent,
        DateUtils.convertSecondsToDayHourMinute(contractData.duration).day,
      );

      const waitingInterestAmount = FormatUtils.convertDisplayUnit(
        contractData.waitingInterest,
        TokenDecimalsEnum.USDC,
      );

      const waitingInterestPercent = CommonUtils.calculateTotalInterestPercent({
        waitingInterestAmount,
        lendingAmount: contractData.amount,
        startDate: contractData.startDate,
        endDate: contractData.endDateInterest,
      });

      return {
        lendInterest: totalOffersValue,
        waitingInterestAmount,
        waitingInterestPercent,
      };
    }, [contractData]);

  return (
    <>
      <button
        className={twMerge(
          'w-full',
          'py-4 px-5',
          'rounded-lg',
          'flex flex-col gap-y-2',
          'bg-characterBackground2',
          className,
        )}
        onClick={() => setIsOpenDialog(true)}
        {...otherProps}
      >
        <ContractCardRow
          label={
            <div className={twJoin('flex items-center gap-x-2')}>
              <Image
                src={CommonUtils.getTokenImageSrcByValue(contractData.token)}
                alt="Token image"
              />
              <p className="text-base text-neutral1">
                {FormatUtils.formatNumber(contractData.amount)}{' '}
                {contractData.token}
              </p>
            </div>
          }
        >
          <CaretIcon
            className="-rotate-90 text-neutral5"
            width={16}
            height={16}
          />
        </ContractCardRow>

        <ContractCardRow label={getLendLabel('lLendInterest')}>
          <LendAndWaitingInterest
            interest={lendInterest}
            interestPercent={contractData.lendInterestPercent}
            tokenImageSrc={CommonUtils.getTokenImageSrcByValue(
              contractData.token,
            )}
          />
        </ContractCardRow>

        <ContractCardRow label={getLendLabel('lWaitingInterest')}>
          <LendAndWaitingInterest
            interest={waitingInterestAmount}
            interestPercent={waitingInterestPercent}
            tokenImageSrc={CommonUtils.getTokenImageSrcByValue(
              contractData.token,
            )}
          />
        </ContractCardRow>
        <ContractCardRow label={getLabel('lDuration')}>
          <p className="text-sm">
            {getHomeLabel('fmDays', {
              duration: DateUtils.convertSecondsToDayHourMinute(
                contractData.duration,
              ).day,
            })}
          </p>
        </ContractCardRow>
        <ContractCardRow label={getLabel('lStatus')}>
          <StatusComponent dataContract={contractData} />
        </ContractCardRow>
      </button>

      <ContractDetailDialog
        contractDetailData={contractData}
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />
    </>
  );
};

export default LendContractCard;

interface LendContractCardProps extends ComponentPropsWithoutRef<'button'> {
  contractData: LendContractViewInterface;
}
