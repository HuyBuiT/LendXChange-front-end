'use client';

import React, { ComponentPropsWithoutRef } from 'react';

import {
  CommonTd,
  CommonTr,
  CommonTable,
  CommonTBody,
  CommonPagination,
} from '@/components/common';

import { twMerge } from 'tailwind-merge';
import { useLendContext } from '@/context';
import { TokenDecimalsEnum } from '@/models';
import { useTranslation } from 'react-i18next';
import { AppConstant, LangConstant } from '@/const';
import { CommonUtils, DateUtils, FormatUtils } from '@/utils';

import DetailButton from '../DetailButton';
import StatusComponent from './StatusComponent';
import ContractTableHeader from './ContractTableHeader';
import AmountComponent from '../../open-offer/open-offer-table/AmountComponent';
import InterestComponent from '../../open-offer/open-offer-table/InterestComponent';

const RepaidContractTable: React.FC<RepaidContractTableProps> = ({
  className,
  onChangePaging,
  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { repaidContracts } = useLendContext();

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <CommonTable className="w-full">
        <ContractTableHeader />
        <CommonTBody>
          {repaidContracts.pageData.map((item, index) => {
            const waitingInterestAmount = FormatUtils.convertDisplayUnit(
              item.waitingInterest,
              TokenDecimalsEnum.USDC,
            );
            return (
              <CommonTr key={index}>
                <CommonTd>
                  <AmountComponent
                    amount={item.amount}
                    tokenSupported={item.token}
                  />
                </CommonTd>
                <CommonTd>
                  <InterestComponent
                    tokenSupported={item.token}
                    interest={CommonUtils.calculateInterestValue(
                      item.amount,
                      item.lendInterestPercent,
                      DateUtils.convertSecondsToDayHourMinute(item.duration)
                        .day,
                    )}
                    interestPercent={`${item.lendInterestPercent}%`}
                  />
                </CommonTd>
                <CommonTd>
                  <InterestComponent
                    tokenSupported={item.token}
                    interest={waitingInterestAmount}
                    interestPercent={`${CommonUtils.calculateTotalInterestPercent(
                      {
                        waitingInterestAmount,
                        lendingAmount: item.amount,
                        startDate: item.startDate,
                        endDate: item.endDateInterest,
                      },
                    )}%`}
                  />
                </CommonTd>
                <CommonTd>
                  <p>
                    {getHomeLabel('fmDays', {
                      duration: DateUtils.convertSecondsToDayHourMinute(
                        item.duration,
                      ).day,
                    })}
                  </p>
                </CommonTd>
                <CommonTd>
                  <StatusComponent dataContract={item} />
                </CommonTd>
                <CommonTd>
                  <DetailButton contractDetailData={item} />
                </CommonTd>
              </CommonTr>
            );
          })}
        </CommonTBody>
      </CommonTable>

      {repaidContracts.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={repaidContracts.pagination.pageNum}
          totalItem={repaidContracts.pagination.total}
          onChangePagination={onChangePaging}
        />
      )}
    </div>
  );
};

export default RepaidContractTable;

interface RepaidContractTableProps extends ComponentPropsWithoutRef<'div'> {
  onChangePaging: (dataPaging: { pageNum: number; pageSize: number }) => void;
}
