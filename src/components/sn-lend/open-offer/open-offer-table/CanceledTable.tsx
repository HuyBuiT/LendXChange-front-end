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
import { useTranslation } from 'react-i18next';
import { AppConstant, LangConstant } from '@/const';
import { LendStatus, TokenDecimalsEnum } from '@/models';
import { CommonUtils, DateUtils, FormatUtils } from '@/utils';
import { StatusDisplayOfferEnum } from '@/context/LendProvider';

import AmountComponent from './AmountComponent';
import InterestComponent from './InterestComponent';
import OpenOfferTableHeader from './OpenOfferTableHeader';
import DetailOfferButton from '../DetailOfferButton';

const CanceledTable: React.FC<CanceledTableProps> = ({
  className,
  onChangePageNum,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLendLabel } = useTranslation(LangConstant.NS_LEND);

  const { canceledOffers } = useLendContext();

  const getLabelCanceledStatus = (cancelTime: number) => {
    const timeLabel = CommonUtils.getTimeLabel(getLabel, cancelTime);

    return getLendLabel('fmCancelAgo', { time: timeLabel });
  };

  return (
    <div
      className={twMerge('flex flex-col gap-y-4', className)}
      {...otherProps}
    >
      <CommonTable className="w-full">
        <OpenOfferTableHeader type={StatusDisplayOfferEnum.CANCELED_OFFER} />
        <CommonTBody>
          {canceledOffers.pageData.map((item, index) => (
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
                    DateUtils.convertSecondsToDayHourMinute(item.duration).day,
                  )}
                  interestPercent={`${item.lendInterestPercent}%`}
                />
              </CommonTd>
              <CommonTd>
                <InterestComponent
                  tokenSupported={item.token}
                  interest={FormatUtils.convertDisplayUnit(
                    item.waitingInterest,
                    TokenDecimalsEnum.USDC,
                  )}
                  interestPercent={
                    item.waitingInterest || item.status !== LendStatus.CREATED
                      ? `${CommonUtils.calculateTotalInterestPercent({
                          waitingInterestAmount: FormatUtils.convertDisplayUnit(
                            item.waitingInterest,
                            TokenDecimalsEnum.USDC,
                          ),
                          lendingAmount: item.amount,
                          startDate: item.startDate,
                          endDate: item.endDateInterest,
                        })}%`
                      : getLendLabel('lUpdating')
                  }
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
                <p>{getLabelCanceledStatus(item.updatedAt)}</p>
              </CommonTd>
              <CommonTd>
                <DetailOfferButton detailOfferData={item} />
              </CommonTd>
            </CommonTr>
          ))}
        </CommonTBody>
      </CommonTable>
      {canceledOffers.pagination.total >
        AppConstant.SIZE_PAGINATION_DEFAULT && (
        <CommonPagination
          currentPage={canceledOffers.pagination.pageNum}
          totalItem={canceledOffers.pagination.total}
          onChangePagination={(data) => onChangePageNum(data)}
        />
      )}
    </div>
  );
};

export default CanceledTable;

interface CanceledTableProps extends ComponentPropsWithoutRef<'div'> {
  onChangePageNum: (dataPaging: { pageNum: number; pageSize: number }) => void;
}
