'use client';

import React, {
  useMemo,
  Fragment,
  useState,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';

import {
  TokenDecimalsEnum,
  SupportedChainEnum,
  SolanaSupportedTokenEnum,
} from '@/models';

import { ImageAssets } from 'public';
import { LangConstant } from '@/const';
import { useAppContext } from '@/context';
import { useTranslation } from 'react-i18next';
import { twMerge, twJoin } from 'tailwind-merge';
import { CommonUtils, FormatUtils } from '@/utils';
import { OfferDetailDialogVariantEnum } from '@/components/sn-lend/open-offer/offer-detail-dialog';
import InfoTooltip from '../InfoTooltip';
import Image from 'next/image';

const DialogInterestDetail: React.FC<DialogInterestDetailProps> = ({
  token,
  variant = OfferDetailDialogVariantEnum.Default,
  durations,
  lendAmount,
  numberOffers,
  interestValue,

  lenderFee,
  waitingInterest,
  startDate = 0,
  endDateInterest = 0,
}) => {
  const { selectedChain } = useAppContext();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const [isShowLenderFeeTooltip, setIsShowTooltipWaitingInterest] =
    useState(false);
  const [isShowWaitingInterestTooltip, setIsShowWaitingInterestTooltip] =
    useState(false);

  const interestTokenValue = useMemo(() => {
    if (variant === OfferDetailDialogVariantEnum.Cancel)
      return FormatUtils.formatNumber(0);

    const totalOffersValue = CommonUtils.calculateInterestValue(
      lendAmount,
      interestValue,
      durations,
      numberOffers,
    );

    return FormatUtils.formatNumber(totalOffersValue || 0);
  }, [lendAmount, interestValue, numberOffers]);

  const waitingTokenValue = useMemo(() => {
    const totalOffersWaitingValue = FormatUtils.convertDisplayUnit(
      waitingInterest,
      TokenDecimalsEnum.USDC,
    );

    return FormatUtils.formatNumber(totalOffersWaitingValue || 0);
  }, [waitingInterest]);

  const waitingInterestPercent = useMemo(() => {
    return CommonUtils.calculateTotalInterestPercent({
      waitingInterestAmount: FormatUtils.convertDisplayUnit(
        waitingInterest,
        TokenDecimalsEnum.USDC,
      ),
      lendingAmount: lendAmount,
      startDate,
      endDate: endDateInterest,
    });
  }, [lendAmount, startDate, waitingInterest]);

  const lenderFeeTokenValue = useMemo(() => {
    const totalOffersFeeValue = Number(interestTokenValue) * (lenderFee / 100);

    return FormatUtils.formatNumber(totalOffersFeeValue || 0);
  }, [interestTokenValue, lenderFee]);

  const getMinimumReceive = () => {
    if (variant === OfferDetailDialogVariantEnum.Cancel) {
      return FormatUtils.formatNumber(lendAmount + Number(waitingTokenValue));
    }

    return FormatUtils.formatNumber(
      lendAmount * numberOffers +
        Number(interestTokenValue) +
        Number(waitingTokenValue) -
        Number(lenderFeeTokenValue),
    );
  };

  const { label, imageUrl } = useMemo(() => {
    switch (selectedChain) {
      case SupportedChainEnum.Sui:
        return { label: 'Scallop', imageUrl: ImageAssets.ScallopLogoImage };
      default:
        return { label: '', imageUrl: '' };
    }
  }, [selectedChain]);

  return (
    <div className={twJoin('mt-4 mb-6', 'gap-y-4', 'flex flex-col')}>
      <InterestItemDetail
        token={token}
        startLabel={getHomeLabel('lInterest')}
        endLabel={interestTokenValue}
        prefix={`(${Number(interestValue)}%)`}
      />
      <InterestItemDetail
        className="!items-start"
        token={token}
        startLabel={
          <>
            <span className="flex item-center gap-x-2">
              <p>
                {getHomeLabel(
                  variant === OfferDetailDialogVariantEnum.Default
                    ? 'lWaitingAPY'
                    : 'lWaitingInterest',
                )}
              </p>

              <InfoTooltip
                isOpen={isShowWaitingInterestTooltip}
                onChangeOpen={(value) => setIsShowWaitingInterestTooltip(value)}
                contentTooltip={getHomeLabel(
                  'msgContentWaitingInterestTooltip',
                )}
              />
            </span>

            {label && (
              <span className="flex item-center gap-x-1 text-xs text-neutral5">
                {getHomeLabel('fmFundsSecurely', {
                  value: label,
                })}

                <Image src={imageUrl} alt="" className="w-[18px] h-[18px]" />
              </span>
            )}
          </>
        }
        startClassName="flex flex-col"
        endLabel={waitingTokenValue}
        prefix={
          variant === OfferDetailDialogVariantEnum.Default
            ? `${Number(FormatUtils.formatNumber(waitingInterest, 2))}%`
            : `(${Number(waitingInterestPercent)}%)`
        }
        endClassName={twJoin(
          variant === OfferDetailDialogVariantEnum.Default && 'hidden',
        )}
        isShowTokenImage={variant !== OfferDetailDialogVariantEnum.Default}
        prefixClassName={twJoin(
          variant === OfferDetailDialogVariantEnum.Default &&
            'text-brandTertiary text-base',
        )}
      />
      <InterestItemDetail
        token={token}
        startLabel={
          <>
            <p>{getHomeLabel('lLenderFee')}</p>

            <InfoTooltip
              isOpen={isShowLenderFeeTooltip}
              onChangeOpen={(value) => setIsShowTooltipWaitingInterest(value)}
              contentTooltip={getHomeLabel('msgContentLenderFeeTooltip')}
            />
          </>
        }
        endLabel={lenderFeeTokenValue}
        startClassName="flex items-center gap-x-2"
      />
      <InterestItemDetail
        token={token}
        startLabel={getHomeLabel('lMinimumYouWillReceive')}
        endLabel={getMinimumReceive()}
        prefix=""
      />
    </div>
  );
};

export default DialogInterestDetail;

interface DialogInterestDetailProps {
  token: SolanaSupportedTokenEnum;
  durations: number;
  lendAmount: number;
  numberOffers: number;
  interestValue: number;
  lenderFee: number;
  waitingInterest: number;
  variant?: OfferDetailDialogVariantEnum;
  startDate?: number;
  endDateInterest?: number;
}

export const InterestItemDetail: React.FC<InterestItemDetailProps> = ({
  isShowTokenImage = true,
  prefixClassName,
  startClassName,
  endClassName,
  className,
  startLabel,
  endLabel,
  prefix,
  token,
}) => {
  return (
    <div className={twMerge('w-full', 'space-between-root', className)}>
      <div className={twJoin('text-neutral5', startClassName)}>
        {startLabel}
      </div>

      <div className={twJoin('gap-x-2', 'flex items-center')}>
        <span className={twMerge('text-sm text-neutral5', prefixClassName)}>
          {prefix}
        </span>
        <span className={twMerge('text-neutral1', endClassName)}>
          {endLabel}
        </span>

        {isShowTokenImage ? (
          <Image
            width={24}
            height={24}
            alt="Token logo"
            src={CommonUtils.getTokenImageSrcByValue(token)}
          />
        ) : (
          <Fragment />
        )}
      </div>
    </div>
  );
};

interface InterestItemDetailProps extends ComponentPropsWithoutRef<'div'> {
  isShowTokenImage?: boolean;
  prefixClassName?: string;
  startClassName?: string;
  endClassName?: string;
  startLabel: ReactNode;
  endLabel: ReactNode;
  prefix?: string;
  token: SolanaSupportedTokenEnum;
}
