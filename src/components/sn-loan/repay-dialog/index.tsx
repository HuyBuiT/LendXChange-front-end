'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  LoanContractViewInterface,
  BlockchainTransactionStatusEnum,
} from '@/models';

import {
  withRepayContractController,
  WithRepayContractComponentProps,
} from '@/components/hoc';

import { twJoin } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { RefreshIcon } from '@/components/icons';
import { CommonUtils, FormatUtils } from '@/utils';
import { AppConstant, LangConstant } from '@/const';
import { DialogHeader } from '../dialog-components';
import { useWindowSize } from '@/hooks/common-hooks';
import { CommonDialog, FeedbackPopup } from '@/components/common';
import { useAuthContext, useAppContext, useHomeContext } from '@/context';

import DialogContent from './DialogContent';
import ActionButton from './ActionButton';

const RepayDialog: React.FC<RepayDialogProps> = ({
  isOpen,
  txHash,
  txStatus,
  txErrorMessage,
  loanContractData,

  onClose,
  onResetData,
  onRepayContract,
}) => {
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);

  const { windowWidth } = useWindowSize();
  const { connectedChainAddress } = useAuthContext();
  const { accountInfo, availableAssets } = useAppContext();
  const { selectedChainTokensBalance } = useHomeContext();

  const [isOpenFeedbackPopup, setIsOpenFeedbackPopup] = useState(false);

  const statusLabel = useMemo(() => {
    switch (txStatus) {
      case BlockchainTransactionStatusEnum.FAILED:
        return getLoanLabel('fmRepay', {
          value: `${FormatUtils.formatNumber(loanContractData.totalRepay)} ${
            loanContractData.token
          }`,
        });
      case BlockchainTransactionStatusEnum.LOADING:
        return <RefreshIcon className="text-white animate-spin" />;
      case BlockchainTransactionStatusEnum.SUCCESS:
        return getHomeLabel('lSuccessfully');

      default:
        return getLoanLabel('fmRepay', {
          value: `${FormatUtils.formatNumber(loanContractData.totalRepay)} ${
            loanContractData.token
          }`,
        });
    }
  }, [txStatus, loanContractData]);

  const isInsufficientBalance = useMemo(() => {
    return (
      CommonUtils.getBalanceByChainAndToken({
        token: loanContractData.token,
        balanceMap: selectedChainTokensBalance,
      }) < loanContractData.totalRepay &&
      txStatus !== BlockchainTransactionStatusEnum.SUCCESS
    );
  }, [loanContractData, selectedChainTokensBalance, txStatus]);

  const handleRepayContract = async () => {
    const collateralAsset = availableAssets.get(
      loanContractData.collateral.token,
    );
    const lendAsset = availableAssets.get(loanContractData.token);

    if (!collateralAsset || !lendAsset) return;

    const data = {
      tierId: loanContractData.tierId,
      loanOfferId: loanContractData.loanOfferId,
      walletAddress: connectedChainAddress,
      collateralAsset,
      lendAsset,
      collateralSymbol: loanContractData.collateral.token,
      repayCoin: Math.floor(
        loanContractData.totalRepay * Math.pow(10, lendAsset.decimals),
      ),
    };

    await onRepayContract(data);
  };

  const handleRepaySuccess = async () => {
    onResetData();
    onClose();
  };

  useEffect(() => {
    if (
      txStatus === BlockchainTransactionStatusEnum.SUCCESS &&
      accountInfo.showFeedbackOnRepay
    ) {
      onClose();
      setIsOpenFeedbackPopup(true);
    }
  }, [txStatus]);

  return (
    <>
      <CommonDialog
        isOpen={isOpen}
        onClose={() => {
          onResetData();
          onClose();
        }}
        closeIconClassName="right-4"
        isShowIconClose={windowWidth <= AppConstant.BREAK_POINTS.sm}
        contentClassName={twJoin('px-0', 'flex flex-col', 'h-[80vh] sm:h-auto')}
      >
        <DialogHeader
          isShowCollateral={true}
          headerLabel={getLoanLabel('lRepay')}
          loanContractData={loanContractData}
        />
        <DialogContent loanContractData={loanContractData} />

        <ActionButton
          disabled={
            txStatus === BlockchainTransactionStatusEnum.LOADING ||
            (!Boolean(txHash) && isInsufficientBalance)
          }
          onClick={
            txStatus === BlockchainTransactionStatusEnum.SUCCESS
              ? handleRepaySuccess
              : handleRepayContract
          }
          loanContractData={loanContractData}
          statusLabel={statusLabel}
          errorMsg={
            isInsufficientBalance
              ? getHomeLabel('lInsufficientFund')
              : txStatus === BlockchainTransactionStatusEnum.FAILED
                ? txErrorMessage
                  ? txErrorMessage
                  : getHomeLabel('msgSomethingWentWrong')
                : ''
          }
        />
      </CommonDialog>

      <FeedbackPopup
        paramsPost={{ ...accountInfo, showFeedbackOnRepay: false }}
        isOpen={isOpenFeedbackPopup}
        onClose={() => setIsOpenFeedbackPopup(false)}
      />
    </>
  );
};

export default withRepayContractController(RepayDialog);

interface RepayDialogProps extends WithRepayContractComponentProps {
  isOpen: boolean;
  onClose: () => void;
  loanContractData: LoanContractViewInterface;
}
