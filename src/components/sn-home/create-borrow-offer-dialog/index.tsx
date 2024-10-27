'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { twJoin } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { roundUp } from '@/utils/common.utils';
import { CommonButton } from '@/components/common';
import { CommonUtils, FormatUtils } from '@/utils';
import { LangConstant, PathConstant } from '@/const';
import { CommonDialogProps } from '@/components/common/common-dialog';
import { InfoHexaIcon, InfoIcon, RefreshIcon } from '@/components/icons';
import { useAuthContext, useAppContext, useHomeContext } from '@/context';

import {
  SupportTokenType,
  SupportedChainEnum,
  SuiSupportedTokenEnum,
  SolanaSupportedTokenEnum,
  OfferDataDetailViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  withCreateBorrowController,
  WithCreateBorrowComponentProps,
} from '@/components/hoc';

import TokenAmountInput from '@/components/common/token-amount-input';
import CommonDialog from '@/components/common/common-dialog';
import DialogInterestDetail from './DialogInterestDetail';
import BorrowDialogHeader from './BorrowDialogHeader';
import SelectChainButton from './SelectChainButton';
import CurrentAddress from './CurrentAddress';
import InfoTooltip from '../InfoTooltip';

const CreateBorrowOfferDialog: React.FC<CreateBorrowOfferDialogProps> = ({
  isOpen,
  txHash,
  txStatus,
  offerData,
  txErrorMessage,

  onClose,
  onBorrow,
  onResetData,
  ...otherProps
}) => {
  const router = useRouter();
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { availableAssets } = useAppContext();
  const { connectedChainAddress } = useAuthContext();
  const {
    selectedChainTokensBalance,
    setCrossChainAddress,
    setSelectedChainTokensBalance,
  } = useHomeContext();
  const { selectedChain, selectedChainTokensPriceFeed, handleGetPriceFeeds } =
    useAppContext();

  const [collateralValue, setCollateralValue] = useState(0);
  const defaultTokens = new Map<SupportedChainEnum, SupportTokenType>([
    [SupportedChainEnum.Sui, SuiSupportedTokenEnum.SUI],
  ]);
  const defaultToken =
    defaultTokens.get(selectedChain) || SolanaSupportedTokenEnum.SOL;

  const [selectedToken, setSelectedToken] =
    useState<SupportTokenType>(defaultToken);
  const [isShowCollateralTooltip, setIsShowCollateralTooltip] = useState(false);

  const minRatio = Number(process.env.NORMAL_HEALTH_RATIO);

  const minCollateral = useMemo(() => {
    const selectedCollateralPriceFeed =
      selectedChainTokensPriceFeed.get(selectedToken)?.price;

    if (!selectedCollateralPriceFeed) return 0;

    const updatedMinRatio =
      minRatio + Number(process.env.FLUCTUATIONS_MINT_COLLATERAL);

    return Number(
      roundUp(
        (updatedMinRatio * offerData.amount) / selectedCollateralPriceFeed,
        6,
      ),
    );
  }, [offerData, selectedChain, selectedToken, selectedChainTokensPriceFeed]);

  const balance = useMemo(() => {
    return CommonUtils.getBalanceByChainAndToken({
      token: selectedToken,
      balanceMap: selectedChainTokensBalance,
    });
  }, [selectedToken, selectedChainTokensBalance]);

  const convertedInputAmount = useMemo(() => {
    return (
      (selectedChainTokensPriceFeed.get(selectedToken)?.price || 0) *
      collateralValue
    );
  }, [
    selectedToken,
    collateralValue,
    selectedChain,
    selectedChainTokensPriceFeed,
  ]);

  const healthRatioValue = useMemo(() => {
    return convertedInputAmount / offerData.amount;
  }, [convertedInputAmount, offerData]);

  const isInsufficientBalance = useMemo(() => {
    return (
      CommonUtils.getBalanceByChainAndToken({
        token: selectedToken,
        balanceMap: selectedChainTokensBalance,
      }) < collateralValue &&
      txStatus !== BlockchainTransactionStatusEnum.SUCCESS
    );
  }, [selectedToken, selectedChainTokensBalance, collateralValue]);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return (
          <>
            {getHomeLabel('fmBorrowToken', {
              token: `${FormatUtils.formatNumber(offerData.amount)}`,
            })}
            <span className="uppercase">{SolanaSupportedTokenEnum.USDC}</span>
          </>
        );
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return (
          <>
            {getHomeLabel('fmBorrowToken', {
              token: `${FormatUtils.formatNumber(offerData.amount)}`,
            })}
            <span className="uppercase">{SolanaSupportedTokenEnum.USDC}</span>
          </>
        );
    }
  }, [txStatus, offerData]);

  const isDisabledBorrowAction = useMemo(() => {
    return (
      !collateralValue ||
      isInsufficientBalance ||
      txStatus === BlockchainTransactionStatusEnum.LOADING ||
      healthRatioValue < minRatio
    );
  }, [
    collateralValue,
    isInsufficientBalance,
    txHash,
    txStatus,
    healthRatioValue,
  ]);

  const handleChangeValue = (value: string) => {
    if (value === null || value === undefined) {
      setCollateralValue(0);
    } else {
      setCollateralValue(Number(value));
    }
  };

  const handleBorrow = async () => {
    if (
      !offerData?.bestOfferData?.lenderAddress ||
      offerData?.bestOfferData?.lenderAddress === connectedChainAddress
    )
      return;

    const lendAsset = availableAssets.get(offerData.token as SupportTokenType);

    const collateralAsset = availableAssets.get(selectedToken);

    if (!collateralAsset || !lendAsset) return;

    const data = {
      collateralAsset,
      lendAsset,
      collateralAmount:
        collateralValue * Math.pow(10, collateralAsset.decimals),
      interest: offerData.borrowInterest,
      walletAddress: connectedChainAddress,
      lenderAddress: offerData.bestOfferData.lenderAddress,
      lendOfferId: offerData.bestOfferData.offerId,
      tierId: offerData.id,
      collateralSymbol: selectedToken,
    };

    await onBorrow(data);
  };

  const handleRedirectBorrowSuccess = () => {
    router.push(PathConstant.LOAN);
  };

  const handleReset = () => {
    setSelectedChainTokensBalance(new Map());
    setCrossChainAddress('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const priceFeedInterval = setInterval(() => {
      handleGetPriceFeeds(selectedChain);
    }, 5000);

    return () => {
      clearInterval(priceFeedInterval);
    };
  }, [isOpen, selectedChain]);
  return (
    <CommonDialog
      isOpen={isOpen}
      isShowIconClose={false}
      onClose={() => {
        onClose();
        onResetData();
        setCollateralValue(0);
        handleReset();
      }}
      contentClassName="p-0 pt-4"
      {...otherProps}
    >
      <div className="w-full pb-6 px-4">
        <BorrowDialogHeader
          chain={offerData.chain}
          token={offerData.token}
          amount={offerData.amount}
          durations={offerData.durations}
          borrowInterest={offerData.borrowInterest}
        />

        <div className={twJoin('mt-5 mb-3', 'w-full', 'space-between-root')}>
          <span
            className={twJoin(
              'font-medium',
              'inline-block',
              'text-sm text-neutral1',
              'flex items-center gap-x-1',
            )}
          >
            <>
              {getHomeLabel('lCollateral')}

              <InfoTooltip
                isOpen={isShowCollateralTooltip}
                contentTooltip={getHomeLabel('msgContentCollateralTooltip')}
                onChangeOpen={(value) => setIsShowCollateralTooltip(value)}
              />
            </>
          </span>

          <div className="flex items-center gap-x-[2px]">
            <SelectChainButton
              selectChainBorrow={selectedChain}
              // To do: update when implement gross chain
              onSelectChainBorrow={(value) => {
                console.log(value);
              }}
            />

            <CurrentAddress walletAddress={connectedChainAddress} />
          </div>
        </div>

        <TokenAmountInput
          balance={balance}
          token={defaultToken}
          minValue={minCollateral}
          selectedChain={selectedChain}
          onChangeValue={handleChangeValue}
          convertedBalance={convertedInputAmount}
          onSelectToken={(value) => {
            setCollateralValue(0);
            setSelectedToken(value);
          }}
          disabled={Boolean(txHash)}
        />

        {collateralValue && collateralValue >= minCollateral ? (
          <Fragment />
        ) : (
          <div className={twJoin('flex items-center gap-x-1', 'text-warning2')}>
            <InfoHexaIcon />
            <p className="my-3">
              {getHomeLabel('fmMinCollateral', {
                value: `${FormatUtils.formatNumber(
                  minCollateral,
                  6,
                )} ${selectedToken}`,
              })}
            </p>
          </div>
        )}

        <DialogInterestDetail
          token={offerData.token}
          healthRatio={healthRatioValue}
          durations={offerData.durations}
          borrowAmount={offerData.amount}
          borrowFee={offerData.borrowFee}
          borrowInterest={offerData.borrowInterest}
        />

        <CommonButton
          className={twJoin('py-3', 'w-full', 'center-root gap-x-1')}
          disabled={isDisabledBorrowAction}
          onClick={
            txStatus === BlockchainTransactionStatusEnum.SUCCESS
              ? handleRedirectBorrowSuccess
              : handleBorrow
          }
        >
          {statusLabel}
        </CommonButton>

        {isInsufficientBalance ? (
          <span
            className={twJoin(
              'center-root gap-x-1 mt-3',
              'text-warning2 text-center',
            )}
          >
            <InfoIcon />
            {getHomeLabel('lInsufficientFund')}
          </span>
        ) : (
          ''
        )}

        {txStatus === BlockchainTransactionStatusEnum.FAILED ? (
          <span
            className={twJoin(
              'center-root gap-x-1 mt-3',
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

export default withCreateBorrowController(CreateBorrowOfferDialog);

interface CreateBorrowOfferDialogProps
  extends CommonDialogProps,
    WithCreateBorrowComponentProps {
  offerData: OfferDataDetailViewInterface;
}
