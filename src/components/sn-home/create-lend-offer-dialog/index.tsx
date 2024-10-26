'use client';

import React, { useMemo, useState } from 'react';

import {
  CommonButton,
  CommonDialog,
  PercentageInput,
} from '@/components/common';

import {
  withCreateLendOfferController,
  WithCreateLendOfferComponentProps,
} from '@/components/hoc';

import {
  SupportTokenType,
  OfferDataDetailViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import { twJoin } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { InfoIcon, RefreshIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonUtils, FormatUtils } from '@/utils';
import { LangConstant, PathConstant } from '@/const';
import { useAuthContext, useAppContext, useHomeContext } from '@/context';

import { CommonDialogProps } from '@/components/common/common-dialog';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

import DialogHeader from './DialogHeader';
import DialogInterestDetail from './DialogInterestDetail';

const CreateLendOfferDialog: React.FC<CreateLendOfferDialogProps> = ({
  isOpen,
  txHash,
  txStatus,
  offerData,
  txErrorMessage,

  onClose,
  onResetData,
  onCreateLendOffer,

  ...otherProps
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const router = useRouter();

  const { availableAssets } = useAppContext();
  const { connectedChainAddress } = useAuthContext();

  const { selectedChainTokensBalance, interestCreateOffer } = useHomeContext();

  const [interestValue, setInterestValue] = useState(0);
  const [numberOffers, setNumberOffers] = useState(1);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return (
          <div className="flex items-center gap-x-1">
            {getHomeLabel('fmLendToken', {
              token: `${FormatUtils.formatNumber(
                offerData.amount * numberOffers,
              )}`,
            })}

            <span className="uppercase">{offerData.token}</span>
          </div>
        );
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return (
          <div className="flex items-center gap-x-1">
            {getHomeLabel('fmLendToken', {
              token: `${FormatUtils.formatNumber(
                offerData.amount * numberOffers,
              )}`,
            })}

            <span className="uppercase">{offerData.token}</span>
          </div>
        );
    }
  }, [txStatus, offerData, numberOffers]);

  const isInsufficientBalance = useMemo(() => {
    return (
      CommonUtils.getBalanceByChainAndToken({
        token: offerData.token,
        balanceMap: selectedChainTokensBalance,
      }) <
        numberOffers * offerData.amount &&
      txStatus !== BlockchainTransactionStatusEnum.SUCCESS
    );
  }, [selectedChainTokensBalance, numberOffers, offerData]);

  const isDisabledInteraction = useMemo(() => {
    return Boolean(txHash);
  }, [txHash]);

  const isDisabledCreateOfferButton = useMemo(() => {
    return (
      !interestValue ||
      txStatus === BlockchainTransactionStatusEnum.LOADING ||
      isInsufficientBalance
    );
  }, [isInsufficientBalance, interestValue, txStatus, txHash]);

  const handleChangeInterestValue = (value: string) => {
    if (!value) return;

    setInterestValue(Number(value));
  };

  const handleCreateLend = async () => {
    const lendAsset = availableAssets.get(offerData.token as SupportTokenType);

    if (!lendAsset) return;

    const data = {
      lendAsset,
      walletAddress: connectedChainAddress,
      numberOfOffer: numberOffers,
      interest: interestValue,
      tierId: offerData.id,
      lendCoin: Math.floor(offerData.amount * Math.pow(10, lendAsset.decimals)),
    };

    await onCreateLendOffer(data);
  };

  const handleRedirectCreateLendSuccess = () => {
    router.push(PathConstant.LEND);
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      isShowIconClose={false}
      onClose={() => {
        onClose();
        onResetData();
        setNumberOffers(1);
        setInterestValue(0);
      }}
      {...otherProps}
    >
      <DialogHeader
        chain={offerData.chain}
        token={offerData.token}
        amount={offerData.amount}
        durations={offerData.durations}
      />

      <span className={twJoin('mb-2 inline-block', 'text-sm font-medium')}>
        {getHomeLabel('lAPRForYourOffer')}
      </span>
      <PercentageInput
        className="w-full"
        wrapperInputClassName="w-full"
        disabled={isDisabledInteraction}
        defaultValue={offerData.bestOffer}
        onChangeValue={handleChangeInterestValue}
      />

      <span
        className={twJoin('mb-2 mt-5', ' inline-block', 'text-sm font-medium')}
      >
        {getHomeLabel('lNumberOffers')}
      </span>
      <div
        className={twJoin(
          'pb-6',
          'w-full',
          'gap-x-3',
          'space-between-root',
          'border-b border-characterBackground2',
        )}
      >
        {PREFIX_NUMBER_OFFERS.map((value, index) => {
          return (
            <CommonButton
              key={index}
              className="w-full text-xl"
              disabled={isDisabledInteraction}
              onClick={() => setNumberOffers(value)}
              variant={
                numberOffers === value
                  ? CommonButtonVariantEnum.Primary
                  : CommonButtonVariantEnum.Outline
              }
            >
              {value}
            </CommonButton>
          );
        })}
      </div>

      <DialogInterestDetail
        token={offerData.token}
        durations={offerData.durations}
        lendAmount={offerData.amount}
        numberOffers={numberOffers}
        interestValue={interestValue}
        lenderFee={offerData.lendFee}
        waitingInterest={interestCreateOffer}
      />

      <CommonButton
        onClick={
          txStatus === BlockchainTransactionStatusEnum.SUCCESS
            ? handleRedirectCreateLendSuccess
            : handleCreateLend
        }
        disabled={isDisabledCreateOfferButton}
        className={twJoin('py-3', 'mb-4', 'w-full', 'center-root')}
      >
        {statusLabel}
      </CommonButton>

      {isInsufficientBalance ? (
        <span
          className={twJoin('center-root gap-x-1', 'text-warning2 text-center')}
        >
          <InfoIcon />
          {getHomeLabel('lInsufficientFund')}
        </span>
      ) : txStatus === BlockchainTransactionStatusEnum.FAILED ? (
        <span
          className={twJoin('center-root gap-x-1', 'text-warning2 text-center')}
        >
          <InfoIcon />
          {txErrorMessage
            ? txErrorMessage
            : getHomeLabel('msgSomethingWentWrong')}
        </span>
      ) : (
        ''
      )}
    </CommonDialog>
  );
};

export default withCreateLendOfferController(CreateLendOfferDialog);

interface CreateLendOfferDialogProps
  extends CommonDialogProps,
    WithCreateLendOfferComponentProps {
  offerData: OfferDataDetailViewInterface;
}

export const PREFIX_NUMBER_OFFERS = [1, 2, 5, 10];
