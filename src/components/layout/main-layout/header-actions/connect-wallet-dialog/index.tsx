'use client';

import React, { Fragment } from 'react';
import { twJoin } from 'tailwind-merge';
import { useAppContext } from '@/context';
import { SupportedChainEnum } from '@/models';
import { useTranslation } from 'react-i18next';
import { CommonDialog } from '@/components/common';

import SolanaWalletList from './SolanaWalletList';
import AptosWalletList from './AptosWalletList';

const ConnectWalletDialog: React.FC<ConnectWalletDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t: getLabel } = useTranslation();

  const { selectedChain } = useAppContext();

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={getLabel('lConnectWallet')}
      titleClassName={twJoin('font-semibold', 'text-lg text-neutral2')}
    >
      <div className="w-full mt-5">
        {selectedChain === SupportedChainEnum.Solana ||
        selectedChain === SupportedChainEnum.Eclipse ? (
          <SolanaWalletList onClose={onClose} />
        ) : selectedChain === SupportedChainEnum.AptosMovement ? (
          <AptosWalletList onClose={onClose} />
        ) : (
          <Fragment />
        )}
      </div>
    </CommonDialog>
  );
};

export default ConnectWalletDialog;

interface ConnectWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
