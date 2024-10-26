'use client';

import React, { useState, useMemo, useEffect } from 'react';

import { CommonUtils } from '@/utils';
import { twJoin } from 'tailwind-merge';
import { InfoIcon } from '@/components/icons';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';
import { AppConstant, LangConstant } from '@/const';
import { DialogHeader } from '../dialog-components';
import { useWindowSize } from '@/hooks/common-hooks';
import { LoanContractViewInterface } from '@/models';
import { useHomeContext, useAppContext, useAuthContext } from '@/context';

import {
  withDepositCollateralController,
  withWithdrawCollateralController,
  WithDepositCollateralComponentProps,
  WithWithdrawCollateralComponentProps,
} from '@/components/hoc';

import SelectChainButton from '@/components/sn-home/create-borrow-offer-dialog/SelectChainButton';
import CurrentAddress from '@/components/sn-home/create-borrow-offer-dialog/CurrentAddress';
import TokenAmountInput from '@/components/common/token-amount-input';
import DialogContent from './DialogContent';
import ActionButtons from './ActionButtons';

const EditCollateralDialog: React.FC<EditCollateralDialogProps> = ({
  isOpen,
  onClose,
  loanContractData,

  depositProps,
  withdrawProps,
}) => {
  const { t: getLoanLabel } = useTranslation(LangConstant.NS_LOAN);
  const { t: getHomeLabel } = useTranslation(LangConstant.NS_HOME);

  const { windowWidth } = useWindowSize();

  const { connectedChainAddress } = useAuthContext();
  const { selectedChainTokensBalance } = useHomeContext();
  const { selectedChain, selectedChainTokensPriceFeed } = useAppContext();

  const { onResetData: onResetDeposit } = depositProps;
  const { onResetData: onResetWithdraw } = withdrawProps;

  const [newCollateral, setNewCollateral] = useState(0);

  const balance = useMemo(() => {
    return CommonUtils.getBalanceByChainAndToken({
      token: loanContractData.collateral.token,
      balanceMap: selectedChainTokensBalance,
    });
  }, [loanContractData, selectedChainTokensBalance]);

  const convertedInputAmount = useMemo(() => {
    return (
      (selectedChainTokensPriceFeed.get(loanContractData.collateral.token)
        ?.price || 0) * newCollateral
    );
  }, [
    newCollateral,
    selectedChain,
    selectedChainTokensPriceFeed,
    loanContractData,
  ]);

  const newHealthRatio = useMemo(() => {
    return convertedInputAmount / loanContractData.amount;
  }, [convertedInputAmount, loanContractData]);

  const handleChangeCollateral = (value: string) => {
    if (
      (value === null || value === undefined) &&
      !loanContractData.collateral.amount
    ) {
      setNewCollateral(0);
    } else {
      setNewCollateral(Number(value));
    }
  };

  const handleCloseDialog = () => {
    if (onResetDeposit instanceof Function) {
      onResetDeposit();
    }

    if (onResetWithdraw instanceof Function) {
      onResetWithdraw();
    }

    onClose();
    setNewCollateral(loanContractData.collateral.amount);
  };

  useEffect(() => {
    setNewCollateral(loanContractData.collateral.amount);
  }, []);

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={handleCloseDialog}
      closeIconClassName="right-4"
      isShowIconClose={windowWidth <= AppConstant.BREAK_POINTS.sm}
      contentClassName={twJoin('px-0', 'flex flex-col', 'h-[80vh] sm:h-auto')}
    >
      <DialogHeader
        isShowCollateral={false}
        headerLabel={getLoanLabel('lEdit')}
        loanContractData={loanContractData}
      />

      <div
        className={twJoin(
          'w-full',
          'px-4 pb-6',
          'border-b border-b-characterBackground2',
        )}
      >
        <div className={twJoin('mt-5 mb-3', 'w-full', 'space-between-root')}>
          <span
            className={twJoin(
              'font-medium',
              'inline-block',
              'text-sm text-neutral1',
              'flex items-center gap-x-1',
            )}
          >
            {getHomeLabel('lCollateral')}
            <InfoIcon className="text-neutral5" />
          </span>

          <div className="flex items-center gap-x-[2px]">
            <SelectChainButton
              selectChainBorrow={selectedChain}
              onSelectChainBorrow={() => {
                return;
              }}
            />
            <CurrentAddress walletAddress={connectedChainAddress} />
          </div>
        </div>

        <TokenAmountInput
          triggerProps={{ disabled: true }}
          minValue={0}
          balance={balance}
          innitValue={newCollateral}
          token={loanContractData.collateral.token}
          convertedBalance={convertedInputAmount}
          onChangeValue={handleChangeCollateral}
          selectedChain={loanContractData.chain}
          onSelectToken={() => {}}
        />
      </div>

      <DialogContent
        newHealthRatio={newHealthRatio}
        newCollateral={newCollateral}
        loanContractData={loanContractData}
      />

      <ActionButtons
        depositProps={depositProps}
        withdrawProps={withdrawProps}
        newCollateral={newCollateral}
        newHealthRatio={newHealthRatio}
        loanContractData={loanContractData}
        onClose={handleCloseDialog}
      />
    </CommonDialog>
  );
};

export default withWithdrawCollateralController(
  withDepositCollateralController(EditCollateralDialog),
);

interface EditCollateralDialogProps extends CollateralHOCsProps {
  isOpen: boolean;
  onClose: () => void;

  loanContractData: LoanContractViewInterface;
}

interface CollateralHOCsProps {
  depositProps: WithDepositCollateralComponentProps;

  withdrawProps: WithWithdrawCollateralComponentProps;
}
