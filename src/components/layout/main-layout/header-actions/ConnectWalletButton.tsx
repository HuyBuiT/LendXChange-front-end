'use client';

import React from 'react';
import { twJoin } from 'tailwind-merge';
import { SupportedChainEnum } from '@/models';
import { useTranslation } from 'react-i18next';
import { ConnectModal } from '@mysten/dapp-kit';
import { CommonButton } from '@/components/common';
import { useAppContext, useAuthContext } from '@/context';

import ConnectWalletDialog from './connect-wallet-dialog';

const ConnectWalletButton = () => {
  const { t: getLabel } = useTranslation();

  const { selectedChain } = useAppContext();
  const { isConnecting, isOpenConnectDialog, setIsOpenConnectDialog } =
    useAuthContext();

  return selectedChain === SupportedChainEnum.SuiMovement ||
    selectedChain === SupportedChainEnum.Sui ? (
    <ConnectModal
      trigger={
        <div
          className={twJoin(
            'eclipse',
            'py-2 px-4',
            'max-h-[36px]',
            'cursor-pointer',
            'rounded-[56px]',
            'overflow-hidden',
            'bg-primary6 hover:bg-primary4',
            'font-inter font-medium text-sm text-neutral1',
          )}
        >
          {getLabel(isConnecting ? 'lConnecting' : 'lConnectWallet')}
        </div>
      }
      open={isOpenConnectDialog}
      onOpenChange={(isOpen) => setIsOpenConnectDialog(isOpen)}
    />
  ) : (
    <>
      <CommonButton
        className={twJoin('eclipse', 'max-h-[36px]', 'rounded-[56px]')}
        disabled={isConnecting}
        onClick={() => setIsOpenConnectDialog(true)}
      >
        {getLabel(isConnecting ? 'lConnecting' : 'lConnectWallet')}
      </CommonButton>

      <ConnectWalletDialog
        isOpen={isOpenConnectDialog}
        onClose={() => setIsOpenConnectDialog(false)}
      />
    </>
  );
};

export default ConnectWalletButton;
