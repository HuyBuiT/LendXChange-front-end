'use client';

import React, { Fragment, useMemo } from 'react';

import { FormatUtils } from '@/utils';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { roundUp } from '@/utils/common.utils';
import { CommonButton } from '@/components/common';
import { useAuthContext, useAppContext } from '@/context';
import { InfoIcon, RefreshIcon } from '@/components/icons';

import {
  LoanContractViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  withWithdrawCollateralController,
  WithWithdrawCollateralComponentProps,
} from '@/components/hoc';

const WithdrawButton: React.FC<WithdrawButtonProps> = ({
  newCollateral,
  newHealthRatio,
  loanContractData,

  withdrawProps,
  onClose,
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { connectedChainAddress } = useAuthContext();
  const { selectedChain, selectedChainTokensPriceFeed, availableAssets } =
    useAppContext();

  const { txStatus, txErrorMessage, onWithdrawCollateral } = withdrawProps;

  const differentValue = useMemo(() => {
    return FormatUtils.formatNumber(
      Math.abs(loanContractData.collateral.amount - newCollateral),
      6,
    );
  }, [newCollateral, loanContractData]);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return getLoanLabel('fmWithdraw', {
          value: `${differentValue} ${loanContractData.collateral.token}`,
        });
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return getLoanLabel('fmWithdraw', {
          value: `${differentValue} ${loanContractData.collateral.token}`,
        });
    }
  }, [txStatus, differentValue, loanContractData]);

  const minCollateral = useMemo(() => {
    const minRatio = Number(process.env.NORMAL_HEALTH_RATIO);

    const selectedCollateralPriceFeed = selectedChainTokensPriceFeed.get(
      loanContractData.collateral.token,
    )?.price;

    if (!selectedCollateralPriceFeed) return 0;

    return FormatUtils.formatNumber(
      roundUp(
        (minRatio * loanContractData.amount) / selectedCollateralPriceFeed,
        6,
      ),
      6,
    );
  }, [loanContractData, selectedChain, selectedChainTokensPriceFeed]);

  const errorMessage = useMemo(() => {
    if (newHealthRatio < Number(process.env.NORMAL_HEALTH_RATIO)) {
      return getHomeLabel('fmMinCollateral', { value: minCollateral });
    }

    if (txStatus === BlockchainTransactionStatusEnum.FAILED) {
      return txErrorMessage
        ? txErrorMessage
        : getHomeLabel('msgSomethingWentWrong');
    }

    return '';
  }, [minCollateral, newHealthRatio, txStatus, txErrorMessage]);

  const handleWithdrawCollateral = async () => {
    const collateralAsset = availableAssets.get(
      loanContractData.collateral.token,
    );
    const lendAsset = availableAssets.get(loanContractData.token);

    if (!collateralAsset || !lendAsset) return;

    const data = {
      loanOfferId: loanContractData.loanOfferId,
      tierId: loanContractData.tierId,
      amount: Math.floor(
        Number(differentValue) * Math.pow(10, collateralAsset.decimals),
      ),
      walletAddress: connectedChainAddress,
      collateralAsset,
      lendAsset,
      collateralSymbol: loanContractData.collateral.token,
    };

    await onWithdrawCollateral(data);
  };

  return (
    <div className={twJoin('w-full', 'gap-y-2', 'flex flex-col items-center')}>
      <CommonButton
        className="w-full h-11"
        onClick={
          txStatus === BlockchainTransactionStatusEnum.SUCCESS
            ? onClose
            : handleWithdrawCollateral
        }
        disabled={
          newHealthRatio < Number(process.env.NORMAL_HEALTH_RATIO) ||
          txStatus === BlockchainTransactionStatusEnum.LOADING
        }
      >
        {statusLabel}
      </CommonButton>

      {errorMessage ? (
        <span
          className={twJoin('flex items-center', 'gap-x-1', 'text-warning2')}
        >
          <InfoIcon />
          {errorMessage}
        </span>
      ) : (
        <Fragment />
      )}
    </div>
  );
};

export default withWithdrawCollateralController(WithdrawButton);

interface WithdrawButtonProps {
  newCollateral: number;
  newHealthRatio: number;
  loanContractData: LoanContractViewInterface;

  withdrawProps: WithWithdrawCollateralComponentProps;

  onClose: () => void;
}
