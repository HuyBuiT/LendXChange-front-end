'use client';

import React, { Fragment, useMemo } from 'react';
import { LangConstant } from '@/const';
import { twJoin } from 'tailwind-merge';
import { InfoIcon, RefreshIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonUtils, FormatUtils } from '@/utils';
import { CommonButton } from '@/components/common';
import {
  LoanContractViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';
import { useHomeContext, useAppContext, useAuthContext } from '@/context';

import { WithDepositCollateralComponentProps } from '@/components/hoc';
import { Asset } from '@/models/app.model';

const DepositButton: React.FC<DepositButtonProps> = ({
  newCollateral,
  loanContractData,

  depositProps,

  onClose,
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { availableAssets } = useAppContext();
  const { connectedChainAddress } = useAuthContext();
  const { selectedChainTokensBalance } = useHomeContext();

  const { txStatus, txErrorMessage, onDepositCollateral } = depositProps;

  const differentValue = useMemo(() => {
    return FormatUtils.formatNumber(
      Math.abs(loanContractData.collateral.amount - newCollateral),
      6,
    );
  }, [newCollateral, loanContractData]);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return getLoanLabel('fmDeposit', {
          value: `${differentValue} ${loanContractData.collateral.token}`,
        });
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return getLoanLabel('fmDeposit', {
          value: `${differentValue} ${loanContractData.collateral.token}`,
        });
    }
  }, [txStatus, differentValue, loanContractData]);

  const currentCollateralBalance = useMemo(() => {
    return CommonUtils.getBalanceByChainAndToken({
      token: loanContractData.collateral.token,
      balanceMap: selectedChainTokensBalance,
    });
  }, [selectedChainTokensBalance, loanContractData]);

  const errorMessage = useMemo(() => {
    if (currentCollateralBalance - 0.01 < Number(differentValue)) {
      return getHomeLabel('lInsufficientFund');
    }
    if (txStatus === BlockchainTransactionStatusEnum.FAILED) {
      return txErrorMessage
        ? txErrorMessage
        : getHomeLabel('msgSomethingWentWrong');
    }

    return '';
  }, [currentCollateralBalance, differentValue, txStatus, txErrorMessage]);

  const handleDepositCollateral = async () => {
    const lendAsset = availableAssets.get(loanContractData.token);

    const collateralAsset = availableAssets.get(
      loanContractData.collateral.token,
    );

    if (!collateralAsset) return;

    const data = {
      loanOfferId: loanContractData.loanOfferId,
      tierId: loanContractData.tierId,
      amount: Math.floor(
        Number(differentValue) * Math.pow(10, collateralAsset.decimals),
      ),
      walletAddress: connectedChainAddress,
      collateralAsset,
      lendAsset: lendAsset as Asset,
      collateralSymbol: loanContractData.collateral.token,
    };

    await onDepositCollateral(data);
  };

  return (
    <div className={twJoin('w-full', 'gap-y-2', 'flex flex-col items-center')}>
      <CommonButton
        className="w-full h-11"
        onClick={
          txStatus === BlockchainTransactionStatusEnum.SUCCESS
            ? onClose
            : handleDepositCollateral
        }
        disabled={
          currentCollateralBalance - 0.01 < Number(differentValue) ||
          txStatus === BlockchainTransactionStatusEnum.LOADING
        }
      >
        {statusLabel}
      </CommonButton>

      {errorMessage ? (
        <span
          className={twJoin('gap-x-1', 'text-warning2', 'flex items-center')}
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

export default DepositButton;

interface DepositButtonProps {
  newCollateral: number;
  loanContractData: LoanContractViewInterface;
  depositProps: WithDepositCollateralComponentProps;

  onClose: () => void;
}
